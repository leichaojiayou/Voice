var token = wx.getStorageSync('token')

Page({
  data: {
    list: [],
    page: 1,
    per: 6,
    haha: ''
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
      url: `https://tinyApp.sparklog.com/imaginations?per=${per}&page=${page}&token=${token}`,
      method: 'GET',
      success: function(res){
        console.log(res.data)
        _this.setData({list: _this.data.list.concat(res.data)})
      }
    })

  },

  lower: function() {
    this.setData({page: this.data.page + 1})
    this.fetchList(token)
  },

     
})


// https://tinyApp.sparklog.com/static/uploads/dsafasdf