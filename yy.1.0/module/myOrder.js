const app = getApp();
export default {

  /**
   * 页面的初始数据 
   */
  data: {
    loading: true,
    appointtab: [{
      txt: '全部'
    }, {
      txt: '待付款'
    }, {
      txt: '待服务'
    }, {
      txt: '待提货'
    }, {
      txt: '已取消'
    }],
    ordertab: [{
      txt: '全部',
    }, {
      txt: '待付款',
    }, {
      txt: '已完成',
    }, {
      txt: '已取消',
    }],
    tabselect: 0
  },
  // 取消预约单
  cancelAppoint: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消？',
      success: function (res) {
        if (res.confirm) {
          app.request(app.host + 'appointment/cancel/' + app.appid + '/' + app.openid, 'POST', 'form', {
            shopId: wx.getStorageSync('businessId'),
            appointmentId: e.currentTarget.dataset.orderid
          }, function (re) {
            if (re.data.data) {
              console.log('取消预约单成功');
            } else {
              console.log('取消预约单失败');
            }
            that.query(that.data.appointtab[that.data.tabselect].txt);
          });
        }
      }
    })
  },
  //删除预约单
  deletes: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          app.request(app.host + 'appointment/del/' + e.currentTarget.dataset.orderid, 'POST', 'form', {}, function (re) {
            if (re.data.data) {
              console.log('删除预约单成功');
            } else {
              console.log('删除预约单失败');
            }
            that.query(that.data.appointtab[that.data.tabselect].txt);
          });
        }
      }
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
  // 切换tab
  tabSelect: function (e) {
    var that = this;
    that.setData({
      tabselect: e.currentTarget.dataset.index
    });
    that.query(e.currentTarget.dataset.txt);
  },
  // 取消订单
  cancel: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单？',
      success: function (re) {
        if (re.confirm) {
          app.request(app.host + 'order/rejected/cancelOrder4App/' + app.appid + '/' + app.openid, 'POST', 'form', {
            orderId: e.currentTarget.dataset.orderid,
            type: 1
          }, function (res) {
            that.query('待付款');
          })
        }
      }
    })
  },
  // 去支付
  toPay: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.ordertype == 6) {
      this.pay(e.currentTarget.dataset.orderid);
    }else{
      wx.navigateTo({
        url: '/pages/public/pay/pay?payType=order&orderid=' + e.currentTarget.dataset.orderid + '&deductionCoinNumber=' + e.currentTarget.dataset.deductioncoinnumber
      })
    }
  },
  //支付
  pay: function (orderId) {
    var that = this;
    console.log(orderId)
    app.login(wx.request, {
      url: app.host + 'weiXin/unifiedOrder/' + app.appid + '/' + orderId,
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
  },
  // 通用查询
  query: function (txt) {
    var that = this;
    var status;
    if (that.data.types == 'order') {//订单
      switch (txt) {
        case '待付款':
          status = 1;
          break;
        case '已完成':
          status = 3;
          break;
        case '已取消':
          status = 4;
          break;
        default:
          status = '';
      }
      app.request(app.host + 'order/findPageList4App/' + app.appid + '/' + app.openid, 'POST', 'form', {
        status: status,
        shopId: wx.getStorageSync('businessId')
      }, function (res) {
        console.log(res.data, status)
        let list = [];
        for (let i of res.data.data.list) {
          if (!i.detailList[0]){
            continue;
          }
          // if(i.summary.orderType==9){ //线下订单
          //   continue;
          // }
          let item = {};
          item.orderid = i.summary.id;
          item.ordernumber = i.summary.code;
          // item.nofeeprice = i.detailList[0].price;
          item.sumprice = i.summary.price;
          item.name = i.detailList[0].goodsName;
          item.num = i.detailList[0].quantity;
          item.ordertype = i.summary.orderType;
          if (i.summary.orderType == 6) { //卡项无规格
            item.img = '/images/myOrder/card_thumbnail@2x.png';
            item.isCard=true;
          } else {
            item.spec = [];
            if (i.detailList[0].paramSpecDetail.specValueOne) {
              item.spec.push(i.detailList[0].paramSpecDetail.specValueOne);
            }
            if (i.detailList[0].paramSpecDetail.specValueTwo) {
              item.spec.push(i.detailList[0].paramSpecDetail.specValueTwo);
            }
            if (i.detailList[0].paramSpecDetail.specValueThree) {
              item.spec.push(i.detailList[0].paramSpecDetail.specValueThree);
            }
            item.img = i.detailList[0].imgUrl;
          }

          switch (parseInt(i.summary.status)) {
            case 1:
              item.status = '待付款';
              break;
            case 3:
              item.status = '已完成';
              break;
            case 4:
              item.status = '已取消';
              break;
            default:
              item.status = '已完成';
          }
          list.push(item);
        }
        that.setData({
          list: list,
          loading: false
        })
      });
    } else if (that.data.types == 'appoint') {//预约
      switch (txt) {
        case '待付款':
          status = 1;
          break;
        case '待服务':
          status = '2,3';
          break;
        case '待提货':
          status = 4;
          break;
        case '已取消':
          status = 5;
          break;
        default:
          status = '';
      }
      app.request(app.host + 'appointment/findPageList4App/' + app.appid + '/' + app.openid, 'POST', 'form', {
        status: status,
        shopId: wx.getStorageSync('businessId')
      }, function (res) {
        console.log(res.data, status);
        let list = [];
        for (let i of res.data.data.list) {
          if (!i.detailList[0]) {
            continue;
          }
          let item = {};
          item.orderid = i.summary.id;
          item.sumprice = i.summary.price;
          item.deductionCoinNumber = i.summary.deductionCoinNumber;
          item.name = i.detailList[0].goodsName;
          item.num = i.detailList[0].quantity;
          if (i.summary.appointmentType == 3) {
            item.cancelable = false;
          } else {
            if (i.summary.isCanceled == 1) {
              item.cancelable = true;
            } else if (i.summary.isCanceled == 0) {
              item.cancelable = false;
            }
          }

          item.spec = [];
          if (i.detailList[0].paramSpecDetail.specValueOne) {
            item.spec.push(i.detailList[0].paramSpecDetail.specValueOne);
          }
          if (i.detailList[0].paramSpecDetail.specValueTwo) {
            item.spec.push(i.detailList[0].paramSpecDetail.specValueTwo);
          }
          if (i.detailList[0].paramSpecDetail.specValueThree) {
            item.spec.push(i.detailList[0].paramSpecDetail.specValueThree);
          }
          item.img = i.detailList[0].imgUrl;

          if (i.summary.status == 2 || i.summary.status == 3 || i.summary.status == 4) {
            if (i.summary.overTime) {
              let hour = Math.floor(i.summary.overTime / (1000 * 60 * 60));
              let minute = Math.floor(i.summary.overTime / (1000 * 60)) - (hour * 60);
              item.date = '已超时' + hour + '小时' + minute + '分钟';
              item.overtime = true;
            } else {
              let types;
              if (i.recInfo.type == 1) {//到店
                types = wx.getStorageSync('appointSet') ? wx.getStorageSync('appointSet').serviceToShop : '预约到店';
              } else if (i.recInfo.type == 2) {//上门
                types = wx.getStorageSync('appointSet') ? wx.getStorageSync('appointSet').serviceToHome : '预约上门';
              }
              item.date = types + '时间：' + that.dateParse(i.summary.appointmentDate).dates.slice(5) + ' ' + that.dateParse(i.summary.appointmentDate).times.slice(0, 5);
              item.overtime = false;
            }
          }
          let paystatus;
          switch (parseInt(i.summary.payStatus)) {
            case 2:
              paystatus = '已支付';
              break;
            case 3:
              paystatus = '到店付';
              break;
            case 4:
              paystatus = '已付定金';
              break;
            default:
              paystatus = '';
          }
          switch (parseInt(i.summary.status)) {
            case 1:
              item.status = '待付款';
              item.date = Math.floor(i.summary.overAutoTime / 1000 / 60) + '分钟后自动取消';
              break;
            case 2:
              item.status = paystatus;
              break;
            case 3:
              item.status = paystatus;
              break;
            case 4:
              item.status = paystatus;
              break;
            case 5:
              item.status = '已取消';
              item.date = '';
              break;
            default:
              item.status = '';
              item.date = '';
          }
          list.push(item);
        }
        that.setData({
          list: list,
          loading: false
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options:{
    //   txt:'',
    //   types:order //order、appoint
    // }
    var that = this;
    this.setSkin();
    that.setData({
      types: options.types,
      phone: wx.getStorageSync('businessPhone')
    });
    if(options.types=='order'){
      wx.setNavigationBarTitle({
        title: '我的订单',
      })
    }else if(options.types=='appoint'){
      wx.setNavigationBarTitle({
        title: '我的预约',
      })
    }
    if (options.txt) {
      that.setData({
        tabselect: that.data.appointtab.findIndex(function (value, index, arr) { return value.txt == options.txt })
      })
    }
    that.query(options.txt);
  },
  setSkin: function () {
    this.setData({
      importantColor: app.globalObj.importantColor,
      themeTxtColor: app.globalObj.themeTxtColor,
      assistedTxtColor2: app.globalObj.assistedTxtColor2,
      assistedColor1: app.globalObj.assistedColor1,
      assistedColor2: app.globalObj.assistedColor2,
      themeColor: app.globalObj.themeColor,
      nolisticon: app.myOrderObj.nolisticon
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

  }
}