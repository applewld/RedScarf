var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    rewardMoney: 0,
    content: ''
  },
  radioChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      type: e.detail.value
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
    wx.showLoading({
      title: '发布中',
    })
    if (this.data.type == 0) {
      wx.request({
        url: app.globalData.httpHost +'/notice/saveRewardNotice',
        method: "POST",
        data: {
          userId: app.globalData.userId,
          campus: app.globalData.campus,
          school: app.globalData.school,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName,
          rewardMoney: this.data.rewardMoney,
          content: this.data.content
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
          else {
            wx.showToast({
              title: "发布失败",
              icon: 'none',
              duration: 3000
            });
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });

    }
    else {
      wx.request({
        url: app.globalData.httpHost +'/notice/saveWaitOrderNotice',
        method: "POST",
        data: {
          userId: app.globalData.userId,
          campus: app.globalData.campus,
          school: app.globalData.school,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName,
          rewardMoney: this.data.rewardMoney,
          content: this.data.content
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
          else {
            wx.showToast({
              title: "发布失败",
              icon: 'none',
              duration: 3000
            });
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });

    }

  }
})