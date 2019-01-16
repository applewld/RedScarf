// pages/feedback/feedback.js
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
  bindFormSubmit:function(e){
      var data = e.detail.value.textarea;
      if(data){
          wx.request({
                  url: app.globalData.httpHost +'/users/sendEmailToMe',
                  method: 'POST',
                  data: {
                    content:data
                  },
                  success: function (res) {
                    if (res.data.code == 0) {
                      wx.showToast({
                        title: res.data.returnValue,
                        icon: 'success',
                        duration: 3000,
                      });
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      },3000);
                    }
                    else {
                      wx.showModal({
                        title: '提示',
                        content: res.data.errorReason,
                        showCancel: false,
                        confirmText: 'ok'
                      });
                    }
                  }
            })
      }else{
        wx.showModal({
          title: '提示',
          content: '提交反馈信息不能为空！',
          showCancel: false,
          confirmText: 'ok'
        });
      }
      
  }
})