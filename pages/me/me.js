var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')

Page({
  data: {
    token: '',
    userInfo: '',
    list: [],
    page: 1,
    per: 5,
  },

  onLoad: function () {
    wx.getStorage({
      key: 'info',
      success: (res) => {
        this.setData({userInfo: JSON.parse(res.data).wxInfo})
        this.setData({token: JSON.parse(res.data).token})
        this.fetchList()
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
    var _this = this
    wx.showModal({
      title: '删除',
      content: '确定删除这个资源？',
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://tinyapp.sparklog.com/imagination/'+ event.currentTarget.dataset.id+'?token='+_this.data.token,
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
