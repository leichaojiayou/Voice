var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')


Page({
  data: {
    token: '',
    list: [],
    page: 1,
    per: 10,
    done: false,
    playing: false,
    scrollTop: 0,
    windowHeight: 0,
    addButtonisShow: true
  },

  onLoad: function () {

    util.getInfo((info) => {
      typeof info === 'object' ? '' : info = JSON.parse(info)
      this.setData({ token: info.token });
      this.getData();
    })

    wx.getSystemInfo({
      success: (res) => {
        this.setData({ windowHeight: res.windowHeight })
      }
    })
  },

  //将getData放在onShow中是为了，用户在上传后回到首页时会自动刷新
  onShow: function () {
    if(this.data.token) {
      this.getData();
    }
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1 })
    this.getData()
  },

  onReachBottom: function () {
    if (this.data.token) {
      if (!this.data.done) this.lower()
      else {
        wx.showToast({
          title: '没有更多内容',
          icon: 'success',
          duration: 600
        })
      }
    }
  },

  bindscroll: function (e) {
    if (e.detail.scrollTop < 20) {
      this.setData({ addButtonisShow: true })
    }
    else {
      this.setData({ addButtonisShow: false })
    }
  },

  getData: function () {
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

    if (page === 1) {
      _this.setData({ list: [] });
    }

    wx.request({
      url: apiUrl,
      method: 'GET',
      success: function (res) {
        if(res.data.name && res.data.name == 'TokenExpiredError') {
          wx.clearStorage({
            key: 'info',
            success: function(res){
              // success
              console.log('clear success')
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
        // success
        console.log('获取imaginations成功：', res)
        if (res.data.length === 0) _this.setData({ done: true })
        else _this.setData({ done: false })
        wx.stopPullDownRefresh()
        _this.setData({
          list: _this.data.list.concat(res.data.map(function (item) {
            item.duration = util.NumberToTime(Math.floor(item.duration / 1000))
            item.path = 'https://tinyapp.sparklog.com/static/uploads/' + JSON.parse(item.src).filename
            return item
          }))
        })
        console.log('list:', _this.data.list)
      },
      complect: function () {
        
        
      }
    })

  },

  lower: function () {
    this.setData({ page: this.data.page + 1 })
    this.getData()
  },

  palyVoice: function (event) {

    const path = event.currentTarget.dataset.path
    this.setData({ itemId: event.currentTarget.dataset.index })
    console.log(path)
    this.setData({ playing: true })
    wx.downloadFile({
      url: path,
      success: (res) => {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: (res) => {
            this.setData({ playing: false })
          }
        })
      },
      fail: (res) => {
        console.error('downloadFile fail')
        this.setData({ playing: false })
      }
    })
  }
})
