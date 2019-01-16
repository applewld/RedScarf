var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    NoticeList: [],
    hasData: false,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userId: app.globalData.userId
    });
    this.getRewardNotice();
  },
  onShow: function() {

  },
  tapReward: function() {
    this.setData({
      first: true
    });
    this.getRewardNotice();
  },
  tapWaitOrder: function() {
    this.setData({
      first: false
    });
    this.getWaitOrderNotice();
  },
  getWaitOrderNotice: function() {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/notice/getWaitOrderNoticeList",
      data: {
        school: app.globalData.school,
        campus: app.globalData.campus
      },
      method: "POST",
      success: function(res) {
        if (res.data.code == 0) {
          let tempList = [];
          let tempdata = res.data.returnValue;
          for (let i = 0; i < tempdata.length; i++) {
            tempdata[i].date = utils.formatDisplayTime(tempdata[i].date);
          }
          that.setData({
            NoticeList: tempdata,
            hasData: true
          });
        } else if (res.data.code == 2) {
          that.setData({
            NoticeList: res.data.returnValue,
            hasData: false
          });
        } else {
          //出错
        }
      }
    })
  },

  getRewardNotice: function() {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/notice/getRewardNoticeList",
      data: {
        school: app.globalData.school,
        campus: app.globalData.campus
      },
      method: "POST",
      success: function(res) {
        if (res.data.code == 0) {
          let tempList = [];
          let tempdata = res.data.returnValue;
          for (let i=0; i < tempdata.length; i++) {
            tempdata[i].date = utils.formatDisplayTime(tempdata[i].date);
          }
          that.setData({
            NoticeList: tempdata,
            hasData: true
          });
        } else if (res.data.code == 2) {
          that.setData({
            NoticeList: res.data.returnValue,
            hasData: false
          });
        } else {
          //出错
        }
      }
    })
  },
  tapTakeOrder: function(e) {
    let that = this;
    let Notice = e.target.dataset.notice;
    if (this.data.userId != Notice.userId) {
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
        success: function(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.returnValue,
              icon: 'success',
              duration: 3000
            })
            that.getRewardNotice();
          } else {
            //出错
          }
        }
      })
    }

  },
  tapbook: function(e) {
    let notice = e.target.dataset.notice;
    if (this.data.userId != notice.userId) {
      let data = JSON.stringify(notice);
      wx.navigateTo({
        url: '../book/book?notice=' + data
      });
    }
  },
  goSearch: function(e){
    wx.navigateTo({
      url: '../search/search',
    })
  }
})