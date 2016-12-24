var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')

Page({
  data: {
    token: '',
    userInfo: '',
    list: [],
    page: 1,
    per: 5,
    done: false,
    playing: false
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

  onReachBottom: function() {
    if(this.data.token) {
      if(!this.data.done) this.lower()
      else {
        wx.showToast({
          title: '没有更多内容',
          icon: 'success',
          duration: 600
        })
      }
    }
  },

  lower() {
    this.setData({page: this.data.page + 1})
    this.fetchList()
  },

  //请求个人语音列表
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
        if(res.data.length === 0) _this.setData({done: true})
        else _this.setData({done: false})
        
        _this.setData({list: _this.data.list.concat(res.data.map(function(item){
            item.duration = util.NumberToTime(Math.floor(item.duration/1000))
            item.path = 'https://tinyapp.sparklog.com/static/uploads/' + JSON.parse(item.src).filename
            return item
          }))
        })
        console.log('meList:', _this.data.list)
      }
    })
 },
  
  //删除语音
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
  },

  //播放语音
    palyVoice: function(event){

    const path = event.currentTarget.dataset.path
    this.setData({itemId: event.currentTarget.dataset.index})
    this.setData({playing: true})
    wx.downloadFile({
      url: path,
      success: (res) => {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: (res) => {
            this.setData({playing: false})
          }
        })
      },
      fail: (res) => {
        console.error('downloadFile fail')
        this.setData({playing: false})
      }
    })   
  },

  bindscanCode: function() {
    wx.showNavigationBarLoading()
  }

})
