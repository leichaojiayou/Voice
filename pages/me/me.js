//index.js
//获取应用实例


var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')



Page({
  data: {
    token: '',
    motto: 'Hello World',
    userInfo: '',
    list: [],
    page: 1,
    per: 5,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var _this = this
    wx.getStorage({
      key: 'info',
      success: function(res){
        _this.setData({userInfo: JSON.parse(res.data).wxInfo})
        _this.setData({token: JSON.parse(res.data).token})
        _this.fetchList()
      }
    })
  },

  fetchList: function() {
    var _this = this
    var token = _this.data.token
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
      url: `https://tinyapp.sparklog.com/imaginations/mine?per=${per}&page=${page}&token=${token}`,
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
  
  deleteHandle: function(event) {
    console.log(event.currentTarget.dataset.id)
    console.log('delete')
    wx.showModal({
      title: '删除',
      content: '确定删除这个资源？',
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://tinyapp.sparklog.com/imagination/'+ event.currentTarget.dataset.id+'?token='+token,
            method: 'DELETE',
            success: function(res){
              console.log('删除成功')
            },
            fail: function() {              
              console.log('删除失败')
            },
            complete: function() {              
              console.log('删除完成')
            }
          })
        }
      }
    })
  }

})
