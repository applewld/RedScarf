var utils = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    messages: [], //聊天记录
    userId: null,
    userInfo: {},
    toUser: {},
    msg: '', // 当前输入
    lastId: '',
    scrollTop: 0, // 页面的滚动值
    socketOpen: false, // websocket是否打开
    isFirstSend: true, // 是否第一次发送消息(区分历史和新加)
    databaseMsgs: [],
    // storageMsgs: []
  },
  onLoad(options) {
    //得到聊天对方的信息
    let toUser = JSON.parse(options.toUser);
    this.setData({
      toUser
    });
    wx.setNavigationBarTitle({
      title: toUser.nickName
    })

  },
  onReady() {
    // 连接websocket服务器
    this.connect();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let that = this;
    const socketOpen = this.data.socketOpen;
    if (socketOpen) {
      wx.closeSocket({});
      wx.onSocketClose(res => {
        console.log('WebSocket 已关闭！')
      });
    }
    // wx.setStorageSync("messages", this.data.storageMsgs);
    wx.request({
      url: app.globalData.httpHost +'/message/saveMessage',//保存消息,并对方发过来的消息设置为已读
      method: 'POST',
      data: {
        msgs: JSON.stringify([]),
        userId: that.data.userId,
        toUserId: that.data.toUser.userId
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log("操作成功")
        }
        else {
          console.log("保存消息失败")
        }
      }
    })
  },
  connect() {
    wx.connectSocket({
      url: 'ws://localhost:3000'
    });
    wx.onSocketOpen(res => {
      console.log('WebSocket 已打开！')
      this.setData({
        socketOpen: true
      });
      let userInfo = wx.getStorageSync("userInfo");
      let userId = wx.getStorageSync("userId");
      this.setData({
        userId: userId,
        userInfo: userInfo
      })
      let oldMsgs = [],
        lastDate = {},
        showTime = true,
        msg = {};
        let that = this;
        wx.request({
          url: app.globalData.httpHost +'/message/getMessage',
          method: 'POST',
          data: {
            fromUserId: that.data.userId,
            toUserId: that.data.toUser.userId
          },
          success: function (res) {
            if (res.data.code == 0) {
              let databaseMsgs = JSON.parse(res.data.returnValue)
              for (let i = 0; i < databaseMsgs.length; i++) {
                if (lastDate != "{}") {
                  let lastdate = new Date(lastDate);
                  let curdate = new Date(databaseMsgs[i].date);
                  if (curdate.getTime() - lastdate.getTime() <= 180000) {
                    showTime = false;
                  } else {
                    showTime = true;
                  }
                } else {
                  showTime = true;
                }
                msg = {
                  date: utils.formatTime(databaseMsgs[i].date),
                  showTime: showTime,
                  type: databaseMsgs[i].fromUserId == that.data.userId ? 0 : 1,
                  content: databaseMsgs[i].content,
                  avatarUrl: (databaseMsgs[i].fromUserId == that.data.userId ? that.data.userInfo.avatarUrl : that.data.toUser.avatarUrl)
                }
                oldMsgs.push(msg);
                lastDate = databaseMsgs[i].date;
              }
              that.setData({
                messages: oldMsgs,
                lastDate: lastDate,
                lastId: ("msg" + (oldMsgs.length - 1).toString())
              });
            }
            else if (res.data.code == 2) {
              console.log(res.data.returnValue)
            }
            else {
              console.log("服务器错误");
            }
          }
        })
    });
    wx.onSocketMessage(res => {
      const data = JSON.parse(res.data);
      if ((data.fromUserId == this.data.userId && data.toUserId == this.data.toUser.userId) || (data.fromUserId == this.data.toUser.userId && data.toUserId == this.data.userId)) {
        let messages = this.data.messages;
        let showTime = true;
        if (this.data.lastDate) {
          let lastdate = new Date(this.data.lastDate);
          let curdate = new Date(data.date);
          if (curdate.getTime() - lastdate.getTime() <= 180000) {
            showTime = false;
          } else {
            showTime = true;
          }
        } else {
          showTime = true;
        }
        let msg = {
          date: utils.formatTime(data.date),
          showTime: showTime,
          type: data.fromUserId == this.data.userId ? 0 : 1,
          content: data.content,
          avatarUrl: (data.fromUserId == this.data.userId ? this.data.userInfo.avatarUrl : this.data.toUser.avatarUrl)
        }
        messages.push(msg);
        const length = messages.length;
        let lastId = "msg" + (length - 1);
        this.setData({
          messages,
          lastId,
          lastDate: data.date
        });

      }
    });
    wx.onSocketError(res => {
      console.log(res);
      console.log('WebSocket连接打开失败，请检查！')
    })
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    const messages = this.data.messages;
    const length = messages.length;
    const lastId = "msg" + (length - 1);
    setTimeout(() => {
      this.setData({
        lastId
      });
    }, 300);
  },
  bindChange: function (res) {
    this.setData({
      msg: res.detail.value
    })
  },
  onFocus() {
    this.setData({
      scrollTop: 9999999
    });
    this.delayPageScroll();
  },
  // 发送消息
  send() {
    const socketOpen = this.data.socketOpen;
    let messages = this.data.messages;
    let msg = this.data.msg;
    let that = this;
    if (msg === '') {
      return false;
    }

    const data = {
      fromUserId: this.data.userId,
      toUserId: this.data.toUser.userId,
      content: msg,
      date: new Date()
    };

    
    wx.request({
      url: app.globalData.httpHost +'/message/saveMessage',//保存消息,并对方发过来的消息设置为已读
      method: 'POST',
      data: {
        msgs: JSON.stringify(data),
        userId: that.data.userId,
        toUserId: that.data.toUser.userId
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log("操作成功")
        }
        else {
          console.log("保存消息失败")
        }
      }
    })
    this.setData({
      msg: ''
    });

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      })
    }
  }
})