const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    emptyPageState: false,
    emptyTip: '暂无优惠券~',
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let couponParam = JSON.parse(options.couponParam);
    //设置皮肤
    this.setStyleFun();
    //查询可用优惠券
    let that = this;
    app.request(app.host + 'member/coupon/canUseCoupon/' + app.appid + '/' + app.openid, 'POST', 'form', {
      price: couponParam.price,
      goodsIds: couponParam.goodsIds,
      paramIds: couponParam.paramIds,
      quantitys: couponParam.quantitys,
      shopId: couponParam.shopId,
    }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        if (res.data.data.list.length > 0) {
          let couponList = [];
          for (let i of res.data.data.list) {
            let item = {};
            item.id = i.id;
            item.couponId = i.id;
            item.couponAttr = i.couponAttr;
            item.couponType = i.couponType;
            if (i.couponType == 1) {
              item.couponStint = i.couponStint;
            }
            item.couponValue = Number(i.couponValue).toFixed(1);
            item.endDate = (i.endDate.replace(/-/g, '/')).replace(/T/g, ' ').substr(0, 19);
            couponList.push(item);
          }
          that.setData({
            couponList: couponList,
            emptyPageState: false,
            loading:false
          })
        } else {
          that.setData({
            emptyPageState: true,
            loading:false
          })
        }
      }
    })

  },
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
      couponGradientColor1: app.selCouponObj.couponGradientColor1,//优惠券背景渐变色1
      couponGradientColor2: app.selCouponObj.couponGradientColor2,//优惠券背景渐变色2
      couponGradientColor3: app.selCouponObj.couponGradientColor3,//优惠券背景渐变色3
      emptyIcon: app.selCouponObj.emptyIcon,
    })
  }
}