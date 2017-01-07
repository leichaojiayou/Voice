var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')

Page({
  data: {
    token: '',
    userInfo: '',
    list: [],
    count: 0,
    page: 1,
    per: 5,
    done: false,
    playing: false
  },

  onLoad: function () {
    wx.getStorage({
      key: 'info',
      success: (res) => {
        this.setData({token: JSON.parse(res.data).token})
        this.setData({userInfo: JSON.parse(res.data).wxInfo})
        
        this.fetchList()
      }
    })
  },
  //要么支持onShow，要么支持下拉刷新。
  onShow: function() {
    this.fetchList()
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
    var token = this.data.token
    var per = this.data.per
    var page = this.data.page

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })

    if(page === 1) {
      this.setData({ list: [] });
    }

    wx.request({
      url: `${Api.host}/imaginations/mine?per=${per}&page=${page}&token=${token}`,
      method: 'GET',
      success: (res) => {
        console.log(res)
        if(res.data.length === 0) this.setData({done: true})
        else this.setData({done: false})
        this.setData({ count: res.data.count })
        this.setData({list: this.data.list.concat(res.data.result.map((item) => {
            item.duration = util.NumberToTime(Math.floor(item.duration/1000))
            item.path = Api.host + '/static/uploads/' + JSON.parse(item.src).filename
            return item
          }))
        })
        console.log('MeList: ',this.data.list)
      }
    })
 },
  
  //删除语音
  deleteHandle: function(event) {
    console.log('id: ',event.currentTarget.dataset.id)
    var id = event.currentTarget.dataset.id;
    var token = this.data.token
    wx.showModal({
      title: '删除',
      content: '确定删除这个资源？',
      success: (res) => {
        if(res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: Api.host + '/imagination/' + id+'?token='+token,
            method: 'DELETE',
            success: (res) => {
              console.log('删除成功')
              this.setData({page: 1})
              this.fetchList()
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
  }

})
