const app=getApp();
export default {

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    getUserInfoState: false,
    userName: '',
    userPhone: '',
    coinValletState:false,
  },
  switchtab:function(e){
    wx.setStorageSync('productTab','2');
    wx.switchTab({
      url: e.currentTarget.dataset.url,
    })
  },
  nav:function(e){
    app.nav(e.currentTarget.dataset.url);
  },
  phoneCall: function (e) {
    app.phoneCall(e.currentTarget.dataset.phone);
  },
  //获取用户头像和昵称
  // getUserInfo:function(e){
  //   var that=this;
  //   wx.getUserInfo({
  //     success:function(res){
  //       that.setData({
  //         getInfo:true,
  //         usericon: res.userInfo.avatarUrl,
  //         username:res.userInfo.nickName
  //       })
  //     },
  //     fail:function(){
  //       that.setData({
  //         getInfo: false
  //       })
  //     }
  //   })
  // },
  //解析从后台传递的时间
  dateParse: function (date) {
    var datereg = /\d{4}(-|\.|\s)\d{2}(-|\.|\s)\d{2}/;
    var timereg = /\d{2}:\d{2}:\d{2}/;
    var dates = datereg.exec(date)[0];
    var times = timereg.exec(date)[0];
    var millisecond = new Date(dates + " " + times).getTime();
    return { dates, times, millisecond };
  },
  // 倒计时
  countDown: function (times) {
    var timer = null;
    var that = this;
    timer = setInterval(function () {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
      if (times > 0) {
        hour = Math.floor(times / (60 * 60));
        minute = Math.floor(times / 60) - (hour * 60);
        second = Math.floor(times) - (hour * 60 * 60) - (minute * 60);
      }
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      //
      // console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
      var date = hour + '小时：' + minute + '分钟：' + second + '秒';
      that.setData({
        'lastserv.date': date
      })
      times--;
    }, 1000);
    if (times <= 0) {
      clearInterval(timer);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面跳转判断
    console.log(options);
    //去支付成功页面
    if (options.state == 'paySuccess'){
      wx.navigateTo({
        url: '/pages/public/paySuccess/paySuccess?orderId=' + options.orderId
      })
    }
    //去我的同行活动页面
    if (options.state == 'payPeerSuccess') {
      wx.navigateTo({
        url: '/pages/public/myPeerActivity/myPeerActivity?peerId=' + options.peerId + '&peerType=me'
      })
    }
    var that=this;
    this.setSkin();
    that.setData({
      phone:wx.getStorageSync('businessPhone')
    })
    // that.getUserInfo();
    //判断是否获取用户信息
    this.judeUserInfo();
    //判断是否开放我的币钱包入口
    this.getCoinValletState();
    
  },
  //判断是否获取用户信息
  judeUserInfo: function () {
    let that = this;
    app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
      appId: app.appid,
    }, function (res) {
      console.log(res.data);
      if (res.data.data) {
        if (res.data.data.nickname && res.data.data.avatarUrl) {
          that.setData({
            getInfo:true,
            usericon: res.data.data.avatarUrl,
            username: res.data.data.nickname,
          })
        } else {
          that.getShopInfo();
          that.setData({
            getUserInfoState: true,
            getInfo:false,
          })
        }
      }
      else {
        that.getShopInfo();
        that.setData({
          getUserInfoState: true,
          getInfo: false,
        })
      }
    })
  },
  //判断是否开放我的币钱包入口
  getCoinValletState:function(){
    let that = this;
    //获取商户发布等相关信息
    app.request(app.host + 'coin/findMerchantIssueStatus/' + app.appid, 'POST', 'form', {},
      function (res) {
        console.log(res.data);
        if (res.data.data && res.data.data.content.status == 5){
          that.setData({
            coinValletState:true
          })
        }else{
          that.setData({
            coinValletState: false
          })
        }
      })
  },
  //获取店铺信息
  getShopInfo: function () {
    let that = this;
    app.request(app.host + 'shop/infoBo/find4App/' + wx.getStorageSync('businessId'), 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.setData({
          shopName: res.data.data.name,
          shopImgSrc: res.data.data.iconImgUrl,
        })
      }
    })
  },
  //关闭获取用户信息弹窗
  closeGetUserInfo: function () {
    this.setData({
      getUserInfoState: false
    })
  },
  //授权用户信息
  getUserInfo: function (e) {
    let that = this;
    console.log(e);
    if (e.detail.userInfo) {
      wx.getUserInfo({
        lang: 'en',
        success: function (res) {
          console.log(res);
          //保存用户信息到服务器
          app.request(app.host + 'member/info/updateByWeiXin', 'POST', 'form', {
            appId: app.appid,
            openId: app.openid,
            encryptedData: res.encryptedData,
            iv: res.iv,
          }, function (res) {
            console.log(res.data);
            if (res.data.data) {
              console.log('授权成功');
              that.setData({
                getUserInfoState: false,
                getInfo:true,
                usericon: res.data.data.avatarUrl,
                username: res.data.data.nickname,
              })
            }
          })
        }
      })
    }
  },
  //临时访问线下付款
  toUnderLinePay:function(){
    wx.navigateTo({
      url: '/pages/public/underLinePay/underLinePay?shopId=' + wx.getStorageSync('businessId'),
    })
  },
  setSkin:function(){
    this.setData({
      themeTxtColor: app.globalObj.themeTxtColor,
      assistedTxtColor1: app.globalObj.assistedTxtColor1,
      assistedTxtColor2: app.globalObj.assistedTxtColor2,
      noinfoicon:app.personalCenterObj.noinfoicon,
      ordericon1: app.personalCenterObj.ordericon1,
      ordericon2: app.personalCenterObj.ordericon2,
      ordericon3: app.personalCenterObj.ordericon3,
      ordericon4: app.personalCenterObj.ordericon4,
      listicon1: app.personalCenterObj.listicon1,
      listicon2: app.personalCenterObj.listicon2,
      listicon3: app.personalCenterObj.listicon3,
      listicon4: app.personalCenterObj.listicon4,
      themeColor: app.globalObj.themeColor,//主题色
      closeIcon: app.produtObj.closeIcon,//关闭按钮
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    new Promise(function (resolve, reject) {
      app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
        appId: app.appid
      }, function (res) {
        if (res.data.data) {
          that.setData({
            ismember: true
          })
        } else {
          that.setData({
            ismember: false
          })
        }
        resolve();
      });
    }).then(function () {
      if (that.data.ismember) {//会员
        app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
          appId: app.appid
        }, function (res) {
          that.setData({
            rest: res.data.data.accountBalance,
            point: res.data.data.totalScore,
            // coupon: res.data.data.couponQuantity,
            customid: res.data.data.customerId
          })
        });
        app.request(app.host +'member/coupon/findPage4App/'+app.appid+'/'+app.openid,'POST','form',{
          shopId: wx.getStorageSync('businessId'),
          status:1
        },function(res){
          that.setData({
            coupon:res.data.data.count
          })
        });
        app.request(app.host + 'appointment/findPageList4App/' + app.appid + '/' + app.openid, 'POST', 'form', {
          shopId: wx.getStorageSync('businessId'),
          appointmentType: 1,
          status: '2,3'
        }, function (res) {
          let list = [];
          for (let i of res.data.data.list) {
            let item = {};
            item.id=i.summary.id;
            item.name = i.detailList[0].goodsName;
            item.createDate = that.dateParse(i.recInfo.createDate).dates + ' ' + that.dateParse(i.recInfo.createDate).times;
            item.appointDate = that.dateParse(i.summary.appointmentDate).dates + ' ' + that.dateParse(i.summary.appointmentDate).times;
            item.hasPaid = i.summary.payStatus == 2;
            if (i.recInfo.type == 1) { //到店
              item.types = wx.getStorageSync('appointSet') ? wx.getStorageSync('appointSet').serviceToShop:'预约到店';
            } else if (i.recInfo.type == 2) { //上门
              item.types = wx.getStorageSync('appointSet') ? wx.getStorageSync('appointSet').serviceToHome :'预约上门';
            }
            list.push(item);
          }
          let lastserv = {};
          let hasappoint = false;
          if (list.length != 0) {
            let datelist = [];
            for (let j of list) {
              datelist.push(j.createDate);
            }
            lastserv = list[datelist.indexOf(datelist.slice().sort()[datelist.length - 1])];
            that.countDown((that.dateParse(lastserv.appointDate).millisecond / 1000) - new Date().getTime() / 1000);
            hasappoint = true;
          }
          that.setData({
            hasappoint: hasappoint,
            lastserv: lastserv,
            loading: false
          });
        });
      } else {//非会员
        that.setData({
          rest: 0,
          point: 0,
          coupon: 0,
          loading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}