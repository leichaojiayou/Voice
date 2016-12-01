var app = getApp();
Page({
  data: {
    durationTime: '',
    stringTime: '00:00',
    playing: false,
    title: '',
    description: '',
    percent: 0
  },

  onLoad: function() {
    console.log(app.globalData)
    this.setData({stringTime: app.globalData.stringTime})
    this.setData({durationTime: app.globalData.durationTime})
  },

  playCatchTap: function(){
    var _this = this
    if(this.data.playing) {
      this.setData({
        playing: false,
      })
      wx.stopVoice({
        success: function(res){
          console.log('stop play success ...')
        }
      })
    }
    else {
      this.setData({
        playing: true,
        percent: 0
      })
      _this.showPercent()
      
      wx.playVoice({
        filePath: app.globalData.tempfillPath,
        complete: function(res){
          console.log('123')
          _this.setData({
            playing: false
          })
        }
      })
    }
  },

  titleBindblur: function(e) {
    if(e.detail.value == '') {
      console.log('标题不能为空')
    }
    this.setData({title: e.detail.value})
    
  },

  descriptionBindblur: function(e) {
    if(e.detail.value == '') {
      console.log('描述不能为空')
    }
    this.setData({description: e.detail.value})
  },

  uploadCatchTap: function() {
    var _this = this
    var token = wx.getStorageSync('token')
    wx.uploadFile({
      url: 'https://tinyApp.sparklog.com/upload?token=' + token,
      filePath: app.globalData.tempfillPath,
      name:'imagination',
      success: function(res){
        console.log('upload success', res)
        _this.uploadAgain(res.data)
      },
      fail: function(res) {
        console.log('upload fail', res)
      }
    })
  },

  uploadAgain: function(dataJson) {
    var _this = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://tinyApp.sparklog.com/imagination?token=' + token,
      data: {
        title: _this.data.title,
        description: _this.data.description,
        src: dataJson,
        duration: app.globalData.durationTime
      },
      method: 'POST', 
      success: function(res){
        console.log('upload again sucess', res)
        //上传成功后跳转到首页！
        wx.navigateBack({
          delta: 2,
        })
      },
      fail: function() {
       console.log('upload again fail', res)
      }
    })
  },

  showPercent: function() {
    var _this = this
    if(_this.data.percent == 100) return
            
    _this.setData({percent: _this.data.percent + 100/(_this.data.durationTime/500)})
    setTimeout(function(){
        _this.showPercent()
    }, 500)
  }

    
})


