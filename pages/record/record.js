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
    console.log('show')
    
  },
  bindTapRecord: function() {
    var _this = this    
    if(this.data.Recording === false) {
      startTime = util.getCurrentTime()
      this.setData({Recording: true})
      this.showTime()
      wx.startRecord({
        success: function(res){
          console.log('startRecord is success, the Path is: ', res.tempFilePath)
          app.globalData.tempfillPath = res.tempFilePath

        },
        fail: function(res) {
          console.log('something wrong in startRecord: ', res)
        }
      })
    }
    else {
      wx.stopRecord()
      endTime = util.getCurrentTime()

      app.globalData.durationTime = endTime - startTime
    
      app.globalData.stringTime = _this.data.stringTime
      
      app.setGlobalData('userInfo')  


      this.setData({ Recording: false})
      wx.navigateTo({
        url: '/pages/finish/finish',
      })
    }
  },

  showTime: function() {
    var _this = this

    _this.setData({numberTime: _this.data.numberTime + 1})
    _this.setData({stringTime: util.NumberToTime(this.data.numberTime)})

    if(_this.data.Recording) {
      setTimeout(function(){
        _this.showTime()
      }, 1000)
    }
  }
  
  
})