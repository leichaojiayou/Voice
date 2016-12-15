var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')


Page({
  data: {
    token : '',
    list: [],
    page: 1,
    per: 10,
    done: false
  },

  onLoad: function() {
    var _this = this
    util.getInfo(function(info) {
      typeof info === 'object' ? '' : info = JSON.parse(info)
      _this.setData({token: info.token});  
      _this.getData();
    })
  },

  onPullDownRefresh: function() {
    this.setData({page: 1})
    this.getData()
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

  getData: function() {
    var _this = this
    var token = _this.data.token
    var per = _this.data.per
    var page = _this.data.page
    var apiUrl = Api.imaginations + '?per=' + per + '&page=' + page + '&token=' + token

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })

    if(page === 1) {
      _this.setData({ list: [] });
    }

    wx.request({
      url: apiUrl,
      method: 'GET',
      success: function(res){
        // success
        console.log('获取imaginations成功：', res)
        if(res.data.length === 0) _this.setData({done: true})
        else _this.setData({done: false})
        wx.stopPullDownRefresh()
        _this.setData({list: _this.data.list.concat(res.data.map(function(item){
          item.duration = util.NumberToTime(Math.floor(item.duration/1000))
          item.path = 'https://tinyapp.sparklog.com/static/uploads/' + JSON.parse(item.src).filename
          return item
        }))})
        console.log('list:', _this.data.list)
      },
      fail: function() {
        console.error('获取imaginations失败')
      }
    })

  },

  lower: function() {
    this.setData({page: this.data.page + 1})
    this.getData()
  },

  palyVoice: function(event){
    console.log(event.target.dataset)
    var path = event.target.dataset.path
    console.log('clicked the voice')
    console.log('the path is :', path)

    wx.downloadFile({
      url: path,
      success: function(res){
        // success
        console.log('downloadFile success')
        console.log(res.tempFilePath)
        wx.playVoice({
          filePath: res.tempFilePath,
          success: function(res){
            console.log('paly voice success')
          },
          fail: function() {
            console.log('paly voice fail')
          },
          complete: function() {
            console.log('paly voice complete')
          }
        })
      },
      fail: function() {
        console.log('downloadFile fail')
      }
    })
    
  }   
})
