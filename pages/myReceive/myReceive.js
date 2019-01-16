var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveList: [],
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
    this.getReceiveList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      userId: app.globalData.userId
    });
    this.getReceiveList();
  },
  getReceiveList: function() {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/order/getReceiveList",
      data: {
        userId: that.data.userId
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
            receiveList: tempdata,
            hasData: true
          });
        } else if (res.data.code == 2) {
          that.setData({
            receiveList: res.data.returnValue,
            hasData: false
          });
        } else {
          //出错
        }
      }
    })
  },
  cancelOrder: function(e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/receiverCancelOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function(res) {
        console.log(res.data.returnValue)
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消订单成功',
            icon: 'success',
            duration: 3000
          });
          that.getReceiveList();
        }
      }
    });
  },
  confirmFinish: function(e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/receiverConfirmOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function(res) {
        console.log(res.data.returnValue);
        if (res.data.code == 0) {
          wx.showToast({
            title: '已确认完成订单',
            icon: 'success',
            duration: 3000
          });
          that.getReceiveList();
        }
      }
    });
  },
  deleteRecord: function(e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/receiverDeleteOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function(res) {
        console.log(res.data.returnValue);
        if (res.data.code == 0) {
          wx.showToast({
            title: '删除订单成功',
            icon: 'success',
            duration: 3000
          });
          that.getReceiveList();
        }
      }
    });
  },
  startContact: function(e) {
    let toUser = e.target.dataset.touser;
    let data = {
      userId: toUser.orderUserId,
      avatarUrl: toUser.orderAvatarUrl,
      nickName: toUser.orderNickName
    }
    data = JSON.stringify(data);
    wx.navigateTo({
      url: '../chat/chat?toUser=' + data,
    })
  }
})