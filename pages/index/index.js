var util = require('../../utils/util.js')
var token = wx.getStorageSync('token')

Page({
  data: {
    list: [],
    page: 1,
    per: 6,
  },

  onLoad: function() {
    this.fetchList(token)
  },

  onPullDownRefresh: function() {
    console.log('下拉刷新')
    this.fetchList(token)
  },

  onReachBottom: function() {
    console.log('上拉刷新')
    this.lower()
  },

  fetchList: function(token) {

    var _this = this
    var per = _this.data.per
    var page = _this.data.page

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })

    if(page === 1) {
      _this.setData({ list: [] });
    }

    wx.request({
      url: `https://tinyapp.sparklog.com/imaginations?per=${per}&page=${page}&token=${token}`,
      method: 'GET',
      success: function(res){
        console.log(res.data)
        _this.setData({list: _this.data.list.concat(res.data.map(function(item){
            item.duration = util.NumberToTime(Math.floor(item.duration/1000))
            return item
          }))
        })
      }
    })

  },

  lower: function() {
    this.setData({page: this.data.page + 1})
    this.fetchList(token)
  },

  test: function() {
    wx.showModal({
      title: '上传成功',
      showCancel: false,
      confirmColor: '#50e3c2',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          console.log('回到首页')
        }
      }
    })
  }

     
})


// https://tinyApp.sparklog.com/static/uploads/dsafasdf
//static/uploads/da39a3ee5e6b4b0d3255bfef95601890afd80709wx-file.silk