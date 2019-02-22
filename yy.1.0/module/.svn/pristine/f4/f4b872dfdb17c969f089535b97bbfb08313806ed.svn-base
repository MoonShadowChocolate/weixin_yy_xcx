const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    getUserInfoState: false,
    userName: '',
    userPhone: '',
    loading:true,
    payState: true,//支付状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    //设置皮肤
    this.setStyleFun();
    //获取店铺Id
    let businessId = wx.getStorageSync('businessId');
    this.setData({
      businessId: businessId
    })
    let cardId = options.cardId;
    this.setData({
      cardId: cardId
    })
    //查询充值内容
    this.searchCardInfo();
    //判断是否获取用户信息
    this.judeUserInfo();
  },
  //查询充值内容
  searchCardInfo: function () {
    let that = this;
    app.request(app.host + 'card/info/find/' + that.data.cardId, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.setData({
          cardId: res.data.data.id,
          cardName: res.data.data.name,
          cardPrice: res.data.data.rechargeAmount,
          loading:false
        })
      }
    })
  },
  //判断是否获取用户信息
  judeUserInfo: function () {
    let that = this;
    app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
      appId: app.appid,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data.nickname && res.data.data.avatarUrl) {
          that.setData({
            userName: res.data.data.nickname,
            userPhone: res.data.data.phone,
          })
        } else {
          that.getShopInfo();
          that.setData({
            userPhone: res.data.data.phone,
            getUserInfoState: true,
          })
        }
      }
    })
  },
  //获取店铺信息
  getShopInfo: function () {
    let that = this;
    app.request(app.host + 'shop/infoBo/find4App/' + that.data.businessId, 'POST', 'form', {}, function (res) {
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
                userName: res.data.data.nickname,
              })
            }
          })
        }
      })
    }
  },
  //输入会员名
  inputsName: function (e) {
    console.log(e);
    this.setData({
      userName: e.detail.value
    })
  },
  //输入手机号
  inputsPhone: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  //去支付
  toPay: function () {
    let that = this;
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/; //电话匹配正则
    if (that.data.userName == '') {
      wx.showToast({
        title: '未填写会员名',
        image: '/images/close@2x.png',
        duration: 2000
      })
    } else if (!reg.test(that.data.userPhone)) {
      wx.showToast({
        title: '未填写手机号',
        image: '/images/close@2x.png',
        duration: 2000
      })
    } else {
      //订单校验
      app.request(app.host + 'order/check4CardItem/' + app.appid + '/' + app.openid, 'POST', 'form', {
        cardId: that.data.cardId
      }, function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          //下单
          app.request(app.host + 'order/add4CardItem/' + app.appid + '/' + app.openid, 'POST', 'form', {
            cardId: that.data.cardId,
            name: that.data.userName,
            phone: that.data.userPhone,
            shopAddrId: that.data.businessId,
            nickname: that.data.userName,
          }, function (res) {
            console.log(res.data);
            if (res.data.code == 200) {
              let orderId = res.data.data.detailList[0].orderId;
              that.pay(orderId);
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '/images/close@2x.png',
            duration: 2000
          })
        }
      })
    }
  },
  //支付
  pay: function (orderId) {
    var that = this;
    if (that.data.payState){
      console.log(orderId)
      that.setData({
        payState:false
      })
      app.login(wx.request, {
        url: app.host + 'weiXin/unifiedOrder/' + app.appid + '/' + orderId,
        // data:{
        //   category:3
        // },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data);
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            success: function (res) {
              console.log(res);
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/public/personalCenter/personalCenter',
                })
              }, 1500);
              wx.showToast({
                title: '支付成功',
                mask: true
              })
            },
            fail: function (res) {
              console.log(res)
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/public/personalCenter/personalCenter',
                })
              }, 1500);
              wx.showToast({
                title: '支付失败',
                image: '/images/close@2x.png',
                mask: true
              })
            },
            complete: function (res) {
              console.log(res)
            }
          })
        }
      });
    }
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

  },
  //设置皮肤
  setStyleFun: function () {
    this.setData({
      themeColor: app.globalObj.themeColor,//主题色
      assistedColor1: app.globalObj.assistedColor1,//辅助色1
      assistedColor2: app.globalObj.assistedColor2,//辅助色2
      importantColor: app.globalObj.importantColor,//重要警示性颜色
      btnGradientColor: app.globalObj.btnGradientColor,//一些按钮背景的渐变色
      themeTxtColor: app.globalObj.themeTxtColor,//主文字色
      assistedTxtColor1: app.globalObj.assistedTxtColor1,//辅助文字色1
      assistedTxtColor2: app.globalObj.assistedTxtColor2,//辅助文字色2
      getCodeBtnBgColor: app.globalObj.assistedColor1,//获取按钮的背景色
      closeIcon: app.produtObj.closeIcon,//关闭按钮
    })
  }
}