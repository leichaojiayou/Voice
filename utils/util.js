function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//接受一个单位是秒的数字，返回字符串

var NumberToTime = function(num) {

  if(typeof num !== 'number') return 'NaN'
  var n = num%60;

  if(num < 10) {
    return '00:0' + num
  }
  else if(num < 60) {
    return '00:' + num
  }
  else if(num < 600){
    
    if(n < 10)
      return '0' + Math.floor(num/60) + ':' + '0' + n;
    else
      return '0' + Math.floor(num/60) + ':' + n
  }
  else {
    if(n < 10)
      return Math.floor(num/60) + ':' + '0' + n;
    else
      return Math.floor(num/60) + ':' + n
  }
}

//获取 code
var fetchCode = function(callback) {
  console.log('fetchCode')
  wx.login({
    success: function(res){
      console.log('login success')
      typeof callback === "function" && callback(res.code)
    },
    fail: function() {
      console.log('login fail')
      wx.showModal({
        title: '错误',
        content: '服务器获取code时发生错误',
      })
    }
  }) 
}

// 获取token和userInfo
var fetchInfo = function(callback) {
  
  fetchCode(function(code) {

    wx.getUserInfo({
      success: function(res){
        wx.request({
          url: 'https://tinyapp.sparklog.com/session',
          data: {
            code: code,
            newteo: '3a15f915b70de44dddf1819dc5ce311e10d68569',                  
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          method: 'GET',
          success: function(res){
            typeof callback == "function" && callback(res.data)
            wx.setStorageSync('info', JSON.stringify(res.data))
          },
          fail: function() {
            console.error('wx.request 在 fethchInfo 中发生错误')
          }
        })
      },
      fail: function() {
        console.error('wx.getUserInfo 在 fethchInfo 中发生错误')
      }
    })

  })
}

var getInfo = function(callback) {
  
  wx.getStorage({
    key: 'info',
    success: function(res) {
      typeof callback === "function" && callback(res.data)
    },
    fail: function() {
      console.log(fetchInfo)
      fetchInfo(callback)
    }
  })
}



module.exports = {
  formatTime: formatTime,
  NumberToTime: NumberToTime,
  getInfo: getInfo
}
