const app = getApp();
const appUtil = require("../utils/appUtil.js");
export default {
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    productTabList: [
      {
        tabTitle: '服务',
        select: true
      },
      {
        tabTitle: '商品',
        select: false
      },
      {
        tabTitle: '卡项',
        select: false
      },
      {
        tabTitle: '活动',
        select: false
      },
    ],
    // serviceCategory:[
    //   {
    //     id:'',
    //     cateName: '全部',
    //     select: true,
    //     catetype:2
    //   },
    // {
    //   cateName: '护理',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '化妆',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '按摩',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '修眉',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '修脚',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '推拿',
    //   select: false,
    //   clickEvent: ''
    // },
    // {
    //   cateName: '桑拿',
    //   select: false,
    //   clickEvent: ''
    // }
    // ],
    // shopCategory:[
    //   {
    //     cateName: '全部',
    //     select: true,
    //     catetype: 1
    //   },
    // ],
    serviceState: true,
    shopState: false,
    cardState: false,
    activityState: false,
    emptyPageState: false,
    // emptyIcon: '/images/product/no_serve.png',
    emptyTip: '暂无服务~',
    /* 初始化领取会员 start */
    getMemberState: false,
    getPhoneState: false,
    userPhone: '',
    userCode: '',
    getCodeBtnTxt: '获取',
    countDownNum: 60,
    getCodeBtnState: true,
    /* 初始化领取会员 end */
    buyCardId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置皮肤
    this.setStyleFun();
    //获取店铺Id
    let businessId = wx.getStorageSync('businessId');
    this.setData({
      businessId: businessId
    })
    this.getServiceList('');//加载预约服务
    this.getServerTypeList();//加载服务类别
    //预约设置
    this.setData({
      serviceToHome: wx.getStorageSync('appointSet').serviceToHome || '预约上门',//预约上门
      serviceToShop: wx.getStorageSync('appointSet').serviceToShop || '预约到店',//预约到店
      rackRate: wx.getStorageSync('appointSet').rackRate || '门市价',//门市价
      serviceTimeTxt: wx.getStorageSync('appointSet').serviceTime || '服务时长',//服务时长
    })
  },
  tab: function (e) {
    console.log(e);
    let that = this;
    for (let i in this.data.productTabList) {
      that.setData({
        [`productTabList[${i}].select`]: false
      });
    }
    that.setData({
      [`productTabList[${e.currentTarget.dataset.index}].select`]: true
    });
    that.setData({
      serviceState: false,
      shopState: false,
      cardState: false,
      activityState: false
    })
    if (that.data.productTabList[e.currentTarget.dataset.index].tabTitle == '服务') {
      that.getServiceList('');
      that.getServerTypeList();
      that.setData({
        serviceState: true
      });
    }
    if (that.data.productTabList[e.currentTarget.dataset.index].tabTitle == '商品') {
      that.getShopList('');
      that.getShopTypeList();
      that.setData({
        shopState: true
      })
    }
    if (that.data.productTabList[e.currentTarget.dataset.index].tabTitle == '卡项') {
      that.getCardList();
      that.setData({
        cardState: true
      })
    }
    if (that.data.productTabList[e.currentTarget.dataset.index].tabTitle == '活动') {
      that.loadPeerActivity();
      that.setData({
        activityState: true
      })
    }
  },
  //请求服务类别
  getServerTypeList: function () {
    let that = this;
    app.request(app.host + 'goods/type/findPageList4App/' + app.appid, 'POST', 'form', {
      category: 2,
      shopId: wx.getStorageSync('businessId')
    }, function (res) {
      console.log(res.data);
      if (res.data.data) {
        let serviceCategory = [{
          id: '',
          cateName: '全部',
          select: true,
          catetype: 2
        }];
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.catetype = 2;
          item.cateName = i.name;
          item.select = false;
          serviceCategory.push(item);
        }
        that.setData({
          serviceCategory: serviceCategory,
        })
      }
    });
  },
  //请求商品类别
  getShopTypeList: function () {
    let that = this;
    app.request(app.host + 'goods/type/findPageList4App/' + app.appid, 'POST', 'form', {
      category: 1,
      shopId: wx.getStorageSync('businessId')
    }, function (res) {
      console.log(res.data);
      if (res.data.data) {
        let shopCategory = [{
          cateName: '全部',
          select: true,
          catetype: 1,
        }];
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.catetype = 1;
          item.cateName = i.name;
          shopCategory.push(item);
        }
        that.setData({
          shopCategory: shopCategory
        })
      }
    });
  },
  //条件查询预约服务和商品
  serachProduct: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.catetype == 1) {
      for (let i in this.data.shopCategory) {
        this.setData({
          [`shopCategory[${i}].select`]: false
        });
      }
      this.setData({
        [`shopCategory[${e.currentTarget.dataset.index}].select`]: true
      });
      this.getShopList(e.currentTarget.dataset.catename);
    }
    if (e.currentTarget.dataset.catetype == 2) {
      for (let i in this.data.serviceCategory) {
        this.setData({
          [`serviceCategory[${i}].select`]: false
        });
      }
      this.setData({
        [`serviceCategory[${e.currentTarget.dataset.index}].select`]: true
      });
      this.getServiceList(e.currentTarget.dataset.catename);
    }
  },
  //加载预约服务
  getServiceList: function (typeName) {
    let that = this;
    that.setData({
      loading: true
    })
    if (typeName == '全部') {
      typeName = '';
    }
    //请求服务列表
    app.request(app.host + 'goods/info/findPageList4App/' + app.appid, 'POST', 'form', {
      shopId: that.data.businessId,
      category: 5,
      typeName: typeName
    }, function (res) {
      console.log(res.data);
      let serviceList = [];
      if (res.data.code == 200 && res.data.data.list.length > 0) {
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.imgUrl = i.imgUrl;
          item.name = i.name;
          item.price = i.price;
          item.rackRate = i.minRackRate;
          item.soldNum = Number(i.soldNum) + Number(i.receiveCount);
          item.coinProportionNum = appUtil.accMul(i.price, i.coinProportion/100);
          serviceList.push(item);
        }
        that.setData({
          serviceList: serviceList,
          emptyPageState: false,
          loading: false
        })
      } else if (typeName == '') {
        that.setData({
          serviceList: serviceList,
          emptyPageState: true,
          emptyIcon: that.data.noServeIcon,
          emptyTip: '暂无服务~',
          loading: false
        })
      } else {
        that.setData({
          serviceList: serviceList,
          emptyPageState: false,
          loading: false
        })
      }
    });
  },
  //加载商品列表
  getShopList: function (typeName) {
    let that = this;
    that.setData({
      loading: true
    })
    if (typeName == '全部') {
      typeName = '';
    }
    app.request(app.host + 'goods/info/findPageList4App/' + app.appid, 'POST', 'form', {
      shopId: that.data.businessId,
      category: 1,
      typeName: typeName
    }, function (res) {
      console.log(res.data);
      let shopList = [];
      if (res.data.code == 200 && res.data.data.list.length > 0) {
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.imgUrl = i.imgUrl;
          item.name = i.name;
          item.price = i.price;
          item.soldNum = Number(i.soldNum) + Number(i.receiveCount);
          item.coinProportionNum = appUtil.accMul(i.price, appUtil.accDiv(i.coinProportion,100));
          shopList.push(item);
        }
        that.setData({
          shopList: shopList,
          emptyPageState: false,
          loading: false
        })
      }
      else if (typeName == '') {
        that.setData({
          emptyPageState: true,
          emptyIcon: that.data.noGoodsIcon,
          emptyTip: '暂时还没有商品呢~',
          loading: false
        })
      }
      else {
        that.setData({
          shopList: shopList,
          emptyPageState: false,
          loading: false
        })
      }
    });
  },
  //加载卡项列表
  getCardList: function () {
    let that = this;
    that.setData({
      loading: true
    })
    app.request(app.host + 'card/info/findPageList4App/' + app.appid, 'POST', 'form', {
      shopId: that.data.businessId,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200 && res.data.data.list.length > 0) {
        let cardList = [];
        for (let i of res.data.data.list) {
          if (i.status == 1) {//已上架
            let item = {};
            item.id = i.id;
            item.rechargeAmount = parseInt(i.rechargeAmount);
            item.giveAmount = parseInt(i.giveAmount);
            cardList.push(item);
          }
        }
        that.setData({
          emptyPageState: false,
          cardList: cardList,
          loading: false
        })
      } else {
        that.setData({
          emptyPageState: true,
          emptyIcon: that.data.noCardIcon,
          emptyTip: '您暂时没有卡项呢~',
          loading: false
        })
      }
    });
  },
  //加载同行活动
  loadPeerActivity: function () {
    let that = this;
    that.setData({
      loading: true
    })
    app.request(app.host + 'peer/findPage4App/' + app.appid + '/' + that.data.businessId, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200 && res.data.data.list.length > 0) {
        let activityList = [];
        for (let i of res.data.data.list) {
          let item = {};
          item.id = i.id;
          item.name = i.name;
          item.iconUrl = i.iconUrl;
          activityList.push(item);
        }
        that.setData({
          emptyPageState: false,
          activityList: activityList,
          loading: false
        })
      }
      else {
        that.setData({
          emptyPageState: true,
          emptyIcon: that.data.noActivityIcon,
          emptyTip: '暂时没有活动哦~',
          loading: false
        })
      }
    });
  },
  //卡项立刻充值
  payCard: function (e) {
    let cardId = e.currentTarget.id;
    this.setData({
      buyCardId: cardId
    })
    let that = this;
    //判断是否为会员
    app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
      appId: app.appid
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data) {
          wx.navigateTo({
            url: '/pages/public/buyCard/buyCard?cardId=' + cardId
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
                  url: '/pages/public/buyCard/buyCard?cardId=' + that.data.buyCardId
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
                  url: '/pages/public/buyCard/buyCard?cardId=' + that.data.buyCardId
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

  //通用导航
  nav: function (e) {
    app.nav(e.currentTarget.dataset.url);
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
    if (wx.getStorageSync('productTab')) {
      this.tab({ currentTarget: { dataset: { index: wx.getStorageSync('productTab') } } });
      wx.removeStorageSync('productTab');
    }
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
      assistedTxtColor2: app.globalObj.assistedTxtColor2,//辅助文字色2,
      getCodeBtnBgColor: app.globalObj.assistedColor1,//获取验证码按钮背景色
      noServeIcon: app.produtObj.noServeIcon,//无服务图标
      noGoodsIcon: app.produtObj.noGoodsIcon,//无商品图标
      noCardIcon: app.produtObj.noCardIcon,//无卡项图标
      noActivityIcon: app.produtObj.noActivityIcon,//无活动图标
      closeIcon: app.produtObj.closeIcon,//关闭按钮
    })
  }
}