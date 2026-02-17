Page({
    data: {
        hasImage: false, // Toggle if real image is available
        statusBarHeight: 0,
        bannerImage: ""
    },

    onLoad() {
        // Handle Status Bar
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight
        });

        // Get Cloud Image URL
        wx.cloud.getTempFileURL({
            fileList: ['cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/bg.png'],
            success: res => {
                // If the status is not 0, it means failure usually, but we check tempFileURL
                if (res.fileList && res.fileList[0].tempFileURL) {
                    this.setData({
                        bannerImage: res.fileList[0].tempFileURL
                    });
                }
            },
            fail: err => {
                console.error("Failed to retrieve banner image URL", err);
            }
        });
    },

    navToTree() {
        wx.navigateTo({
            url: '/pages/family-tree/index'
        });
    },

    navToLegacy() {
        wx.navigateTo({
            url: '/pages/legacy-tree/index'
        });
    },

    navToInstruction() {
        wx.navigateTo({
            url: '/pages/instruction/index'
        });
    },

    navToAddMember() {
        wx.navigateTo({
            url: '/pages/add-member/index'
        });
    }
});
