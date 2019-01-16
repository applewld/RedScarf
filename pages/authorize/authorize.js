var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo){
      app.globalData.userInfo= e.detail.userInfo;
      wx.setStorageSync("userInfo", e.detail.userInfo);
      wx.switchTab({
        url: '../info/info'
      })
      wx.request({
        url: app.globalData.httpHost+'/users/addUserInfo',
        method: "POST",
        data:{
          userId: app.globalData.userId,
          userInfo: app.globalData.userInfo
        },
        success:function(res){
          if (res.data.returnValue.code == 0){
            console.log(res.data.returnValue.returnValue);
          }
        }
      });
    }
  }
})