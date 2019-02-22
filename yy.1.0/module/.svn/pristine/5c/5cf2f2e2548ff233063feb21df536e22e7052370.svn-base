const app = getApp();
export default {
  /**
   * 页面的初始数据 
   */
  data: {
    userAddr: '',
    fillingOkBtnState: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置皮肤
    this.setStyleFun();
    //获取当前店铺位置
    this.getShopLocation();
    //获取预约范围半径
    this.getShopRadii();
  },
  //获取当前店铺位置
  getShopLocation: function () {
    let that = this;
    app.request(app.host + 'shop/infoBo/find4App/' + wx.getStorageSync('businessId'), 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.setData({
          latitudeNum: res.data.data.latitudeX,//纬度
          longitudeNum: res.data.data.longitudeX,//经度
        })
      }
    })
  },
  //获取预约范围半径
  getShopRadii: function () {
    let that = this;
    app.request(app.host + 'appointment/set/find4App/' + wx.getStorageSync('businessId'), 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        that.setData({
          rangeRadius: Number(res.data.data.rangeRadius)
        })
      }
    })
  },

  //选择收获地址
  selAddress: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.chooseLocation({
          success: function (res) {
            console.log(res);
            that.setData({
              'userAddr': res.address,
              'userlongitude': res.longitude.toFixed(6),
              'userlatitude': res.latitude.toFixed(6),
            });
          }
        })
      }
    })
  },
  //输入门牌号
  inputs: function (e) {
    console.log(e);
    if (this.data.userAddr != '' && e.detail.value != '') {
      this.setData({
        fillingOkBtnState: true,
        userAddrDec: e.detail.value,
      })
    } else {
      this.setData({
        fillingOkBtnState: false,
      })
    }
  },
  //确认
  confirm: function () {
    //判断是否在预约范围
    let userRangeRadius = this.GetDistance(this.data.latitudeNum, this.data.longitudeNum, this.data.userlatitude, this.data.userlongitude);
    console.log(userRangeRadius, this.data.rangeRadius);
    if (userRangeRadius < this.data.rangeRadius){
      let myAddress = this.data.userAddr + this.data.userAddrDec;
      console.log(myAddress)
      wx.setStorageSync('myAddress', myAddress);
      wx.setStorageSync('userlatitude', this.data.userlatitude);
      wx.setStorageSync('userlongitude', this.data.userlongitude);
      wx.navigateTo({
        url: '/pages/public/orderFilling/orderFilling'
      })
    }else{
      wx.showToast({
        title: '超出可预约范围',
        image: '/images/close@2x.png',
        duration: 2000
      })
    }
  },
  //进行经纬度转换为距离的计算
  Rad: function (d) {
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  },
  //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  GetDistance: function (lat1, lng1, lat2, lng2) {
    console.log(lat1, lng1, lat2, lng2);
    let radLat1 = this.Rad(lat1);
    let radLat2 = this.Rad(lat2);
    let a = radLat1 - radLat2;
    let b = this.Rad(lng1) - this.Rad(lng2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return s;
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
    })
  }
}