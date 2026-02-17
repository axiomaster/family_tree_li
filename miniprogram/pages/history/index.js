Page({
    data: {
        statusBarHeight: 0
    },

    onLoad(options) {
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight
        });
    },

    onBack() {
        wx.navigateBack({
            fail: () => {
                wx.reLaunch({ url: '/pages/home/index' });
            }
        });
    },

    copyLink(e) {
        const url = e.currentTarget.dataset.url;
        wx.setClipboardData({
            data: url,
            success: () => {
                wx.showToast({
                    title: '链接已复制',
                    icon: 'success'
                });
            }
        });
    }
});
