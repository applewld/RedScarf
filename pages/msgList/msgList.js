var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    msgList: [],
    hasData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      userId: app.globalData.userId
    });
    this.getMsgList();
  },
  onShow: function () {
    this.getMsgList();
  },
  getMsgList: function () {
    let that = this;
    wx.request({
      url: app.globalData.httpHost +'/message/getMsgList',
      method: 'POST',
      data: {
        userId: that.data.userId
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          let tempdata = res.data.returnValue;
          for (let i = 0; i < tempdata.length; i++) {
            tempdata[i].date = utils.formatTime(tempdata[i].date);
          }
          that.setData({
            hasData: true,
            msgList: tempdata
          });
        }
        else if (res.data.code == 2) {
          that.setData({
            hasData: false,
            msgList: []
          });
        }
        else {
          //出错
        }
      }
    })
  },
  goChat: function (e) {
    let toUser = e.currentTarget.dataset.touser;
    let data = {
      userId: toUser.toUserId,
      avatarUrl: toUser.avatarUrl,
      nickName: toUser.nickName
    }
    data = JSON.stringify(data);
    wx.navigateTo({
      url: '../chat/chat?toUser=' + data,
    })
  }
})