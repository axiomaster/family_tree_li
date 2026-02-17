Page({
    data: {
        statusBarHeight: 0,
        imageList: []
    },

    onLoad() {
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight
        });

        const cloudFileIDs = [
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p1.jpg',
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p2.jpg',
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p3.jpg',
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p4.jpg',
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p5.jpg',
            'cloud://cloud1-1guizlx0ef2ca2ab.636c-cloud1-1guizlx0ef2ca2ab-1405026009/family_tree/family_tree_93_p6.jpg'
        ];

        wx.cloud.getTempFileURL({
            fileList: cloudFileIDs,
            success: res => {
                if (res.fileList) {
                    const urls = res.fileList.map(file => file.tempFileURL);
                    this.setData({
                        imageList: urls
                    });
                }
            },
            fail: err => {
                console.error("Failed to retrieve gallery images", err);
            }
        });
    },

    onBack() {
        wx.navigateBack();
    },

    onPreviewImage(e) {
        const current = e.currentTarget.dataset.src;
        wx.previewImage({
            current,
            urls: this.data.imageList
        });
    }
});
