const app = getApp();
const appUtil = require("../utils/appUtil.js");
export default {
  /**
   * 页面的初始数据
   */
  data: {
    payMethod: 1,//微信支付
    payState: true,//支付状态
    loading: true,
    discountState:false,//是否开启优惠付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    if (options.payType) {
      //待付款订单支付
      if (options.payType == 'order') {
        this.searchOrderDetail(options.orderid);
        //查询支付方式
        this.searchPayStyle(options);
        this.setData({
          payType: options.payType,
          orderid: options.orderid
        })
      }
      //正常预约下单
      if (options.payType == 'product') {
        console.log('options.orderParam:', options.orderParam)
        let orderParam = JSON.parse(decodeURIComponent(options.orderParam));
        if (!orderParam.coinDeductionAmount){
          orderParam.coinDeductionAmount = 0;
        }
        //初始化数据
        this.setData({
          totalPrice: wx.getStorageSync('param').totalPrice,
          originalTotalPrice: wx.getStorageSync('param').totalPrice,
          orderParam: orderParam,
          loading: false,
          payType: options.payType
        })
        //查询支付方式
        this.searchPayStyle(options);
      }
      //商户币支付
      if(options.payType == 'coin'){
        //初始化数据
        this.setData({
          totalPrice: options.paymentAmount,
          originalTotalPrice: options.paymentAmount,
          coinNumber: options.coinNumber,
          loading: false,
          payType: options.payType,
          discountState:false,
          defaultType: '1',
          payMethod: '1',
        })
      }
    }
    //设置皮肤
    this.setStyleFun();
    //查询余额
    this.getMemberAmt();
  },
  //查询会员余额
  getMemberAmt: function () {
    let that = this;
    app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
      appId: app.appid,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (Number(that.data.originalTotalPrice) > Number(res.data.data.accountBalance)) {
          that.setData({
            notEnoughState: true,
            // payMethod: 1,
          })
        } else {
          that.setData({
            notEnoughState: false,
            // payMethod: 5,
          })
        }
        that.setData({
          accountBalance: res.data.data.accountBalance
        })
      }
    })
  },
  //查询支付方式
  searchPayStyle: function (op) {
    let that = this;
    app.request(app.host + 'app/config/findPayType4App', 'POST', 'form',
      {
        appId: app.appid
      },
      function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          let ext1 = res.data.data.ext1.split(',');
          console.log(ext1);
          for(let i in ext1){
            //优惠付
            if (that.data.orderParam){
              if (ext1[i] == "7" && (!that.data.orderParam.coinDeductionAmount || that.data.orderParam.coinDeductionAmount == 0)) {
                that.setData({
                  discountState: true,
                  calcRule: res.data.data.calcRule,
                })
              }
            }else{
              if (ext1[i] == "7" && !op.deductionCoinNumber || op.deductionCoinNumber == 0) {
                that.setData({
                  discountState: true,
                  calcRule: res.data.data.calcRule,
                })
              }
            }
          }
          // that.setData({
          //   defaultType: res.data.data.defaultType,
          //   payMethod: res.data.data.defaultType,
          // })
        }
      })
  },
  //待付款查询订单详情
  searchOrderDetail: function (orderid) {
    let that = this;
    app.request(app.host + 'appointment/find/' + orderid, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.setData({
          totalPrice: res.data.data.summary.price,
          originalTotalPrice: res.data.data.summary.price,
          loading: false
        })
      }
    })
  },
  //单选事件
  radioChange: function (e) {
    console.log(e);
    if (e.detail.value == 7){
      let totalPrice = appUtil.setOnePriceStyle(appUtil.accMul(this.data.totalPrice, appUtil.accDiv(this.data.calcRule, 10)));
      if (totalPrice == 0) {
        totalPrice = 0.01;
      }
      this.setData({
        totalPrice: totalPrice
      })
    }else{
      this.setData({
        totalPrice: this.data.originalTotalPrice
      })
    }
    this.setData({
      payMethod: e.detail.value
    })
  },
  //去支付
  toPay: function () {
    let that = this;
    if (that.data.payState) {
      //下单
      that.setData({
        payState: false
      })
      if (that.data.payType == 'product') {
        let isPeer = 0;
        if (wx.getStorageSync('orderType') == 'peer') {
          isPeer = 1;
        }
        let peerSummaryId = '';
        console.log(wx.getStorageSync('param').peerSummaryId);
        //判断同行活动概要Id
        if (wx.getStorageSync('param').peerSummaryId) {
          peerSummaryId = wx.getStorageSync('param').peerSummaryId;
        }
        //判断上门还是到店
        let shopAddrId = '', address = '';
        if (wx.getStorageSync('orderType') == 'toDoor') {
          address = that.data.orderParam.address;
        }
        if (wx.getStorageSync('orderType') != 'toDoor') {
          shopAddrId = that.data.orderParam.shopAddrId;
        }
        app.request(app.host + 'appointment/add4Goods/' + app.appid + '/' + app.openid, 'POST', 'form', {
          goodsId: wx.getStorageSync('param').id,
          paramId: wx.getStorageSync('param').paramId,
          quantity: wx.getStorageSync('param').quantity,
          couponId: that.data.orderParam.couponId,
          'type': that.data.orderParam.type,
          name: that.data.orderParam.name,
          phone: that.data.orderParam.phone,
          shopAddrId: shopAddrId,
          address: address,
          appointmentDate: that.data.orderParam.appointmentDate,
          description: that.data.orderParam.description,
          payType: that.data.orderParam.payType,
          payMethod: that.data.payMethod,
          isPeer: isPeer,
          peerSummaryId: peerSummaryId,
          coinDeductionAmount: that.data.orderParam.coinDeductionAmount,//币抵扣金额
        }, function (res) {
          console.log(res.data);
          if (res.data.code == 200) {
            let orderId = res.data.data.summary.id;
            if (that.data.payMethod == 1) {
              that.pay(orderId, 3);
            }
            if (that.data.payMethod == 5) {
              if (wx.getStorageSync('orderType') == 'peer') {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/public/personalCenter/personalCenter?state=payPeerSuccess&peerId=' + res.data.data.summary.peerSummaryId,
                  })
                }, 1500);
                wx.showToast({
                  title: '支付成功',
                  mask: true
                })
              } else {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/public/personalCenter/personalCenter?state=paySuccess&orderId=' + orderId,
                  })
                }, 1500);
                wx.showToast({
                  title: '支付成功',
                  mask: true
                })
              }
            }
            if (that.data.payMethod == 7) {
              wx.navigateTo({
                url: '/pages/public/offlinePay/offlinePay?totalPrice=' + that.data.totalPrice + '&orderId=' + orderId
              })
            }
          }
        })
      }
      else if (that.data.payType == 'order') {
        //微信支付
        if (that.data.payMethod == 1) {
          that.pay(that.data.orderid, 3);
        }
        //余额支付
        if (that.data.payMethod == 5) {
          that.userAmtPay(that.data.orderid);
        }
        //优惠付
        if (that.data.payMethod == 7) {
          wx.navigateTo({
            url: '/pages/public/offlinePay/offlinePay?totalPrice=' + that.data.totalPrice + '&orderId=' + orderId,
          })
        }
      } 
      else if (that.data.payType == 'coin') {
        app.request(app.host + 'order/rechargeCoin/' + app.appid + '/' + wx.getStorageSync('businessId') + '/' + app.openid, 'POST', 'form', 
        {
          coinNumber: that.data.coinNumber,
          paymentAmount: that.data.totalPrice,
          payType: that.data.payMethod
        },
          function (res) {
            console.log(res.data);
            if (res.data.code == 200) {
              //微信支付
              if (that.data.payMethod == 1) {
                that.pay(res.data.data.summary.id, 1);
              }
              //余额支付
              if (that.data.payMethod == 5) {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/public/personalCenter/personalCenter',
                  })
                }, 1500);
                wx.showToast({
                  title: '支付成功',
                  mask: true
                })
              }
            }
          })
      }
    }
  },
  //微信支付
  pay: function (orderId,payCate) {
    var that = this;
    console.log(orderId)
    app.login(wx.request, {
      url: app.host + 'weiXin/unifiedOrder/' + app.appid + '/' + orderId,
      data: {
        category: payCate
      },
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
            if (payCate == 3){
              if (wx.getStorageSync('orderType') == 'peer') {
                //查询
                app.request(app.host + 'appointment/find/' + orderId, 'POST', 'form', {}, function (res) {
                  console.log(res.data);
                  if (res.data.code == 200) {
                    that.setData({
                      peerSummaryId: res.data.data.summary.peerSummaryId
                    })
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '/pages/public/personalCenter/personalCenter?state=payPeerSuccess&peerId=' + that.data.peerSummaryId,
                      })
                    }, 1500);
                    wx.showToast({
                      title: '支付成功',
                      mask: true
                    })
                  }
                })
              } else {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/public/personalCenter/personalCenter?state=paySuccess&orderId=' + orderId,
                  })
                }, 1500);
                wx.showToast({
                  title: '支付成功',
                  mask: true
                })
              }
            }else if(payCate == 1){
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/public/personalCenter/personalCenter',
                })
              }, 1500);
              wx.showToast({
                title: '支付成功',
                mask: true
              })
            }
            
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
  },
  //余额支付
  userAmtPay: function (orderId) {
    app.request(app.host + 'appointment/unifiedAppoOrder/' + app.appid + '/' + orderId, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.data) {
        setTimeout(function () {
          wx.reLaunch({
            url: '/pages/public/personalCenter/personalCenter?state=paySuccess&orderId=' + orderId,
          })
        }, 1500);
        wx.showToast({
          title: '支付成功',
          mask: true
        })
      } else {
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
      }
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
      weixinIcon: app.payObj.weixinIcon,//微信图标
      balanceIcon: app.payObj.balanceIcon,//余额图标
    })
  }
}