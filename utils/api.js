'use strict';

var host = 'https://tinyapp.sparklog.com';
var imaginations = host + '/imaginations';
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