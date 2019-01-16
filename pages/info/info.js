var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    userInfo: {},
    userId: '',
    hasMsg:false,
    school:'',
    campus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      school: app.globalData.school,
      campus: app.globalData.campus
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
      if (app.globalData.userId) {
        this.setData({
          userId: app.globalData.userId
        });
      //  this.haveNotRead();
      } else {
        util.login();
      }
    } else {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.redirectTo({
              url: '../authorize/authorize',
            })
          }
        }
      })
    }
  },
  onShow:function(){
    this.haveNotRead();
  },
  haveNotRead:function(){
    let that = this;    
    wx.request({
      url: app.globalData.httpHost +'/message/haveNotRead',
      method: 'POST',
      data: {
        userId: that.data.userId,
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasMsg: true
          });
        }
        else if (res.data.code == 2){
          that.setData({
            hasMsg: false
          });
        }
      }
    })
  },
  // 弹出框
  showModal: function(e) {
    this.setData({
      showModal: true
    })

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
    this.hideModal();
    wx.showLoading({
      title: '修改中',
    })
    wx.request({
      url: app.globalData.httpHost +'/users/updateUserSchoolCampus',
      method: "POST",
      data: {
        userId: app.globalData.userId,
        campus: app.globalData.campus,
        school: app.globalData.school
      },
      success: function(res) {
        if (res.data.code == 0) {
          console.log(res.data.returnValue);
          wx.hideLoading();
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 3000
          })
        }
      }
    });

  },

  goPublishList: function() {
    wx.navigateTo({
      url: '../publishList/publishList',
    });
  },
  goMyOrder: function() {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    });
  },
  goMyReceive: function () {
    wx.navigateTo({
      url: '../myReceive/myReceive',
    });
  },
  goMsgList:function(){
    wx.navigateTo({
      url: '../msgList/msgList',
    })
  },
  goFeedBack:function(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  }
})