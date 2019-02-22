const app = getApp();
const WxParse = require('../wxParse/wxParse.js');
const appUtil = require("../utils/appUtil.js");
export default {
  /**
   * 页面的初始数据
   */
  data: {
    selectProTypeState: false,
    buyProPrice: '',//购买产品价格
    buyNum: 1,//购买数量
    productBuyType: '',//产品购买类型
    loading:true,
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
    //获取店铺电话
    //获取店铺电话
    this.setData({
      phone: wx.getStorageSync('businessPhone'),
    })
    //服务
    if (options.type == 'sever') {
      this.setData({
        detailsType: 'sever',
        productId: options.id
      })
      this.getProductDetail(options.id);
      wx.setNavigationBarTitle({
        title: '服务详情'
      });
    }
    //商品
    if (options.type == 'shop') {
      this.setData({
        detailsType: 'shop',
        productId: options.id
      })
      this.getProductDetail(options.id);
      wx.setNavigationBarTitle({
        title: '商品详情'
      });
    }
    //活动
    if (options.type == 'activity') {
      this.setData({
        detailsType: 'activity',
        productId: options.id
      })
      this.getPeerDetail(options.id);
      wx.setNavigationBarTitle({
        title: '服务详情'
      });
    }
    this.getShopInfo();
    //预约设置
    this.setData({
      serviceToHome: wx.getStorageSync('appointSet').serviceToHome || '预约上门',//预约上门
      serviceToShop: wx.getStorageSync('appointSet').serviceToShop || '预约到店',//预约到店
      rackRate: wx.getStorageSync('appointSet').rackRate || '门市价',//门市价
      serviceTimeTxt: wx.getStorageSync('appointSet').serviceTime || '服务时长',//服务时长
    })
  },
  //查询产品详情
  getProductDetail: function (id) {
    let that = this;
    app.request(app.host + 'goods/info/find/' + id, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        //解析富文本
        let articleDesc = res.data.data.articleList[0].desciption;
        console.log(articleDesc);
        WxParse.wxParse('articleDesc', 'html', articleDesc, that);
        //取得商品规格
        let specList = [];
        for (let i in res.data.data.paramSpecDetailList) {
          let item = {};
          item.id = res.data.data.paramSpecDetailList[i].id;
          item.specName = res.data.data.paramSpecDetailList[i].specValueOne;
          item.specPrice = res.data.data.paramSpecDetailList[i].price;
          item.select = false;
          if (i == 0) {
            item.select = true;
            that.setData({
              buyProPrice: res.data.data.paramSpecDetailList[0].price,
              selProPrice: res.data.data.paramSpecDetailList[0].price,
              paramId: res.data.data.paramSpecDetailList[0].id,
              paramName: res.data.data.paramSpecDetailList[0].specValueOne,
            })
          }
          specList.push(item);
        }
        //判断规格长度
        if (res.data.data.paramSpecDetailList.length > 1) {
          that.setData({
            paramState: true
          })
        } else {
          that.setData({
            paramState: false
          })
        }
        //判断是否设置了币抵扣
        if (res.data.data.info.coinProportion){
          that.setData({
            coinState: true,
            coinProportion: res.data.data.info.coinProportion,//币抵扣占比
          })
        }else{
          that.setData({
            coinState: false
          })
        }
        that.setData({
          detailsName: res.data.data.info.name,
          detailsBanner: res.data.data.picList[0].imgUrl,
          detailsPrice: res.data.data.info.price,
          minRackRate: res.data.data.info.minRackRate,
          soldNum: Number(res.data.data.info.soldNum) + Number(res.data.data.info.receiveCount),
          serviceTime: res.data.data.info.serviceTime,
          buyNotes: res.data.data.info.buyNotes || '无',
          specTypeName: res.data.data.paramSpecList[0].specName,
          specList: specList,
          bookingMethod: res.data.data.info.bookingMethod,//适用预约方式(1-仅预约到店 2-仅预约上门 3-预约上门和预约到店)
          paymentMethod: res.data.data.info.paymentMethod,//支付方式(1-仅在线支付2-仅到店支付 3-在线支付和到店支付)
          isSevenDaysRefund: res.data.data.info.isSevenDaysRefund,//是否支持7日内随时退款(1-是,0-否)
          loading:false
        })
      }
    })
  },
  //查询同行活动详情
  getPeerDetail: function (id) {
    let that = this;
    app.request(app.host + 'peer/findPeerGoods/' + id, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        //解析富文本
        let articleDesc = res.data.data.articleList[0].desciption;
        console.log(articleDesc);
        WxParse.wxParse('articleDesc', 'html', articleDesc, that);
        //获取同行优惠
        let peerDiscountList = [
          {
            title: '单人购买',
            price: res.data.data.paramSpecDetailList[0].price,
            joinState: true,
          }
        ];
        // let discountList = res.data.data.discountList;
        // for (let i = discountList.length - 1; i >= 0; i--) {
        //   let item = {};
        //   item.title = discountList[i].joinNum + '人同行';
        //   item.price = that.getPeerPrice(res.data.data.paramSpecDetailList[0].price, discountList[i].discountType, discountList[i].discount);
        //   item.joinState = false;
        //   peerDiscountList.push(item);
        // }
        for (let i of res.data.data.discountList) {
          let item = {};
          item.title = i.joinNum + '人同行';
          item.price = that.getPeerPrice(res.data.data.paramSpecDetailList[0].price, i.discountType, i.discount);
          item.joinState = false;
          peerDiscountList.push(item);
        }
        that.setData({
          detailsName: res.data.data.info.name,
          detailsBanner: res.data.data.picList[0].imgUrl,
          detailsPrice: res.data.data.info.price,
          minRackRate: res.data.data.info.minRackRate,
          soldNum: Number(res.data.data.info.soldNum) + Number(res.data.data.info.receiveCount),
          serviceTime: res.data.data.info.serviceTime,
          buyNotes: res.data.data.info.buyNotes || '无',
          peerBarWidth: 0,
          peerDiscountList: peerDiscountList,
          deposit: res.data.data.info.deposit,//定金
          minRackRate: res.data.data.info.minRackRate,//门市价
          paramId: res.data.data.paramSpecDetailList[0].id,
          paramName: res.data.data.paramSpecDetailList[0].specValueOne,
          paymentMethod: res.data.data.info.paymentMethod,//支付方式(1-仅在线支付2-仅到店支付 3-在线支付和到店支付)
          loading: false
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
  //查询店铺信息
  getShopInfo: function () {
    let that = this;
    app.request(app.host + 'shop/infoBo/find4App/' + wx.getStorageSync('businessId'), 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        let dayOfWeek = res.data.data.dayOfWeek.split(',');
        let openWeeks = [];
        for (let i in dayOfWeek) {
          console.log(i);
          if (i == 1) {
            openWeeks.push('周一');
          }
          if (i == 2) {
            openWeeks.push('周二');
          }
          if (i == 3) {
            openWeeks.push('周三');
          }
          if (i == 4) {
            openWeeks.push('周四');
          }
          if (i == 5) {
            openWeeks.push('周五');
          }
          if (i == 6) {
            openWeeks.push('周六');
          }
          if (i == 0) {
            openWeeks.push('周日');
          }
        }
        that.setData({
          shopName: res.data.data.name,
          openWeeks: openWeeks,
          shopTimeStart: res.data.data.timeStart,
          shopTimeEnd: res.data.data.timeEnd,
          shopAddress: res.data.data.address,
          longitude: res.data.data.longitudeX,//经度
          latitude: res.data.data.latitudeX,//纬度
        })
      }
    })
  },
  //跳转地图
  map:function(){
    let that = this;
    if (that.data.longitude && that.data.latitude){
      wx.getLocation({
        success(res) {
          wx.openLocation({
            latitude: Number(that.data.latitude),
            longitude: Number(that.data.longitude),
          })
        }
      })
    }
  },
  //去购买
  toBuy: function (e) {
    console.log(e);
    let that = this;
    //判断是否为会员
    app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
      appId: app.appid
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data) {
          if (that.data.detailsType == 'sever') {
            if (e.currentTarget.id == 0) {
              that.setData({
                productBuyType: 'toDoor',
              })
              if (that.data.paramState){
                that.setData({
                  selectProTypeState: true,
                })
              }else{
                that.toOrderFilling();
              }
            }
            if (e.currentTarget.id == 1) {
              that.setData({
                productBuyType: 'toShop',
              })
              if (that.data.paramState) {
                that.setData({
                  selectProTypeState: true,
                })
              }else{
                that.toOrderFilling();
              }
            }
          }
          if (that.data.detailsType == 'activity') {
            if (e.currentTarget.id == 0) {
              that.setData({
                productBuyType: 'ordinary'
              })
            }
            if (e.currentTarget.id == 1) {
              that.setData({
                productBuyType: 'peer'
              })
            }
            let param = {};
            param.id = that.data.productId;//产品Id
            param.name = that.data.detailsName;//产品名称
            param.img = that.data.detailsBanner;//产品图片
            param.paramId = that.data.paramId;//产品规格详情Id
            param.paramName = that.data.paramName;//产品规格名称
            param.totalPrice = that.data.deposit;//定金
            param.originalTotalPrice = that.data.deposit;//定金
            param.quantity = 1;//购买数量
            param.minRackRate = appUtil.setOnePriceStyle(appUtil.accMul(that.data.buyNum, Number(that.data.minRackRate)));//门市价
            param.paymentMethod = that.data.paymentMethod;//支付方式
            param.serviceTime = that.data.serviceTime;//服务时长
            param.coinProportion = that.data.coinProportion;//币抵扣占比
            console.log('param',param)
            wx.setStorageSync('param', param);//订单相关参数
            wx.setStorageSync('orderType', that.data.productBuyType);//预约订单类型
            wx.navigateTo({
              url: '/pages/public/orderFilling/orderFilling'
            })
          }
          if (that.data.detailsType == 'shop') {
            that.setData({
              productBuyType: 'shop',
              selectProTypeState: true,
            })
          }
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
              //激活会员成功执行
              that.setData({
                selectProTypeState: true
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.message,
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } 
                }
              })
              // wx.showToast({
              //   title: res.data.message,
              //   image: '/images/close@2x.png',
              //   duration: 2000
              // })
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
              that.setData({
                selectProTypeState: true
              })
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
  //选择产品类别
  selSpecType: function (e) {
    console.log(e);
    let specList = this.data.specList;
    for (let i in this.data.specList) {
      this.setData({
        [`specList[${i}].select`]: false,
      });
    }
    this.setData({
      [`specList[${e.currentTarget.dataset.index}].select`]: true,
      selProPrice: this.data.specList[e.currentTarget.dataset.index].specPrice,
      buyProPrice: appUtil.setOnePriceStyle(appUtil.accMul(this.data.buyNum, this.data.specList[e.currentTarget.dataset.index].specPrice)),
      paramId: e.currentTarget.id,
      paramName: e.currentTarget.dataset.name,
    });
  },
  //加减购买数量
  changeNum: function (e) {
    console.log(e);
    let buyNum = Number(this.data.buyNum);
    let buyProPrice = Number(this.data.buyProPrice);
    let selProPrice = Number(this.data.selProPrice);
    if (e.currentTarget.dataset.cate == 'add') {
      buyNum++;
      buyProPrice = appUtil.accMul(buyNum, selProPrice);
    }
    if (e.currentTarget.dataset.cate == 'minus') {
      if (buyNum > 1) {
        buyNum--;
      }
      buyProPrice = appUtil.accMul(buyNum, selProPrice);
    }
    this.setData({
      buyNum: buyNum,
      buyProPrice: appUtil.setOnePriceStyle(buyProPrice),
    })
  },
  //下一步,去填写订单
  toOrderFilling: function () {
    let param = {};
    param.id = this.data.productId;//产品Id
    param.name = this.data.detailsName;//产品名称
    param.img = this.data.detailsBanner;//产品图片
    param.paramId = this.data.paramId;//产品规格详情Id
    param.paramName = this.data.paramName;//产品规格名称
    param.totalPrice = this.data.buyProPrice;//购买产品总价
    param.originalTotalPrice = this.data.buyProPrice;//购买产品总价
    param.quantity = this.data.buyNum;//购买数量
    param.minRackRate = appUtil.setOnePriceStyle(appUtil.accMul(this.data.buyNum, Number(this.data.minRackRate)));//门市价
    param.paymentMethod = this.data.paymentMethod;//支付方式
    param.serviceTime = this.data.serviceTime;//服务时长
    param.coinProportion = this.data.coinProportion;//币抵扣占比
    wx.setStorageSync('param', param);//订单相关参数
    wx.setStorageSync('orderType', this.data.productBuyType);//预约订单类型
    wx.navigateTo({
      url: '/pages/public/orderFilling/orderFilling'
    })
  },
  //显示选择类型弹窗
  openSelectProType: function () {
    this.setData({
      selectProTypeState: true,
    })
  },
  //关闭选择类型弹窗
  closeSelectProType: function () {
    this.setData({
      selectProTypeState: false,
    })
  },
  //给商家打call
  phoneCall: function (e) {
    app.phoneCall(e.currentTarget.dataset.phone);
  },
  //弹出遮罩层后禁止页面上下滑动
  maskCatchEvent: function () {

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
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '像您推荐' + that.data.detailsName,
      path: '/pages/index/index?state=product&productId=' + that.data.productId + '&type=' + that.data.detailsType,
      imageUrl: that.data.detailsBanner,
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
      getCodeBtnBgColor: app.globalObj.assistedColor1,//获取验证码按钮背景色
      shareIcon: app.produtObj.shareIcon,//分享图标
      markIcon: app.produtObj.markIcon,//选项标记图标
      positionIcon: app.produtObj.positionIcon,//地图定位图标
      callIcon: app.produtObj.callIcon,//打电话图标
      barSpotAutoColor: app.produtObj.barSpotAutoColor,//优惠同行进度条默认颜色
      barBorderMarkColor: app.produtObj.barBorderMarkColor,//优惠同行进度条标记边框颜色
      barBorderAutoColor: app.produtObj.barBorderAutoColor,//优惠同行进度条默认边框颜色
      closeIcon: app.produtObj.closeIcon,//关闭按钮
    })
  }
}