const app = getApp();
const appUtil = require("../utils/appUtil.js");
export default {
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',//会员名
    loading:true,
    userJoinState:false,//用户参加活动状态
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
    //设置皮肤
    this.setStyleFun();
    if (options.peerType == 'me') {
      this.setData({
        peerType: 'me',
      })
    }
    if (options.peerType == 'friend') {
      this.setData({
        peerType: 'friend',
      })
    }
    wx.setNavigationBarTitle({
      title: '我的活动'
    });
    this.setData({
      peerId: options.peerId,
    })
    //查询同行概要
    this.getPeerDetail();
    //获取用户信息
    this.getUserInfo();
  },
  //查询同行概要
  getPeerDetail: function () {
    let that = this;
    app.request(app.host + 'peer/findSummaryBo/' + that.data.peerId, 'POST', 'form', {
      appId: app.appid,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        for (let i of res.data.data.detailList){
          if (app.openid == i.openId){
            that.setData({
              userJoinState:true
            })
          }
        }
        that.setData({
          peerImg: res.data.data.summary.iconUrl,
          goodsId: res.data.data.summary.goodsId,
          goodsName: res.data.data.summary.goodsName,
          joinNum: res.data.data.summary.joinNum,
          discountList: res.data.data.discountList,
        })
        that.getPeerShopInfo();
      }
    })
  },
  //获取同行活动商品信息
  getPeerShopInfo: function () {
    let that = this;
    app.request(app.host + 'peer/findPeerGoods/' + that.data.goodsId, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        //获取同行优惠
        let peerDiscountList = [
          {
            title: '单人购买',
            price: res.data.data.paramSpecDetailList[0].price,
            joinState: true,
          }
        ];
        let markNum=1;
        // let discountList = that.data.discountList;
        // for (let i = discountList.length - 1; i >= 0; i--) {
        //   let item = {};
        //   item.title = discountList[i].joinNum + '人同行';
        //   item.price = that.getPeerPrice(res.data.data.paramSpecDetailList[0].price, discountList[i].discountType, discountList[i].discount);
        //   if (that.data.joinNum >= discountList[i].joinNum) {
        //     item.joinState = true;
        //     markNum++;
        //   } else {
        //     item.joinState = false;
        //   }
        //   peerDiscountList.push(item);
        // }
        for (let i of that.data.discountList) {
          let item = {};
          item.title = i.joinNum + '人同行';
          item.price = that.getPeerPrice(res.data.data.paramSpecDetailList[0].price, i.discountType, i.discount);
          if (that.data.joinNum >= i.joinNum) {
            item.joinState = true;
            markNum++;
          } else {
            item.joinState = false;
          }
          peerDiscountList.push(item);
        }
        //设置进度条宽度
        let peerBarWidth = 0;
        if (that.data.discountList.length == 1) {
          switch (markNum)
          {
            case 1: peerBarWidth = 0; break;
            case 2: peerBarWidth = '100%'; break;
          }
        }
        if (that.data.discountList.length == 2) {
          switch (markNum) {
            case 1: peerBarWidth = 0; break;
            case 2: peerBarWidth = '50%'; break;
            case 3: peerBarWidth = '100%'; break;
          }
        }
        if (that.data.discountList.length == 3) {
          switch (markNum) {
            case 1: peerBarWidth = 0; break;
            case 2: peerBarWidth = '34%'; break;
            case 3: peerBarWidth = '67%'; break;
            case 4: peerBarWidth = '100%'; break;
          }
        }
        that.setData({
          detailsPrice: res.data.data.info.price,
          minRackRate: res.data.data.info.minRackRate,
          peerBarWidth: peerBarWidth,
          peerDiscountList: peerDiscountList,
          deposit: res.data.data.info.deposit,//定金
          paramId: res.data.data.paramSpecDetailList[0].id,
          paramName: res.data.data.paramSpecDetailList[0].specValueOne,
          loading:false
        })
      }
    })
  },
  //同行优惠计算同行价格
  getPeerPrice: function (oldPrice, discountType, val) {
    //减价
    if (discountType == 1) {
      return appUtil.setOnePriceStyle(appUtil.accSub(oldPrice, val));
    }
    //打折
    if (discountType == 2) {
      return appUtil.setOnePriceStyle(appUtil.accMul(oldPrice, val / 10));
    }
  },
  //获取用户信息
  getUserInfo: function () {
    let that = this;
    app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
      appId: app.appid,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data.nickname) {
          that.setData({
            userName: res.data.data.nickname,
          })
        }
      }
    })
  },
  //立即参加
  toJoin: function () {
    let that = this;
    if (that.data.userJoinState){
      wx.showToast({
        title: '你已参加本活动',
        image: '/images/close@2x.png',
        mask: true
      })
    }else{
      //判断是否为会员
      app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
        appId: app.appid
      }, function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          if (res.data.data){
            let param = {};
            param.id = that.data.goodsId;//产品Id
            param.name = that.data.goodsName;//产品名称
            param.img = that.data.peerImg;//产品图片
            param.paramId = that.data.paramId;//产品规格详情Id
            param.paramName = that.data.paramName;//产品规格名称
            param.totalPrice = that.data.deposit;//定金
            param.quantity = 1;//购买数量
            param.peerSummaryId = that.data.peerId;//同行概要Id
            wx.setStorageSync('param', param);//订单相关参数
            wx.setStorageSync('orderType', 'peer');//预约订单类型
            wx.navigateTo({
              url: '/pages/public/orderFilling/orderFilling'
            })
          }
          else{
            that.setData({
              getMemberState: true
            })
          }
        }
      })
    }
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
              //激活成功后执行
              let param = {};
              param.id = that.data.goodsId;//产品Id
              param.name = that.data.goodsName;//产品名称
              param.img = that.data.peerImg;//产品图片
              param.paramId = that.data.paramId;//产品规格详情Id
              param.paramName = that.data.paramName;//产品规格名称
              param.totalPrice = that.data.deposit;//定金
              param.quantity = 1;//购买数量
              param.peerSummaryId = that.data.peerId;//同行概要Id
              wx.setStorageSync('param', param);//订单相关参数
              wx.setStorageSync('orderType', 'peer');//预约订单类型
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/public/orderFilling/orderFilling'
                })
              }, 2000);
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
              //激活会员成功执行

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
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '您的好友' + that.data.userName + '邀您一起同行！',
      path: '/pages/index/index?state=joinPeer&peerId=' + that.data.peerId,
      imageUrl: that.data.peerImg,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
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
      getCodeBtnBgColor: app.globalObj.assistedColor1,//获取验证码按钮背景色
      barSpotAutoColor: app.produtObj.barSpotAutoColor,//优惠同行进度条默认颜色
      barBorderMarkColor: app.produtObj.barBorderMarkColor,//优惠同行进度条标记边框颜色
      barBorderAutoColor: app.produtObj.barBorderAutoColor,//优惠同行进度条默认边框颜色
      closeIcon: app.produtObj.closeIcon,//关闭按钮
    })
  }
}