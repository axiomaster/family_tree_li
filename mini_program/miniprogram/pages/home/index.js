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
            config: {
                env: 'cloud1-1guizlx0ef2ca2ab'
            },
            fileList: ['cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/bg.png'],
            success: res => {
                // Check if we have a valid file result
                const fileResult = res.fileList && res.fileList[0];

                if (fileResult && fileResult.status === 0 && fileResult.tempFileURL) {
                    console.log('Banner URL fetched successfully:', fileResult.tempFileURL);
                    this.setData({
                        bannerImage: fileResult.tempFileURL
                    });
                } else {
                    // Log the specific error for the file
                    console.error('Failed to get banner URL. Details:', JSON.stringify(fileResult));
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

    navToHistory() {
      wx.navigateTo({
          url: '/pages/history/index'
      });
    },

    navToAddMember() {
        wx.navigateTo({
            url: '/pages/add-member/index'
        });
    }
});
