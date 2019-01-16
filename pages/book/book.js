var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let notice = JSON.parse(options.notice);
      this.setData({
        notice: notice
      });
  },

  inputMoney: function (e) {
    this.setData({
      rewardMoney: e.detail.value
    });
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  submit: function () {
    let Notice = this.data.notice;
    wx.showLoading({
      title: '预定中',
    });
    wx.request({
      url: app.globalData.httpHost +'/order/saveBookOrder',
      method: "POST",
      data: {
        noticeId: Notice._id,
        rewardMoney: Notice.rewardMoney,//赏金
        content: Notice.content,//订单内容
        orderUserId: app.globalData.userId,//接单者信息
        orderAvatarUrl: app.globalData.userInfo.avatarUrl,
        orderNickName: app.globalData.userInfo.nickName,
        receiveUserId: Notice.userId,//订单者信息
        receiveAvatarUrl: Notice.avatarUrl, 
        receiveNickName: Notice.nickName
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.returnValue);
          wx.hideLoading();
          wx.showToast({
            title: res.data.returnValue,
            icon: 'success',
            duration: 3000
          });
          wx.navigateBack({
            delta: 1
          })
        }
      }

    })
  }
})