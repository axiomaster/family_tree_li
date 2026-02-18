const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 获取家族树数据
const getFamilyTree = async () => {
  try {
    const res = await db.collection("family_tree").limit(1).get();
    if (res.data && res.data.length > 0) {
      return {
        success: true,
        data: res.data[0].treeData,
      };
    }
    return {
      success: false,
      errMsg: "No data found",
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message,
    };
  }
};

// 保存家族树数据
const saveFamilyTree = async (event) => {
  try {
    const { treeData } = event;

    // 检查是否已存在数据
    const existing = await db.collection("family_tree").limit(1).get();

    if (existing.data && existing.data.length > 0) {
      // 更新现有数据
      await db
        .collection("family_tree")
        .doc(existing.data[0]._id)
        .update({
          data: {
            treeData: treeData,
            updateTime: new Date(),
          },
        });
      return {
        success: true,
        data: "updated",
      };
    } else {
      // 创建新数据
      await db.collection("family_tree").add({
        data: {
          treeData: treeData,
          createTime: new Date(),
          updateTime: new Date(),
        },
      });
      return {
        success: true,
        data: "created",
      };
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e.message,
    };
  }
};

// 导入JSON数据
const importJSON = async (event) => {
  try {
    const { jsonData } = event;
    const treeData = JSON.parse(jsonData);

    // 验证数据格式
    if (!treeData.id || !treeData.name) {
      return {
        success: false,
        errMsg: "Invalid data format",
      };
    }

    // 保存到数据库
    const result = await saveFamilyTree({ treeData });

    return result;
  } catch (e) {
    return {
      success: false,
      errMsg: e.message,
    };
  }
};

// 导出JSON数据
const exportJSON = async () => {
  try {
    const result = await getFamilyTree();
    if (result.success) {
      return {
        success: true,
        data: JSON.stringify(result.data, null, 2),
      };
    }
    return result;
  } catch (e) {
    return {
      success: false,
      errMsg: e.message,
    };
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  const { type } = event;

  switch (type) {
    case "get":
      return await getFamilyTree();
    case "save":
      return await saveFamilyTree(event);
    case "import":
      return await importJSON(event);
    case "export":
      return await exportJSON();
    default:
      return {
        success: false,
        errMsg: "Invalid operation type",
      };
  }
};
