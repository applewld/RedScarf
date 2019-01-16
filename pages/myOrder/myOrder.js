var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    hasData: false,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userId
    });
    this.getOrderList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userId: app.globalData.userId
    });
    this.getOrderList();
  },
  getOrderList: function () {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/order/getOrderList",
      data: {
        userId:that.data.userId
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
            orderList: tempdata,
            hasData: true
          });
        }
        else if (res.data.code == 2) {
          that.setData({
            orderList: res.data.returnValue,
            hasData: false
          });
        }
        else {
          //出错
        }
      }
    })
  },
  cancelOrder:function(e){
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/orderderCancelOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消订单成功',
            icon: 'success',
            duration: 3000
          });
          that.getOrderList();
        }
      }
    });
  },
  cancelBook:function(e){
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/orderderCancelBook',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消预定成功',
            icon: 'success',
            duration: 3000
          });
          that.getOrderList();
        }
      }
    });
  },
  confirmFinish: function (e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/orderderConfirmOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        console.log(res.data.returnValue);
        if (res.data.code == 0) {
          wx.showToast({
            title: '已确认完成订单',
            icon: 'success',
            duration: 3000
          });
          that.getOrderList();
        }
      }
    });
  },
  deleteRecord: function (e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/orderderDeleteOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        console.log(res.data.returnValue);
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除订单成功',
            icon: 'success',
            duration: 3000
          });
          that.getOrderList();
        }
      }
    });
  },
  startContact: function (e) {
    let toUser = e.target.dataset.touser;
    let data = {
      userId: toUser.receiveUserId,
      avatarUrl: toUser.receiveAvatarUrl,
      nickName: toUser.receiveNickName
    }
    data = JSON.stringify(data);
    wx.navigateTo({
      url: '../chat/chat?toUser=' + data,
    })
  }
})