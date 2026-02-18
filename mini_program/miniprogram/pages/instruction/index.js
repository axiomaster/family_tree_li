
Page({
    onLoad() {
        const sysInfo = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: sysInfo.statusBarHeight
        });
    },

    onBack() {
        wx.navigateBack();
    }
});
