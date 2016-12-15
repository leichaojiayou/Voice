# 零基础小程序开发

## 前言

本教程旨在为想学习小程序的同学提供一个快速上手的教程，如果你之前接触过`react.js`或者`vue.js`之类的前端框架，相信你很快就能学会小程序的开发。如果没有接触过，也不要有畏难心理，本教程主要面向的就是初学者，所以会尽量写的详细一点。相信跟我一起走完本教程，一定可以快速学会小程序的开发。

ok，闲话少叙。

本教程分为三个部分：

<b>第一部分：理论篇</b>

这部分介绍微信小程序开发所涉及到的基础知识，让你对小程序的开发有一个整体的概念。

<b>第二部分：实战篇</b>

将带领读者朋友们和我一起开发一个真正的小程序，和我一起享受编程的乐趣。

<b>第三部分：附录</b>

一些额外的内容将在附录中说明。

在学习过程中，如果你有任何疑惑，请直接在公众号回复即可。

## 目录

- [第一部分](#第一部分)
    - [搭建开发环境](#搭建开发环境)
    - [配置小程序](#配置小程序)
    - [项目结构](#项目结构)
    - [页面生命周期](#生命周期)
- [第二部分](#第二部分)
    - token
    - 首页
    - 个人
    - 录音
    - 发布
- [第三部分](#第三部分)
    - AppID


搭建开发环境
-----------------
1. 下载最新版微信小程序开发工具: [下载页面](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html?t=20161122)

2. 选择适合你系统的版本进行安装，目前支持`windows32`,`windows64`以及`mac`系统

3. 安装完成之后，打开`微信web开发者工具`，然后用手机微信扫码登陆。

4. 选择添加项目，可以看到，要添加一个新的小程序项目需要填写三部分内容：`AppID`，项目名称，项目目录。

在这里，为了能快速开发，我们先选择 无AppID 这个选项，更多有关`AppID`的内容，可以到<b>附录</b>中查看。这里不再赘述。

项目名称，就是你给你的项目取一个名字。

项目目录，是指你的小程序的代码将放在哪个目录下，你可以自己在本地创建一个文件夹，也可以在github创建一个新项目，都可以。在这里为了简单，我直接在桌面新建了一个文件夹。

![00](https://cloud.githubusercontent.com/assets/20606749/21132399/bd5c93a0-c14e-11e6-9079-17d07c74a214.png)

> 注意，填好信息之后，工具会默认勾选 在当前目录中创建quick start项目 这个选项，我们使用默认的就好，不需改动。

如果一切顺利，单击添加项目后，你应该能看到下面这张图所示的内容。

![01](https://cloud.githubusercontent.com/assets/20606749/21132497/50d96bc6-c14f-11e6-82ee-844d3a05fbcf.png)

至此，开发小程序的环境已经搭建完成，本节内容也到此结束，下节我们将介绍如何配置小程序！



配置小程序
-------------------------

这一节，我们将介绍小程序的配置。说到小程序的配置，其实就是各种折腾app.json这个文件中的配置选项。首先，让我们来看看项目自动生成的app.json文件长什么样子。

```json
{
  "pages":[
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle":"black"
  }
}
```

可以看到的是，这是一个josn格式的文件，然后呢，有两个部分的内容: `pages`和`window`

其实这里，这里共有五个部分可以配置，分别是`pages`, `window`, `tarBar`, `networkTimeout`和`debug`，下面一一对其进行说明。

#### pages：定义的是这个小程序由哪些页面组成。

在以后需要新增或者减少页面时，都需要在这里进行设置，你的小程序需要有几个页面组成，那么pages数组就必须包含几项内容。

可以看到pages是一个数组，而数组的第一项就是小程序的初始页面，你可以向下面这样试着把 `logs` 页面移动到最前面看看效果，这在开发的时候是一个不错的小技巧。

```json
{
  "pages":[
    "pages/logs/logs",
    "pages/index/index"
  ],
  ...
}
```

还有一个技巧要分享给你的是，在我们需要添加一个新页面的时候，没必要傻傻的手动去创建文件夹，然后新建xxx.josn, xxx.js, xxx.wxml, xxx.wxss这四个文件。我们只要在 pages数组中 添加一个你想创建的页面，然后 Ctrl + s 保存即可！是不是很酷？


#### window: 定义的是窗口的配置信息。

下面表格列出了官方提供的一些配置项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|------|------|
| navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色，如"#000000" |
| navigationBarTextStyle | String | white | 导航栏标题颜色，仅支持 black/white |
| navigationBarTitleText | String | a | 导航栏标题文字内容 |
| backgroundColor | HexColor | #ffffff | 窗口的背景色 |
| backgroundTextStyle | String | dark | 下拉背景字体、loading 图的样式，仅支持 dark/light |
| enablePullDownRefresh | Boolean | false | 是否开启下拉刷新 |

#### tarBar: 用来定义 tabBar 的表现

tarBar就是我们经常在app中看到底部的那种导航，如果还不知道是什么，试着把下面这个代码加进你的app.json文件中。

因为tarBar是需要图片的，所以你必须有自己的图片，也就是代码中iconPath那部分，如果你懒得弄自己的图片，那么也可以在我们的公众号回复‘小程序图片’来获取。后期我们会将源代码开放出来，请直接去源代码中查看所需的资源。

```json
{
  "tabBar": {
    "backgroundColor": "#fbfbfb",
    "borderStyle": "white",
    "selectedColor":"#50e3c2",
    "color": "#aaa",
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/home.png",
      "selectedIconPath": "images/homeHL.png"
    },{
      "pagePath": "pages/me/me",
      "text": "我",
      "iconPath": "images/me.png",
      "selectedIconPath": "images/meHL.png"
    }]
  }
}

```

tabBar 是一个数组，只能配置最少2个、最多5个 tab。

tab 按数组的顺序排序，这句话意思你也可以尝试，把 `list` 中的部分调换顺序看看。

我们可以在项目目录下添加一个images文件，用来存放我们的图片资源。

> 注意：目前小程序只支持网络图片或者base64图片，使用本地图片需要将图片转为base64代码



#### networkTimeout: 用来设置各种网络请求的超时时间。

如果你不是很清楚这个`networkTimeout`配置有什么作用，那么忽略就好。这对实际开发并没有什么影响。

| 属性 | 类型 | 必填 | 说明 |
| - | - | - | - |
| request | Number | 否 | wx.request的超时时间，单位毫秒 |
| connectSocket | Number | 否 | 	wx.connectSocket的超时时间，单位毫秒 |
| uploadFile | Number | 否 | wx.uploadFile的超时时间，单位毫秒 |
| downloadFile | Number | 否 | 	wx.downloadFile的超时时间，单位毫秒 |

以下代码仅为示例

```json
{
  "networkTimeout": {
    "request": 5000,
    "connectSocket": 5000,
    "uploadFile": 5000,
    "downloadFile": 5000
  },
  "debug": true
}
```



#### debug

可以在开发者工具中开启 `debug` 模式，在开发者工具的控制台面板，调试信息以 `info`的形式给出，其信息有 `Page` 的注册，页面路由，数据更新，事件触发 。 可以帮助开发者快速定位一些常见的问题。

如果开启 `debug` 模式见上面代码

好了，五个部分介绍完了，希望各位在学习完这一节后一定要尽情探索，修改各种配置看看效果，毕竟这样印象会更加深刻。

下一节我们将讲到小程序的项目结构。

## 项目结构

这一节我们来讲小程序的项目结构，学习完本节，你将知道小程序开发的整个程序结构是怎样的，各个文件的有何作用。请先看下图！

![02](https://cloud.githubusercontent.com/assets/20606749/21132460/1a1afe10-c14f-11e6-843a-ef922d727141.png)

整个程序结构有pages文件夹，utils文件夹，app.js，app.json，app.wxss。

app.josn上一节已经讲过了，是小程序的配置文件。下面我们一一讲解其他部分。

#### pages

这个文件夹用来存放小程序的页面，你的小程序需要哪几个页面，那么这个pages中就有几个文件夹。

也就是说，其中的每个文件夹就代表了一个页面。

可以看到一个页面由四个文件组成，分别是 `xxx.js`, `xxx.json`, `xxx.wxml`, `xxx.wxss`

- xxx.js 将在下小节的生命周期来讲，因为这里涉及到的内容比较多，单独列出一节来讲。

- xxx.json 就是这个页面的配置文件。

是不是让你想起了之前讲过的 `app.json`，如果你要问有什么区别，那就是xxx.json是某个页面的配置文件，而app.json是整个小程序的配置文件。

看看这个实例，logs.json 文件就配置了logs这个页面的 导航栏的标题～

```
{
    "navigationBarTitleText": "查看启动日志"
}
```

对了，如果你想让某个页面支持下拉刷新，记得在其json文件中配置 enablePullDownRefresh 为 true

> 注意：json 文件中不能有任何注释，不然会报错。

- xxx.wxml 可以把它看作是 `html` ，不过稍微有些不同。

- xxx.wxss 则可以看成是 `css` 。

毕竟，我们可是在用开发网页的技术来写小程序。怎么可能少得了html，css。

#### utils

这个文件夹中的utils.js主要用来定义一些公用的函数。

我们也可以在里面新建一个 `api.js` 文件来抽象我们服务器的地址。

#### app.js

这部分内容同样放在下一节一起讲！


#### app.wxss

这里定义的是整个小程序的 样式表，css。

> 这里有必要说明一下，小程序是支持css3的`flexbox`布局的，所以你是不是要去学习一下呢？

## 生命周期

终于到了小程序最核心，最关键的部分了，也是我个人认为最难讲的一部分内容。这里我说难讲倒并不是它有多难，各位不要慌。

既然本章的题目叫做生命周期，那么就先讲一讲生命周期的概念吧。

#### app.js

将你原来的app.js替换成以下代码，然后 点击 `微信web开发者工具`左侧的 `调试` 按钮，console的选项。
最后点编译。观察console的输出效果，再点击 `微信web开发者工具`的 `后台`按钮，观察console的输出。

onLaunch，onShow，onHide，这些函数叫做生命周期钩子函数，通过这些函数，你可以让程序在特定的时候（程序生命周期的某个阶段）执行你的代码。

```js
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function() {
    console.log('App onShow')
  },
  onHide: function() {
    console.log('App onHide')
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
```


#### xxx.js

Page() 函数用来注册一个页面。接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。



```js
Page({
  data: {
    text: "This is page data."
  },
  onLoad: function(options) {
    // Do some initialize when page load.
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    })
  },
  customData: {
    hi: 'MINA'
  }
})
```

data 中的 text 默认内容是 "This is page data."，通过viewTap这个函数中的setData会让text的内容变成'Set some data for updating view.'那么这有什么作用呢，试想一下，如果这个text是某个 class的名字？是某个状态？

到这里，我们的理论部分就到这里结束了。相信你对小程序的理论知识已经有了一个初步的了解，但还是有一点模糊，那么第二部分的实战篇就是为了让我们能够结合理论来进行实践，敬请期待！


#### 第二部分：实战篇



