// pages/public/offlinePay/offlinePay.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      totalPrice: options.totalPrice,
      orderId: options.orderId,
    })
    //查询优惠付详情
    this.searchPayStyle();
  },
  //查询优惠付详情
  searchPayStyle: function () {
    let that = this;
    app.request(app.host + 'app/config/findPayType4App', 'POST', 'form',
      {
        appId: app.appid
      },
      function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          that.setData({
            qrCodeImg: res.data.data.imgUrl,
            payTypeName:res.data.data.name,
          })
        }
      })
  },
  //完成支付点击事件
  completePay:function(){
    let that = this;
    app.request(app.host + 'order/achieve4DiscountPay/' + app.appid + '/' + app.openid, 'POST', 'form', 
      {
        orderId: that.data.orderId
      },
      function (res) {
        console.log(res.data);
        if (res.data.data) {
          if (wx.getStorageSync('orderType') == 'peer') {
            //查询
            app.request(app.host + 'appointment/find/' + that.data.orderId, 'POST', 'form', {}, function (res) {
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
                url: '/pages/public/personalCenter/personalCenter?state=paySuccess&orderId=' + that.data.orderId,
              })
            }, 1500);
            wx.showToast({
              title: '支付成功',
              mask: true
            })
          }
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

  }
})