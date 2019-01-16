var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetailList:[],
    hasData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        noticeid: options.noticeid
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
  },

  loadData:function(){
    let that = this;
    wx.request({
      url: app.globalData.httpHost +"/order/getNoticeDetail",
      data: {
        noticeId: this.data.noticeid,
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 0) {
          let tempdata = res.data.returnValue;
          for (let i = 0; i < tempdata.length; i++) {
            tempdata[i].date = utils.formatDisplayTime(tempdata[i].date);
          }
          that.setData({
            bookDetailList: res.data.returnValue,
            hasData: true
          });
        } else if (res.data.code == 2) {
          that.setData({
            bookDetailList: res.data.returnValue,
            hasData: false
          });
        } else {
          //出错
        }
      }
    })
  },
  refuceTakeOrder: function (e) {
    let that = this;
    var orderId = e.target.dataset.orderid;
    wx.request({
      url: app.globalData.httpHost +'/order/refuceTakeOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '拒绝接单成功',
            icon: 'success',
            duration: 3000
          });
          that.loadData();
        }
      }
    });
  },  
  confirmTakeOrder:function(e){
    let that = this;
    var orderId = e.target.dataset.orderid;
    console.log(e);
    wx.request({
      url: app.globalData.httpHost +'/order/confirmTakeOrder',
      method: "POST",
      data: {
        orderId: orderId
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '接单成功',
            icon: 'success',
            duration: 3000
          });
          that.loadData();
        }
      }
    });
  }
})