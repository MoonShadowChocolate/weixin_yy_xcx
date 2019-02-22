const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    /* 初始化领取会员 start */
    getMemberState: false,
    getPhoneState: false,
    userPhone: '',
    userCode: '',
    getCodeBtnTxt: '获取',
    countDownNum: 60,
    getCodeBtnState: true,
    /* 初始化领取会员 end */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    //设置皮肤
    that.setStyleFun();
    //获取店铺电话
    this.setData({
      phone: wx.getStorageSync('businessPhone'),
    })
    app.request(app.host + 'card/info/find/' + options.id, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200 && res.data.data) {
        that.setData({
          cardId: res.data.data.id,
          rechargeAmount: parseInt(res.data.data.rechargeAmount),
          giveAmount: parseInt(res.data.data.giveAmount),
          cardName: res.data.data.name,
          cardUseDesc: res.data.data.useDesc,
          loading: false
        })
      }
    });
  },
  //立刻充值
  payCard: function () {
    let that = this;
    //判断是否为会员
    app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
      appId: app.appid
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data) {
          wx.navigateTo({
            url: '/pages/public/buyCard/buyCard?cardId=' + that.data.cardId
          })
        } else {
          that.setData({
            getMemberState: true
          })
        }
      }
    });
  },

  /* 领取会员 start */
  //获取手机号
  getPhoneNumber: function (e) {
    console.log(e);
    var that = this;
    wx.checkSession({
      success: function () {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        var encryptedData = e.detail.encryptedData;
        var iv = e.detail.iv;
        //领取会员
        wx.request({
          url: app.host + 'member/info/becomeMember',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            'openId': app.openid,
            'encryptedData': encryptedData,
            'iv': iv,
            'appId': app.appid
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              that.setData({
                getMemberState: false,
              })
              wx.showToast({
                title: '激活成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/public/buyCard/buyCard?cardId=' + that.data.cardId
                })
              }, 2000)
            } else {
              wx.showToast({
                title: res.data.message,
                image: '/images/close@2x.png',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //显示用户获取验证码弹窗
  showUserGetPhone: function () {
    this.setData({
      getPhoneState: true
    })
  },
  //关闭激活会员弹窗
  closeGetMember: function () {
    this.setData({
      getMemberState: false
    })
  },
  //关闭用户获取验证码弹窗
  closeGetCode: function () {
    this.setData({
      getPhoneState: false
    })
  },
  //手机号输入框输入事件
  userPhoneInput: function (e) {
    console.log(e);
    this.setData({
      userPhone: e.detail.value
    })
  },
  //验证码输入框输入事件
  userCodeInput: function (e) {
    console.log(e);
    this.setData({
      userCode: e.detail.value
    })
  },
  //获取验证码点击事件
  getCode: function () {
    if (this.data.getCodeBtnState) {
      let that = this;
      let userPhone = this.data.userPhone;
      if (userPhone == '') {
        wx.showToast({
          title: '请先输入手机号',
          image: '/images/close@2x.png',
          duration: 2000
        })
      } else {
        let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!phoneReg.test(userPhone)) {
          wx.showToast({
            title: '手机号格式错误',
            image: '/images/close@2x.png',
            duration: 2000
          })
        } else {
          that.sendCode(userPhone);
        }
      }
    }
  },
  //发送短信验证码
  sendCode: function (userPhone) {
    let that = this;
    app.request(app.host + 'netease/sms/sendCode', 'POST', 'form', {
      mobile: userPhone,
      typeFlag: 201,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.getCodeCountDown();
      } else {
        wx.showToast({
          title: res.data.message,
          image: '/images/close@2x.png',
          duration: 2000
        })
      }
    })
  },
  //获取验证码按钮触发后倒计时置灰
  getCodeCountDown: function () {
    let that = this;
    let countDownNum = Number(that.data.countDownNum);
    if (countDownNum > 0) {
      countDownNum--;
      setTimeout(function () {
        that.setData({
          countDownNum: countDownNum,
          getCodeBtnTxt: countDownNum + 's',
          getCodeBtnBgColor: '#ccc',
          getCodeBtnState: false,
        })
        that.getCodeCountDown();
      }, 1000);
    } else {
      that.setData({
        countDownNum: 60,
        getCodeBtnTxt: '获取',
        getCodeBtnBgColor: that.data.assistedColor1,
        getCodeBtnState: true,
      })
    }
  },
  //立即激活
  getMemberCodeStyle: function () {
    let that = this;
    let userPhone = this.data.userPhone;
    let userCode = this.data.userCode;
    if (userPhone == '') {
      wx.showToast({
        title: '请先输入手机号',
        image: '/images/close@2x.png',
        duration: 2000
      })
    } else {
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(userPhone)) {
        wx.showToast({
          title: '手机号格式错误',
          image: '/images/close@2x.png',
          duration: 2000
        })
      } else {
        if (userCode == '') {
          wx.showToast({
            title: '请先获取验证码',
            image: '/images/close@2x.png',
            duration: 2000
          })
        } else {
          //激活会员
          app.request(app.host + 'member/info/becomeMemberPhone', 'POST', 'form', {
            openId: app.openid,
            appId: app.appid,
            phone: userPhone,
            smsCode: userCode
          }, function (res) {
            console.log(res.data);
            if (res.data.code == 200) {
              that.setData({
                getMemberState: false,
                getPhoneState: false,
              })
              wx.showToast({
                title: '激活成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/public/buyCard/buyCard?cardId=' + that.data.cardId
                })
              }, 2000)
            }
            else if (res.data.code == 413) {
              wx.showToast({
                title: '验证码错误',
                image: '/images/close@2x.png',
                duration: 2000
              })
            }
            else {
              wx.showToast({
                title: res.data.message,
                image: '/images/close@2x.png',
                duration: 2000
              })
            }
          })
        }
      }
    }
  },
  /* 领取会员 end */
  //给商家打call
  phoneCall: function (e) {
    app.phoneCall(e.currentTarget.dataset.phone);
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
      callIcon: app.produtObj.callIcon,//打电话图标
      closeIcon: app.produtObj.closeIcon,//关闭按钮图标
    })
  }
}