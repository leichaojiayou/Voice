var token = wx.getStorageSync('token')

Page({
  data: {
    list: [],
    page: 1,
  },

  onLoad: function() {
    this.fetchList(token, this.requestUserInfo)
  },

  onPullDownRefresh: function() {
    console.log('下拉刷新')
    this.fetchList(token, this.requestUserInfo)
  },

  onReachBottom: function() {
    console.log('onReachBottom')
  },

  fetchList: function(token, func) {

    var _this = this
    var page = page
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })

    
    wx.request({
      url: 'https://tinyApp.sparklog.com/imaginations?token='+token,
      method: 'GET',
      success: function(res){
        func(res.data[6].userId, token, res.data)
      }
    })
  },

  requestUserInfo: function(userId, token, data) {
    console.log('requestUserInfo start')

    var _this = this
      wx.request({
        url: `https://tinyApp.sparklog.com/user/${userId}?token=${token}`,
        method: 'GET',
        success: function(res){
          console.log(res.data)
          var list$2 = data
          list$2.map((item, index) => {
            item.avatarUrl = res.data.wxInfo.avatarUrl
            item.nickName = res.data.wxInfo.nickName
            return item
          })
          _this.setData({list: list$2})
        }
      })
  },

  lower: function() {
    this.setData({page: this.data.page + 1})
    this.fetchList()
  },

  test: function() {
    console.log('test')
    wx.playVoice({
      filePath: 'https://tinyapp.sparklog.com/static/uploads/da39a3ee5e6b4b0d3255bfef95601890afd80709silk.silk',
      success: function(res){
        console.log(res)
      },
      fail: function() {
        console.log('fail')
      },
      complete: function() {
         console.log('complete')
      }
    })
  }    
})


// https://tinyApp.sparklog.com/static/uploads/dsafasdf