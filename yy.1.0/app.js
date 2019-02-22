//app.js
App({
  // 登录
  login:function (cb, ...prop) {
    var that = this;
    function login() {
      wx.login({
        success: function (res) {
          if (res.code) {
            that.code = res.code;
            console.log("获取code成功");
            console.log('res.code:', res.code);
            wx.request({
              url: that.host + 'weiXin/trans2OpenId/' + that.appid + '/' + res.code,//服务器地址
              method: 'POST',
              data: {
                code: res.code 
              },
              success(re) {
                console.log("后台返回数据：")
                console.log(re.data);
                that.openid = re.data.data; //购物车和订单接口需要的openid
                wx.setStorageSync('openid', re.data.data);
                console.log('!', that.openid, '!');
                if (cb != undefined) {
                  cb(...prop);
                }
              }
            })
          } else {
            console.error("获取code失败，原因为：微信接口返回了空数据")
          }
        },
        fail: function () {
          console.error("获取code失败，原因为：微信接口调用失败")
        }
      });
    }

    //检查登录态
    wx.checkSession({
      success: function () {
        if (wx.getStorageSync('openid')) {
          console.log("当前登录态可用");
          that.openid = wx.getStorageSync('openid');
          console.log('!', that.openid, '!');
          if (cb != undefined) {
            cb(...prop);
          }
        } else {
          console.log('本地openid为空，重新获取');
          login();
        }
      },
      fail: function () {
        console.log("当前登录态已过期，尝试重新获取");
        login();
      }
    })
  },
  //通用微信支付
  wxPayment: function (orderId, success, types,fail,complete) {
    var that = this;
    types = types ? types : 1;
    fail=fail||function(res){
      console.log(res)
    };
    complete=complete||function(res){
      console.log(res)
    };
    that.login(that.request, that.host + 'weiXin/unifiedOrder/' + that.appid + '/' + orderId, 'POST', 'form', {
      category: types
    }, function (res) {
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': res.data.data.signType,
        'paySign': res.data.data.paySign,
        success: success,
        fail: fail,
        complete: complete
      })
    });
  },
  //通用request请求
  request:function (url, method, header, data, success, fail, complete) {
    method = method || 'POST';
    if(header == 'json') {
      header = {
        'content-type': 'application/json'
      }
    } else {
      header = {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }
    data = data || {};
    success = success || function (res) {
      console.log('default request success');
    };
    fail = fail || function (res) {
      console.log('default request fail')
    };
    complete = complete || function (res) {

    };
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: success,
      fail: fail,
      complete: complete
    });
  },
  //通用电话拨打
  phoneCall:function(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D+/g, "");
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },
  //通用导航方法
  nav: function (url) {
    if (getCurrentPages().length < 10) {
      wx.navigateTo({
        url: url
      })
    } else {
      wx.reLaunch({
        url: url
      })
    }
  },
  onShow:function(){
    this.login();
  },
  onLaunch: function () {
    // this.appid = '3371033981919645119';//预约开发
    // this.subAppId = 'wxe4910ca17f45b537';//预约开发
    // this.appid = '7953856322104410985';//恒鑫豪泰
    // this.subAppId = 'wx58ccc8b1cad31a55';//恒鑫豪泰
    // this.host = 'http://192.168.1.107:8080/wxApp/';
    // this.host = 'http://192.168.1.247:8080/wxApp/'; //本地联调
    this.host = 'https://xcx.yzsaas.cn/';//正式环境
    // this.host = 'https://xcx.imdtcx.com/';//测试环境
    // this.host ='http://192.168.1.247/wxApp/';
    this.imgurl = 'space/showImg/';
    this.video = 'video/showVideo/';
    var that = this;
    //获取自定义appId
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function (res) {
          console.log('---后台返回ext自定义字段---')
          console.log(res);
          // that.appid = res.extConfig.appId || '3371033981919645119';//测试环境
          that.appid = res.extConfig.appId || '3504451698693916603';//正式环境
          that.subAppId = res.extConfig.subAppid || 'wxe4910ca17f45b537';
        }
      })
    }
    //小程序皮肤全局声明
    //全局对象
    let globalObj = {};
    globalObj.themeColor = '#ffe200';//主题色
    globalObj.assistedColor1 = '#39c615';//辅助色1
    globalObj.assistedColor2 = '#ff8a2c';//辅助色2
    globalObj.importantColor = '#ff4646';//重要警示性颜色
    globalObj.btnGradientColor = 'linear-gradient(to right, #FFB824 , #FFA100)';//一些按钮背景的渐变色
    globalObj.themeTxtColor = '#333333';//主文字色
    globalObj.assistedTxtColor1 = '#999999';//辅助文字色1
    globalObj.assistedTxtColor2 = '#cccccc';//辅助文字色2
    this.globalObj = globalObj;

    // 首页
    let indexObj = {
      phoneicon: '/images/index/call@2x.png', //拨打电话按钮图标
      changestoreicon: '/images/index/switch@2x.png',//切换门店图标
      defaulticon:'/images/index/dDefault_avatar@2x.png',//默认头像图标
      locationicon:'/images/index/location@2x.png',//地址图标
      couponicon:'/images/index/collect_coupons@2x.png'//优惠券图标
    };
    this.indexObj = indexObj;

    // 切换门店
    let changeStoreObj={
      phoneicon:'/images/changeStore/call@2x.png', //拨打电话按钮图标
      locationicon:'/images/changeStore/go_there@2x.png'//地图按钮图标
    };
    this.changeStoreObj = changeStoreObj;

    // 预约列表
    let myOrderObj = {
      nolisticon: '/images/myOrder/no_order@2x.png', //无预约图标
    };
    this.myOrderObj = myOrderObj; 

    // 个人中心
    let personalCenterObj = {
      noinfoicon: '/images/personalCenter/person_avatar@2x.png', //无授权头像
      ordericon1: '/images/personalCenter/payment@2x.png',//待付款图标
      ordericon2: '/images/personalCenter/picked_up@2x.png',//待提货图标
      ordericon3: '/images/personalCenter/serve@2x.png',//待服务图标
      ordericon4:'/images/personalCenter/cancelled@2x.png',//已取消图标
      listicon1: '/images/personalCenter/my_order@2x.png',//‘我的订单’图标
      listicon2: '/images/personalCenter/my_activity@2x.png',//‘我的活动’图标
      listicon3:'/images/personalCenter/person_call@2x.png',//‘联系商家’图标
      listicon4: '/images/personalCenter/my_wallet@2x.png',//‘我的币钱包’图标
    };
    this.personalCenterObj = personalCenterObj; 

    // 积分
    let pointObj = {
      topicon: '/images/point/integral_illustration@2x.png', //顶部积分图标
    };
    this.pointObj = pointObj; 

    //产品
    let produtObj={
      shareIcon: '/images/product/share.png',//分享图标
      markIcon: '/images/product/refundable.png',//选项标记图标
      positionIcon: '/images/product/go_there.png',//地图定位图标
      callIcon: '/images/product/big_call.png',//打电话图标
      barSpotAutoColor: '#DBDBDB',//优惠同行进度条默认颜色
      barBorderMarkColor: 'solid 10rpx #ffebd5',//优惠同行进度条标记边框颜色
      barBorderAutoColor: 'solid 10rpx #f8f8f8',//优惠同行进度条默认边框颜色
      noServeIcon: '/images/product/no_serve.png',//无服务图标
      noGoodsIcon: '/images/product/no_goods.png',//无商品图标
      noCardIcon: '/images/product/no_card.png',//无卡项图标
      noActivityIcon: '/images/product/no_activity.png',//无活动图标
      closeIcon: '/images/product/close_pop.png',//关闭按钮图标
    }
    this.produtObj = produtObj;

    //支付
    let payObj={
      weixinIcon: '/images/product/wechat.png',//微信图标
      balanceIcon: '/images/product/balance.png',//余额图标
      hookIcon: '/images/product/hook.png',//预约成功标志
    };
    this.payObj = payObj;

    //同行优惠
    let peerDiscountObj={
      ruleBgColor: '#AA30FF',//活动规则按钮背景颜色
      ruleTitleColor: '#FF8A2C',//活动规则标题颜色
      closeIcon: '/images/product/close_pop.png',//活动规则关闭按钮
    }
    this.peerDiscountObj = peerDiscountObj;

    //选择优惠券
    let selCouponObj={
      couponGradientColor1: 'linear-gradient(to right, #FC9340 , #FC2B95)',//优惠券背景渐变色1
      couponGradientColor2: 'linear-gradient(to right, #B63DFF , #692CFF)',//优惠券背景渐变色2
      couponGradientColor3: 'linear-gradient(to right, #47D6FF , #47BCFF)',//优惠券背景渐变色3
      emptyIcon: '/images/product/no_coupon.png',
    }
    this.selCouponObj = selCouponObj;

    //我的币钱包
    let myCoinWalletObj={
      coinTopBgIcon:'/images/myCoinWallet/coin@2x.png',//我的币钱包头部背景图
      rechargeIcon:'/images/recharge/recharge_coin@2x.png',//币充值单位背景图标
      recgargeLinkIcon:'/images/recharge/link@2x.png',//币充值输入框链接图标
    }
    this.myCoinWalletObj = myCoinWalletObj;

    let orderDetailObj={
      cardicon:'/images/myOrder/card_thumbnail@2x.png',
      topayicon:'/images/orderDetail/list_payment@2x.png',
      finishicon:'/images/orderDetail/list_done@2x.png',
      cancelicon:'/images/orderDetail/list_cancelled@2x.png',
      toservicon:'/images/orderDetail/list_serve@2x.png',
      togeticon:'/images/orderDetail/list_picked_up@2x.png',
      phoneicon:'/images/changeStore/call@2x.png',
      locicon:'/images/changeStore/go_there@2x.png'
    }
    this.orderDetailObj = orderDetailObj;
  }
})