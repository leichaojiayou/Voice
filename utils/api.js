'use strict';

//主机域名
var host = 'https://tinyapp.sparklog.com';

//获取 imaginations
var imaginations = host + '/imaginations';

//获取 用户自己的的 imaginations
var mine = host + '/imaginations/mine';

var upload = host + '/upload'
var path = host + '/static/uploads' 



module.exports = {
    imaginations: imaginations,
    mine: mine,
    upload: upload,
    host: host
}