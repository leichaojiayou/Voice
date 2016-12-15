//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  },
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear', 
    })
    animation.scale(.5).rotate(10).step()
    this.setData({
      animationData: animation.export()
    })
    
  }
})
