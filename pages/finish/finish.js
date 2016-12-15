var app = getApp();
var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')
Page({
  data: {
    token: '',
    stringTime: '00:00',
    durationTime: '',    
    numberTime: 0,
    playing: false,
    title: '',
    description: '',
    percent: 0,
    btnText: '分享',
    error: false,
    errorInfo: '',
    titleFocus: false,
    descriptionFocus: false,
  },

  onLoad: function() {
    var info = wx.getStorageSync('info');
    typeof info === 'object' ? '' : info = JSON.parse(info)
    this.setData({
      token: info.token,
      stringTime: app.globalData.stringTime,
      durationTime: app.globalData.durationTime
    })
  },

  titleBindInput: function(e) {
    this.setData({title: e.detail.value})
  },

  //textarea只能在失去焦点的时候监听其数据,这是一个微信的bug,后期会修复！
  descriptionBindBlur: function(e) {
    this.setData({description: e.detail.value})
  },

  uploadCatchTap: function() {
    this.setData({descriptionFocus: false})
    this.inputCheck({
      title: this.data.title,
      description: this.data.description,
      success: () => {
        this.setData({error: false})
        this.uploadInit()
      },
      fail: (res) => {
        this.setData({error: true, errorInfo: res})
      }
    })
  },

  inputCheck: function(obj) {
    if(obj.title === '')
      obj.fail('标题不能为空')
    else if(obj.description === '')
      obj.fail('描述不能为空')
    else
      obj.success()
  },

  uploadInit: function() {
    var _this = this
    var apiUrl = Api.upload + '?token=' + this.data.token 
    wx.uploadFile({
      url: apiUrl,
      filePath: app.globalData.tempfillPath,
      name:'imagination',
      success: function(res){
        _this.uploadAgain(res.data)
      },
      fail: function(res) {
        console.error('upload fail', res)
      }
    })
  },

  uploadAgain: function(dataJson) {
    var _this = this
    wx.request({
      url: 'https://tinyApp.sparklog.com/imagination?token=' + _this.data.token,
      data: {
        title: _this.data.title,
        description: _this.data.description,
        src: dataJson,
        duration: app.globalData.durationTime
      },
      method: 'POST', 
      success: function(res){
        console.log('upload again sucess', res)
        _this.setData({btnText: '上传成功', loading: false})
        //提示框
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function(){
          wx.navigateBack({delta: 2})
        },1000)
      },
      fail: function() {
       console.error('upload again fail', res)
      }
    })
  },

  showPercent: function() {
    var _this = this
    if(this.data.percent > 100) return
    _this.setData({percent: _this.data.percent + 100/(_this.data.durationTime/500)})
    if(_this.data.playing) {
      setTimeout(function(){
        _this.showPercent()  
      }, 500)
    }
  },

  showTime: function() {
    var _this = this
    if(this.data.numberTime * 1000 > this.data.durationTime) return
    _this.setData({numberTime: _this.data.numberTime + 1})
    _this.setData({stringTime: util.NumberToTime(this.data.numberTime)})
    if(_this.data.playing) {
      setTimeout(function(){
        _this.showTime()
      }, 1000)
    }
  },

  playVoiceCatchTap: function(){
    var _this = this
    if(this.data.playing) {
      this.setData({
        playing: false,
      })
      wx.stopVoice()
    }
    else {
      this.setData({
        playing: true,
        percent: 0,
        numberTime: 0
      })

      _this.showPercent()
      _this.showTime()

      wx.playVoice({
        filePath: app.globalData.tempfillPath,
        complete: function(res){
          _this.setData({
            playing: false,
            percent: 100
          })
        }
      })
    }
  }


    
})

//因为textarea只能在失去焦点的时候监听其数据，所以 。。。。