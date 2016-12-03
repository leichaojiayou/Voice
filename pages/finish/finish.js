var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    durationTime: '',
    stringTime: '00:00',
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
        percent: 0,
        numberTime: 0
      })

      _this.showPercent()
      _this.showTime()

      wx.playVoice({
        filePath: app.globalData.tempfillPath,
        complete: function(res){
          console.log('123')
          _this.setData({
            playing: false,
            percent: 100
          })
        }
      })


    }
  },

  titleBindBlurt: function(e) {
    this.setData({title: e.detail.value})
  },

  descriptionBindBlur: function(e) {
    this.setData({description: e.detail.value})
  },

  uploadCatchTap: function() {

    
    this.inputCheck(this.uploadInit)

  },

  uploadInit: function() {
    var _this = this
    console.log('start upload')
    var token = wx.getStorageSync('token')
    console.log('tempfillpath: ',app.globalData.tempfillPath)

    wx.uploadFile({
      url: 'https://tinyapp.sparklog.com/upload?token=' + token,
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
        _this.setData({btnText: '上传成功', loading: false})
        //提示框
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1200
        })
        setTimeout(function(){
          wx.navigateBack({delta: 2})
        },1200)
        
      },
      fail: function() {
       console.log('upload again fail', res)
      }
    })
  },

  showPercent: function() {
    console.log('show percent')
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
    console.log('showTime')
    if(this.data.numberTime * 1000 > this.data.durationTime) return
    _this.setData({numberTime: _this.data.numberTime + 1})
    _this.setData({stringTime: util.NumberToTime(this.data.numberTime)})

    if(_this.data.playing) {
      setTimeout(function(){
        _this.showTime()
      }, 1000)
    }
  },

  inputCheck: function(func) {
    var _this = this
    var checkSuccess = false
    setTimeout(function(){
      if(_this.data.title == ''){
        _this.setData({
          error: true,
          errorInfo: '标题不能为空',
          titleFocus: true
        })
        return
         
      }
      if(_this.data.description == '') {
          _this.setData({
            error: true,
            errorInfo: '描述信息不能为空',
            descriptionFocus: true
          })
        return     
      }

      _this.setData({error: false, btnText: '上传中', loading: true})
      func()
      
       
      }, 100)

  }

    
})


// TextArea 失去焦点
//  
//

// 