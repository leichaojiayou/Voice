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
    addButtonisShow: true,
    itemId: 100000
  },

  onShareAppMessage: function () {
    return {
      title: '鸣响',
      desc: '说出你的想法法，找到志同道合的人',
      path: '/pages/index/index'
    }
  },

  onLoad: function () {
    wx.clearStorage({
      key: 'info',
      success: (res) => {
        // success
        util.getInfo((info) => {
          typeof info === 'object' ? '' : info = JSON.parse(info)      
          this.setData({ token: info.token });
          this.getData();
        })
      }
    })
    

    wx.getSystemInfo({
      success: (res) => {
        this.setData({ windowHeight: res.windowHeight })
      }
    })
  },

  justfiyToken: function(obj) {
    wx.request({
      url: Api.imaginations + '?per=10&page=1&token=' + obj.token,
      method: 'GET',
      success: function(res){
        console.log('验证：',res)
        if(res.data.name == "JsonWebTokenError") {
          console.log('验证失败')
          typeof obj.fail === 'function' && obj.fail()
        }
        else {
          console.log('验证成功')
          typeof obj.success === 'function' && obj.success()
        }
      }
    })
  },

  //将getData放在onShow中是为了，用户在上传后回到首页时会自动刷新
  //但目前通过switchtarbar跳转回来，还不会触发onShow，因此注视
  onShow: function () {
    // if(this.data.token) {
    //   this.getData();
    // }
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1 })
    this.getData()
  },

  // onReachBottom: function () {
  //   if (this.data.token) {
  //     if (!this.data.done) this.lower()
  //     else {
  //       wx.showToast({
  //         title: '没有更多内容',
  //         icon: 'success',
  //         duration: 600
  //       })
  //     }
  //   }
  // },

  bindscroll: function (e) {
    if (e.detail.scrollTop < 60) {
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

    if(!this.data.done) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 500
      })
    }
    else {
      wx.showToast({
        title: '没有更多内容',
        icon: 'success',
        duration: 600
      })
    }
    

    if (page === 1) {
      this.setData({ list: [] });
    }

    wx.request({
      url: apiUrl,
      method: 'GET',
      success: function (res) {
        if(res.statusCode != 200) {
          wx.clearStorage({
            key: 'info',
            success: function(res){
              console.log('clear success')
            }
          })
        }
        // success
        if (res.data.length == 0) _this.setData({ done: true })
        else _this.setData({ done: false })
        wx.stopPullDownRefresh()
        _this.setData({
          list: _this.data.list.concat(res.data.result.map(function (item) {
            item.duration = util.NumberToTime(Math.floor(item.duration / 1000))
            item.path = Api.host + '/static/uploads/'  + JSON.parse(item.src).filename
            return item
          }))
        })
        console.log('list:', _this.data.list)
      }
    })

  },

  lower: function () {
    this.setData({ page: this.data.page + 1 })
    this.getData()
  },

  palyVoice: function (event) {

    const path = event.currentTarget.dataset.path
  

    this.setData({
      playing: true,
      itemId: event.currentTarget.dataset.index
    })

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


