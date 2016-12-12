'use strict';

//主机域名
var host = 'https://tinyapp.sparklog.com';

//获取 imaginations
var imaginations = host + '/imaginations';

//获取 用户自己的的 imaginations
var mine = host + '/imaginations/mine';

var fetchGet = function(url, callback) {
    wx.request({
      url: url,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: function(res){
        callback(null, res.data)
      },
      fail: function() {
        console.error(e)
        callback(e)
      }
    })
}

var fetchPost = function(url, data, header, callback) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: header,
      success: function(res){
        callback(null, res.data)
      },
      fail: function() {
        console.error(e)
        callback(e)
      }
    })
}


module.exports = {
    imaginations: imaginations,
    mine: mine,

    fetchGet: fetchGet,
    fetchPost: fetchPost
}