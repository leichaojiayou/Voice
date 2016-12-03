//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // var _this = this

    // wx.getStorage({
    //   key: 'token',
    //   success: function(res) {
    //     console.log('already has token')
    //   },
    //   fail: function() {
    //     console.log('generateToken token')
    //     _this.generateToken()
    //   }
    // })
  },
  
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  getToken: function(callback) {
    var _this = this
    wx.getStorage({
      key: 'token',
      success: function(res) {
        typeof callback == "function" && callback(res.data)
      },
      fail: function() {
        _this.generateToken(callback)
      }
    })
  },

  generateToken: function(callback) {
    var code;
    wx.login({
      success: function(res){
        code = res.code
        wx.getUserInfo({
          success: function (res) {
            wx.request({
              url: 'https://tinyapp.sparklog.com/session?',
              data: {
                code: code,
                newteo: '3a15f915b70de44dddf1819dc5ce311e10d68569',                  
                iv: res.iv,
                encryptedData: res.encryptedData
              },
              method: 'GET', 
              success: function(res){
                typeof callback == "function" && callback(res.data.token)
                wx.setStorageSync('token', res.data.token)
                console.log('token: ', res.data.token)
              }
            })
          }
        })  
      }
    })
  },
  

  globalData:{
    userInfo:null,
    tempfillPath: null,
    stringTime: null
  }
})