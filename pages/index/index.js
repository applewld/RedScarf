const app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    motto: '进入红领巾',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo){
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
      app.globalData.userInfo = userInfo;
    }
    else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        app.globalData.userInfo = userInfo;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }
  },
  // 不清空数据，不会执行这个函数
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.setStorageSync("userInfo", e.detail.userInfo)
    }
    else{
      this.setData({
        hasUserInfo: true
      });
    }
  },
// 弹出框
  goHomePage: function(e) {
    let school =  wx.getStorageSync("school");
    let campus = wx.getStorageSync("campus");
    let userId = wx.getStorageSync("userId");
    if(school&&campus){
      app.globalData.school = school;
      app.globalData.campus = campus;
      if (userId) {
        app.globalData.userId = userId;
        wx.switchTab({
          url: '/pages/home/home'
        });
      }
      else{
        wx.switchTab({
          url: '/pages/home/home'
        });
        util.login();
      }
    }
    else{
      this.setData({
        showModal: true
      });
    }

  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  inputSchool: function(e) {
    this.setData({
      school: e.detail.value
    });
    app.globalData.school = e.detail.value;
    wx.setStorageSync("school", e.detail.value);
  },
  inputCampus: function(e) {
    this.setData({
      campus: e.detail.value
    });
    app.globalData.campus = e.detail.value;
    wx.setStorageSync("campus", e.detail.value);
  },
  onConfirm: function() {
    let userId = wx.getStorageSync("userId");    
    if (userId) {
      app.globalData.userId = userId;
    }
    else{
      util.login();
    }
    this.hideModal();
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})