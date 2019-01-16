var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRewardNotice: false,
    showWaitOrderNotice: false,
    showListItem: false,
    RewardNotices: [],
    WaitOrderNotices: [],
    userId: '',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gosearch: function (e) {
    let that = this;
    let input = e.detail.value;
    if (input == "")
      return;
    wx.request({
      url: app.globalData.httpHost +'/notice/searchRewardNotice',
      method: "POST",
      data: {
        content: input,
        campus: app.globalData.campus,
        school: app.globalData.school
      },
      success: function (res) {
        if (res.data.code == 0) {
          let tempdata1 = res.data.returnValue.RewardNotice;
          for (let i = 0; i < tempdata1.length; i++) {
            tempdata1[i].date = utils.formatDisplayTime(tempdata1[i].date);
          }
          let tempdata2 = res.data.returnValue.WaitOrderNotice;
          for (let i = 0; i < tempdata2.length; i++) {
            tempdata2[i].date = utils.formatDisplayTime(tempdata2[i].date);
          }
          that.setData({
            content:input,
            showListItem: true,
            RewardNotices: tempdata1,
            WaitOrderNotices: tempdata2
          });
        }
      }
    })
  },
  refreshSearch:function(){
    let that = this;
    let input = this.data.content;
    if (input == "")
      return;
    wx.request({
      url: app.globalData.httpHost +'/notice/searchRewardNotice',
      method: "POST",
      data: {
        content: input,
        campus: app.globalData.campus,
        school: app.globalData.school
      },
      success: function (res) {
        if (res.data.code == 0) {
          let tempdata1 = res.data.returnValue.RewardNotice;
          for (let i = 0; i < tempdata1.length; i++) {
            tempdata1[i].date = utils.formatDisplayTime(tempdata1[i].date);
          }
          let tempdata2 = res.data.returnValue.WaitOrderNotice;
          for (let i = 0; i < tempdata2.length; i++) {
            tempdata2[i].date = utils.formatDisplayTime(tempdata2[i].date);
          }
          that.setData({
            content: input,
            showListItem: true,
            RewardNotices: tempdata1,
            WaitOrderNotices: tempdata2
          });
        }
      }
    })
  },
  showRewardNotice: function () {
    this.setData({
      showRewardNotice: !this.data.showRewardNotice
    });
  },
  showWaitOrderNotice: function () {
    this.setData({
      showWaitOrderNotice: !this.data.showWaitOrderNotice
    });
  },
  tapTakeOrder: function (e) {
    let that = this;
    let Notice = e.target.dataset.notice;
    if (app.globalData.userId != Notice.userId) {
      wx.request({
        url: app.globalData.httpHost +"/order/saveOrder",
        data: {
          noticeId: Notice._id,
          rewardMoney: Notice.rewardMoney, //赏金
          content: Notice.content, //订单内容
          orderUserId: Notice.userId, //订单者信息
          orderAvatarUrl: Notice.avatarUrl,
          orderNickName: Notice.nickName,
          receiveUserId: app.globalData.userId, //接单者信息
          receiveAvatarUrl: app.globalData.userInfo.avatarUrl,
          receiveNickName: app.globalData.userInfo.nickName
        },
        method: "POST",
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.returnValue,
              icon: 'success',
              duration: 3000
            })
            that.refreshSearch();
          } else {
            //出错
          }
        }
      })
    }

  },
  tapbook: function (e) {
    let notice = e.target.dataset.notice;
    if (app.globalData.userId != notice.userId) {
      let data = JSON.stringify(notice);
      wx.navigateTo({
        url: '../book/book?notice=' + data
      });
    }
  }
})