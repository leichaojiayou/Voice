var util = require('../../utils/util.js')
var startTime , endTime;
var app = getApp();

Page({
  data: {
    Recording: false,
    numberTime: 0,
    stringTime: '00:00',
    windowWidth: '',
    windowHeight: '',
    paused: true,
  },

  onLoad:function(){
    //获取设备的宽度和高度信息
    
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
  },

  onReady:function(){
    
    //设置波纹滚动的动画
    // const context = wx.createCanvasContext('myCanvas')
    // const windowWidth = this.data.windowWidth;
    // const SKY_VELOCITY = 30;
    // var skyOffset = 0;
    // var lastTime = 0;
    // var fps = 0;

    // var draw = () => {
    //   context.save();
    //   skyOffset = skyOffset < windowWidth ?
    //               skyOffset + SKY_VELOCITY/fps : 0;
    //   context.save();
    //   context.translate(-skyOffset, 0);
    //   context.drawImage('/images/graphics.png', 0, 0, windowWidth, 300)
    //   context.drawImage('/images/graphics.png', windowWidth, 0, windowWidth,300)
    //   context.restore()
    //   context.draw()
    // }

    // var erase = function() {
    //   context.clearRect(0, 0, windowWidth, 300)
    // }

    // var calculateFps = function(now) {
    //   var fps = 1000 / (now - lastTime);
    //   lastTime = now;
    //   return fps; 
    // }

    // var animate = (now) => {
    //   if (now === undefined) {
    //       now = +new Date;
    //   }

    //   fps = calculateFps(now);
    //   console.log(fps)

    //   if (!this.data.paused) {
    //     erase();
    //     draw();
    //   }

    //   requestAnimationFrame(animate)
    // }
    // requestAnimationFrame(animate)
    // draw()
  },

  onShow: function() {
    
    this.setData({
      stringTime: '00:00',
      numberTime: 0,
      hintText: '轻按一下录音'
    })
  },

  bindTapRecord: function() {
    // this.setData({paused: !this.data.paused})

    var _this = this    
    
    if(this.data.Recording === false) {
      
      //如果自动弹出 权限窗口窗口 该怎么办？
      this.setData({Recording: true})      
      startTime = new Date().getTime()
      this.showTime()
      wx.startRecord({
        success: (res) => {
          //已经录制成功完成才调用
          app.globalData.tempfillPath = res.tempFilePath
        },
        fail: function(res) {
          console.log('失败', res)          
          wx.switchTab({url: '/pages/index/index'})
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