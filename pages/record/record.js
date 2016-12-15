var util = require('../../utils/util.js')
var startTime , endTime;
var app = getApp();

Page({
  data: {
    Recording: false,
    numberTime: 0,
    stringTime: '00:00'
  },

  onShow: function() {
    this.setData({
      stringTime: '00:00',
      numberTime: 0,
    })
  },

  bindTapRecord: function() {
    var _this = this    
    if(this.data.Recording === false) {
      //记录开始录音的时间
      startTime = new Date().getTime()
      this.setData({Recording: true})
      this.showTime()
      wx.startRecord({
        success: function(res){
          app.globalData.tempfillPath = res.tempFilePath
        },
        fail: function(res) {
          console.error('something wrong in startRecord: ', res)
        }
      })
    }
    else {
      wx.stopRecord()
      // 记录停止录音的时间
      endTime = new Date().getTime()
      app.globalData.durationTime = endTime - startTime
      app.globalData.stringTime = _this.data.stringTime
      this.setData({ Recording: false})
      wx.navigateTo({
        url: '/pages/finish/finish',
      })
    }
  },

  showTime: function() {
    var _this = this
    //每隔1000毫秒，使numberTime加1，然后将其转换为字符串格式的时间格式，并赋值给stringTime
    //这个函数需要外部data：numberTime，stringTime，not good
    _this.setData({numberTime: _this.data.numberTime + 1})
    _this.setData({stringTime: util.NumberToTime(this.data.numberTime)})
    if(_this.data.Recording) {
      setTimeout(function(){
        _this.showTime()
      }, 1000)
    }
  }

})

//需要使用app.globalData来存储录音的 临时地址 和 durationTime 以及 stringTime
//tempfillPath 和 stringTime 是下个finish页面需要的，durationTime是服务器需要的。