//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    loading: true,
    // showpop:false,

  },
  // 打开手机位置权限设置
  openSetting: function (e) {
    var that = this;
    if (e.detail.authSetting['scope.userLocation'] == true) {
      wx.openLocation({
        latitude: parseFloat(e.currentTarget.dataset.map.latitude),
        longitude: parseFloat(e.currentTarget.dataset.map.longitude)
      })
    } else {

    }

  },
  // 打开地图
  map: function (e) {
    var that = this;
    wx.getLocation({
      success: function (res) {
        wx.openLocation({ //latitude、longitude只能为number，不能为string
          latitude: parseFloat(e.currentTarget.dataset.map.latitude),
          longitude: parseFloat(e.currentTarget.dataset.map.longitude)
        })
      },
    })
  },
  phoneCall: function (e) {
    app.phoneCall(e.currentTarget.dataset.phone);
  },
  nav: function (e) {
    app.nav(e.currentTarget.dataset.url);
  },
  //解析从后台传递的时间
  dateParse: function (date) {
    var datereg = /\d{4}(-|\.|\s)\d{2}(-|\.|\s)\d{2}/;
    var timereg = /\d{2}:\d{2}:\d{2}/;
    var dates = datereg.exec(date)[0];
    var times = timereg.exec(date)[0];
    var millisecond = new Date(dates + " " + times).getTime();
    return { dates, times, millisecond };
  },
  // getUserInfo:function(e){
  //   var that=this;
  //   console.log(e);
  //   if(e.detail.iv){
  //     app.request(app.host +'member/info/updateByWeiXin','POST','form',{
  //       openId:app.openid,
  //       encryptedData:e.detail.encryptedData,
  //       iv:e.detail.iv
  //     },function(res){
  //       console.log('获取用户信息成功');
  //     })
  //   }else{

  //   }
  // },
  // hidePop:function(){
  //   this.setData({
  //     showpop:false
  //   })
  // },
  onLoad: function (options) {
    //判断页面跳转
    console.log(options)
    //好友参加同行
    if (options.state == 'joinPeer'){
      wx.navigateTo({
        url: '/pages/public/myPeerActivity/myPeerActivity?peerType=friend&peerId=' + options.peerId
      })
    }
    //查看分享服务
    if (options.state == 'product') {
      wx.navigateTo({
        url: '/pages/public/serviceDetails/serviceDetails?id=' + options.productId + '&type=' + options.type
      })
    }
  },
  onShow: function () {
    var that = this;
    this.setSkin();
    wx.authorize({
      scope: 'scope.userLocation',
      success: function () {
        that.setData({
          getLocation: true
        })
      },
      fail: function () {
        that.setData({
          getLocation: false
        })
      }
    })
    app.login(this.setBusiness);
  },
  // 加载数据
  setBusiness: function () {
    var that = this;
    new Promise(function (resolve, reject) {
      app.request(app.host + 'shop/infoBo/findList4App/' + app.appid, 'POST', 'form', {}, function (res) {
        that.setData({
          'business.icon': wx.getStorageSync('businessIcon') || res.data.data[0].iconImgUrl,
          'business.name': wx.getStorageSync('businessName') || res.data.data[0].name,
          'business.address': wx.getStorageSync('businessAddress') || res.data.data[0].address,
          'business.phone': wx.getStorageSync('businessPhone') || res.data.data[0].phone,
          'business.id': wx.getStorageSync('businessId') || res.data.data[0].id,
          'business.map': wx.getStorageSync('businessMap') || { latitude: res.data.data[0].latitudeX, longitude: res.data.data[0].longitudeX },
          loading: false
        });
        wx.setStorageSync('businessId', that.data.business.id);
        wx.setStorageSync('businessPhone', that.data.business.phone);
        wx.setNavigationBarTitle({
          title: wx.getStorageSync('businessName') || res.data.data[0].name,
        });
        app.request(app.host + 'appointment/set/find4App/' + that.data.business.id,'POST','form',{},function(res){
          if(res.data.data){
            if (res.data.data.changeField == 1) {
              wx.setStorageSync('appointSet', res.data.data);
            }else{
              wx.removeStorageSync('appointSet');
            }
          }else{
            wx.removeStorageSync('appointSet');
          }
          that.setData({
            setnames: res.data.data&&res.data.data.changeField==1 ? res.data.data.rackRate:'门市价'
          })
          resolve();
        });
      });
    }).then(function () {
      app.request(app.host + 'peer/findPage4App/' + app.appid + '/' + that.data.business.id, 'POST', 'form', {
        status: 2
      }, function (res) {
        let actlist = [];
        let datelist = [];
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.icon = i.iconUrl;
          item.name = i.name;
          actlist.push(item);
          datelist.push(that.dateParse(i.createDate).dates + that.dateParse(i.createDate).times);
        }
        that.setData({
          actlist: [actlist[datelist.indexOf(datelist.slice().sort()[datelist.length - 1])]]
        })
      });
    }).then(function () {
      app.request(app.host + 'goods/info/findPageList4App/' + app.appid, 'POST', 'form', {
        shopId: that.data.business.id,
        category: 5,
        pageSize: 2,
        pageIndex: 1
      }, function (res) {
        let servlist = [];
        for (let i of res.data.data.list) {
          let item = {};
          item.id=i.id;
          item.icon = i.imgUrl;
          item.name = i.name;
          item.price = i.price;
          item.soldNum = i.soldNum + i.receiveCount;
          item.maxRackRate = i.maxRackRate;
          item.maxInCoin = Math.round(i.coinProportion / 100 * i.price * 100) / 100 || 0;
          servlist.push(item);
        }
        that.setData({
          servlist: servlist
        })
      });
    }).then(function () {
      app.request(app.host + 'goods/info/findPageList4App/' + app.appid, 'POST', 'form', {
        shopId: that.data.business.id,
        category: 1,
        pageSize: 4,
        pageIndex: 1
      }, function (res) {
        let golist = [];
        for (let i of res.data.data.list) {
          let item = {};
          item.id=i.id;
          item.icon = i.imgUrl;
          item.name = i.name;
          item.price = i.price;
          item.oldPrice = i.minRackRate;
          item.payNum = (i.receiveCount + i.realPayment).toFixed(0);
          item.maxInCoin = Math.round(i.coinProportion / 100 * i.price * 100) / 100 || 0;
          golist.push(item);
        }
        that.setData({
          golist: golist
        })
      });
    });

  },
  setSkin: function () {
    this.setData({
      themeColor: app.globalObj.themeColor,
      themeTxtColor: app.globalObj.themeTxtColor,
      assistedTxtColor1: app.globalObj.assistedTxtColor1,
      assistedTxtColor2: app.globalObj.assistedTxtColor2,
      importantColor: app.globalObj.importantColor,
      phoneicon:app.indexObj.phoneicon,
      changestoreicon: app.indexObj.changestoreicon,
      defaulticon: app.indexObj.defaulticon,
      locationicon: app.indexObj.locationicon,
      couponicon:app.indexObj.couponicon,
    })
  },
  onShareAppMessage: function () {

  }
})
