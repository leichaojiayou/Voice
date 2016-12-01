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

var getCurrentTime =  function() {
  var d = new Date();
  return d.getTime()
}

//接受一个单位是秒的数字，返回字符串

var NumberToTime = function(num) {
  if(typeof num !== 'number') return 'NaN'
  
  if(num < 10) {
    return '00:0' + num
  }
  else if(num < 60) {
    return '00:' + num
  }
  else {
    var n = num%60
    if(n < 10)
      return '0' + Math.floor(num/60) + ':' + '0' + n;
    else
      return '0' + Math.floor(num/60) + ':' + n
  }
}

module.exports = {
  formatTime: formatTime,
  getCurrentTime: getCurrentTime,
  NumberToTime: NumberToTime
}
