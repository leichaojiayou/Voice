var util = require('../../utils/util.js')
var startTime , endTime;



Page({
    data: {
        Recording: false,
        stopRecord: false,
        fillPath: '',
        bottomInfo: '开始录音',
        time: 0,
        percent: 0,
        play: false
    },
    bindTapRecord: function() {
        var _this = this
        
        
        if(this.data.Recording === false) {
            startTime = util.getCurrentTime()
            this.setData({
                Recording: true,
                stopRecord: false,
                bottomInfo: '完成录音',
                percent: 0
            })
            wx.startRecord({
                success: function(res){
                    
                    console.log('startRecord is success, the Path is: ', res.tempFilePath)
                    
                    _this.setData({fillPath: res.tempFilePath})
                    
                },
                fail: function(res) {
                    console.log('something wrong in startRecord: ', res)
                }
            })
        }
        else {
            wx.stopRecord()
            endTime = util.getCurrentTime()

            this.setData({
                Recording: false,
                stopRecord: true,
                bottomInfo: '开始录音',
                time: endTime - startTime
            })

            
        }
        
    },
    palyRecord: function() {
        var _this = this
        _this.setData({
            play: true,
            percent:0
        })
        wx.playVoice({
            filePath: _this.data.fillPath,
            complete: function(e) {
                console.log('complete~')
                _this.setData({
                    percent: 100,
                    play: false
                })
                console.log(e)
            },
            success: function(e) {
                console.log('success')
                console.log(e)
            }
       })
       if(_this.data.play){
            _this.showPercent()
       }
       
       

    },
    showPercent: function() {
        var _this = this
        if(_this.data.percent == 100) return
            
        _this.setData({percent: _this.data.percent + 100/(_this.data.time/500)})
        setTimeout(function(){
           _this.showPercent()
       },500)
    }
 
})