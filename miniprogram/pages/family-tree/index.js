// pages/family-tree/index.js
const { familyList } = require("../../data/family-data.js");

Page({
  data: {
    loading: true,
    selectedMember: null,
    familyData: null,
    scale: 0.6,
    offsetX: 0,
    offsetY: 0,
    containerWidth: 10000,
    containerHeight: 10000
  },

  onLoad(options) {
    console.log("[FamilyTree] Page onLoad");
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight || 20
    });
    this.loadFamilyData();
  },

  // 加载家族数据
  async loadFamilyData() {
    console.log("[FamilyTree] loadFamilyData started");
    try {
      console.log("[FamilyTree] Using local flat data:", familyList);

      if (!familyList || familyList.length === 0) {
        console.error("[FamilyTree] familyList is empty or undefined");
        return;
      }

      const treeData = this.buildTree(familyList);
      console.log("[FamilyTree] Built tree data:", treeData);

      // Calculate tree dimensions
      const treeSize = this.calculateTreeSize(treeData);
      console.log("[FamilyTree] Tree size:", treeSize);

      const sysInfo = wx.getSystemInfoSync();
      const windowWidth = sysInfo.windowWidth;

      // Estimate required size.
      // Use a generous multiplier (e.g., 220rpx per leaf)
      const widthRpx = Math.max(10000, treeSize.leaves * 240);
      const heightRpx = Math.max(10000, treeSize.depth * 500);

      const containerWidthPx = widthRpx * (windowWidth / 750);

      console.log(`[FamilyTree] Container size: ${widthRpx}rpx x ${heightRpx}rpx`);

      // User requested fixed initial view position (from manual adjustment)
      const offsetX = -496.5;
      const offsetY = -367.6;
      const fitScale = 0.6;

      this.setData({
        familyData: treeData,
        loading: false,
        containerWidth: widthRpx, // rpx for wxml
        containerHeight: heightRpx,
        offsetX: offsetX,
        offsetY: offsetY,
        scale: fitScale,
        fitScale: fitScale
        // targetId removed to prevent auto-centering
      });

    } catch (e) {
      console.error("[FamilyTree] Error in loadFamilyData:", e);
      this.setData({ loading: false });
    }
  },

  // Handle target node found event
  onFoundTarget(e) {
    // Disabled centering logic as per user request
    console.log("[FamilyTree] Target found but ignoring center logic.");
  },

  // Calculate tree depth and number of leaves
  calculateTreeSize(node) {
    if (!node) return { depth: 0, leaves: 0 };

    if (!node.children || node.children.length === 0) {
      return { depth: 1, leaves: 1 };
    }

    let maxDepth = 0;
    let totalLeaves = 0;

    node.children.forEach(child => {
      const stats = this.calculateTreeSize(child);
      if (stats.depth > maxDepth) maxDepth = stats.depth;
      totalLeaves += stats.leaves;
    });

    return {
      depth: maxDepth + 1,
      leaves: totalLeaves
    };
  },

  // 将扁平列表转换为树形结构
  buildTree(flatList) {
    const list = JSON.parse(JSON.stringify(flatList)); // Deep copy
    const map = {};
    const roots = [];

    // First pass: create map of nodes
    list.forEach(node => {
      node.children = [];
      map[node.id] = node;
    });

    // Second pass: link children to parents
    list.forEach(node => {
      if (node.pid) {
        if (map[node.pid]) {
          map[node.pid].children.push(node);
        } else {
          console.warn(`[FamilyTree] Parent ${node.pid} not found for node ${node.id}`);
        }
      } else {
        // No pid means it's a root node
        roots.push(node);
      }
    });

    if (roots.length === 0) return null;

    if (roots.length === 1) {
      return roots[0];
    } else {
      console.log(`[FamilyTree] Found ${roots.length} roots. Creating virtual root.`);
      return {
        id: "virtual_root",
        name: "李氏宗谱",
        relation: "宗族",
        children: roots,
        _virtual: true // Marker if we want strict styling
      };
    }
  },

  // 放大
  onZoomIn() {
    this.setData({
      scale: Math.min(this.data.scale + 0.1, 1.5)
    });
  },

  // 缩小
  onZoomOut() {
    this.setData({
      scale: Math.max(this.data.scale - 0.1, 0.5)
    });
  },

  // 处理节点点击
  onNodeTap(e) {
    console.log("Node tapped:", e.detail.node);
    const node = e.detail.node;
    if (node) {
      this.showMemberDetail(node);
    }
  },

  // 显示成员详情
  showMemberDetail(node) {
    const lastChar = node.name.slice(-1);
    this.setData({
      selectedMember: {
        ...node,
        lastChar: lastChar,
      },
    });
  },

  // 关闭弹窗
  onCloseModal() {
    this.setData({
      selectedMember: null,
    });
  },

  // Back button handler
  onBack() {
    wx.navigateBack({
      fail: () => {
        // Fallback to home if no history (e.g. entered directly)
        wx.reLaunch({ url: '/pages/home/index' });
      }
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
  },
});
