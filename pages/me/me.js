//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
var token = wx.getStorageSync('token')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    list: [],
    page: 1,
    per: 100
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    that.fetchList(token)
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
    url: `https://tinyApp.sparklog.com/imaginations/mine?per=${per}&page=${page}&token=${token}`,
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

})
