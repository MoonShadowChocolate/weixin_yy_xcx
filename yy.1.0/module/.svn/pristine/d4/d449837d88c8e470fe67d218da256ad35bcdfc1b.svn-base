const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {

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
  nav: function (e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options:{
    //   shopname:''//店铺名称
    //   id:''//收银记录id
    // }
    var that = this;
    app.request(app.host + 'finance/revenue/find/' + options.id, 'POST', 'form', {}, function (res) {
      let date = that.dateParse(res.data.data.revenueInfo.tradeDate).dates.slice(5) + ' ' + that.dateParse(res.data.data.revenueInfo.tradeDate).times.slice(0, 5);
      that.setData({
        shopname: options.shopname,
        date: date,
        price: res.data.data.revenueInfo.collectedAmount
      });

    });
    this.setSkin();
  },
  setSkin: function () {
    this.setData({
      themeTxtColor: app.globalObj.themeTxtColor,
      themeColor: app.globalObj.themeColor,
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