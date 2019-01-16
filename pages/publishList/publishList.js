var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    hasData: false,
    NoticeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      first: true
    });
    this.getRewardList();
  },
  tapReward: function () {
    this.setData({
      first: true
    });
    this.getRewardList();
  },
  tapWaitOrder: function () {
    this.setData({
      first: false
    });
    this.getWaitOrderList();
  },
  getWaitOrderList: function () {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/notice/getWaitOrderList",
      data: {
        userId: app.globalData.userId
      },
      method: "POST",
      success: function (res) {
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
        }
        else if (res.data.code == 2) {
          that.setData({
            NoticeList: res.data.returnValue,
            hasData: false
          });
        }
        else {
          //出错
        }
      }
    })
  },

  getRewardList: function () {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/notice/getRewardList",
      data: {
        userId: app.globalData.userId
      },
      method: "POST",
      success: function (res) {
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
        }
        else if (res.data.code == 2) {
          that.setData({
            NoticeList: res.data.returnValue,
            hasData: false
          });
        }
        else {
          //出错
        }
      }
    })
  },
  deleteRewardNotice: function (e) {
    let that = this;
    let noticeid = e.target.dataset.noticeid;
    wx.request({
      url: app.globalData.httpHost +'/notice/deleteRewardNotice',
      method: "POST",
      data: {
        noticeId: noticeid
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.returnValue);
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 3000
          });
          if (that.data.first) {
            that.getRewardList();
          }
          else {
            that.getWaitOrderList();
          }
        }
      }
    });
  },
  cancelPublish: function (e) {
    let that = this;
    let noticeid = e.target.dataset.noticeid;
    wx.request({
      url: app.globalData.httpHost +'/notice/cancelPublish',
      method: "POST",
      data: {
        noticeId: noticeid
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.returnValue);
          wx.showToast({
            title: '取消发布成功',
            icon: 'success',
            duration: 3000
          });
          if (that.data.first) {
            that.getRewardList();
          }
          else {
            that.getWaitOrderList();
          }
        }
      }
    });
  },
  deleteWaitOrderNotice: function (e) {
    let that = this;
    let noticeid = e.target.dataset.noticeid;
    wx.request({
      url: app.globalData.httpHost +'/order/getIsAllDeal',
      method: "POST",
      data: {
        noticeId: noticeid
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.returnValue.IsAllDeal) {
            wx.request({
              url: app.globalData.httpHost +'/notice/deleteWaitOrderNotice',
              method: "POST",
              data: {
                noticeId: noticeid
              },
              success: function (res) {
                  console.log(res.data);
                  if(res.data.code==0){
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 3000
                    });
                    that.getWaitOrderList();
                  }
              }
            });
          }
          else {
            wx.showModal({
              title: '提示',
              content: '不能删除记录，还有预定消息未处理',
              showCancel:false,
              confirmText:'ok'
            });
          }
        }
      }
    });
  },
  goUserPublish: function () {
    wx.navigateTo({
      url: '../userPublish/userPublish',
    });
  },
  goBookDetail: function (e) {
    let noticeid = e.currentTarget.dataset.noticeid;
    console.log(noticeid)
    wx.navigateTo({
      url: '../bookDetail/bookDetail?noticeid=' + noticeid,
    });
  },
})