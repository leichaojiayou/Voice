var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')
var app = getApp()



Page({
  data: {
    token : '',
    list: [],
    page: 1,
    per: 10,
  },

  onLoad: function() {
    var _this = this
    app.getToken(function(token){
      _this.setData({token: token})
      _this.getData()
    })
    
  },

  onPullDownRefresh: function() {
    console.log('下拉刷新')
    this.getData()
  },

  onReachBottom: function() {
    console.log('上拉刷新')
    var _this = this

    // _this.lower()
    
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

    Api.fetchGet(apiUrl, (err, res) => { 
      console.log('获取imaginations成功: ', res)
      _this.setData({list: _this.data.list.concat(res.map(function(item){
        item.duration = util.NumberToTime(Math.floor(item.duration/1000))
        item.path = 'https://tinyapp.sparklog.com/' + JSON.parse(item.src).path
        return item
      }))})
      console.log('list:',_this.data.list) 
    })
  },

  lower: function() {
    this.setData({page: this.data.page + 1})
    this.getData()
  },

  test: function() {
    wx.showToast({
      title: '1111',
      icon: 'success',
      duration: 1000
    })
  },

  palyVoice: function(event){
    var path = event.target.dataset.path
    console.log('clicked the voice')
    console.log('the path is :', path)
  
    wx.playVoice({
      filePath: path,
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
  }

     
})
