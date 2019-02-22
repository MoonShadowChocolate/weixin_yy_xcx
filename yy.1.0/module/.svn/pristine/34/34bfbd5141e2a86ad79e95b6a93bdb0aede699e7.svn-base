const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    activityRuleState: false,
    loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置皮肤
    this.setStyleFun();
    console.log(options);
    //查看同行活动商品列表
    this.getPeerList(options.id)
  },
  //查看同行活动商品列表
  getPeerList: function (id) {
    let that = this;
    app.request(app.host + 'peer/find4App/' + id, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        //设置倒计时
        let endDate = new Date((res.data.data.info.endDate.replace(/-/g, '/')).replace(/T/g, ' ').substr(0, 19));
        let nowTime = new Date();
        let times = endDate.getTime() / 1000 - nowTime.getTime() / 1000;
        console.log(times);
        that.countDown(times);
        //获取商品列表
        let peerGoodList = [];
        for (let i of res.data.data.goodsList) {
          let item = {};
          item.id = i.goodsId;
          item.name = i.goodsName;
          item.img = i.iconUrl;
          item.price = i.price;//原价
          item.discountPrice = i.discountPrice;//折扣价
          peerGoodList.push(item);
        }
        that.setData({
          peerName: res.data.data.info.name,
          peerGoodList: peerGoodList,
          loading:false,
          startDate: res.data.data.info.startDate.substr(0, 10).replace(/-/g, '.'),
          endDate: res.data.data.info.endDate.substr(0, 10).replace(/-/g, '.'),
        })
      }
    })
  },
  //弹出活动规则弹窗
  openActivityRule: function () {
    this.setData({
      activityRuleState: true
    })
  },
  //关闭活动规则弹窗
  closeActivityRule: function () {
    this.setData({
      activityRuleState: false
    })
  },
  //倒计时
  countDown: function (times) {
    var timer = null;
    var that = this;
    timer = setInterval(function () {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60) - (day * 24));
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (day <= 9) day = '0' + day;
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      // console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
      that.setData({
        d: day,
        h: hour,
        m: minute,
        s: second,
      })
      times--;
    }, 1000);
    if (times <= 0) {
      clearInterval(timer);
    }
  },
  //通用导航
  nav: function (e) {
    app.nav(e.currentTarget.dataset.url);
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
      ruleBgColor: app.peerDiscountObj.ruleBgColor,//活动规则按钮背景颜色
      ruleTitleColor: app.peerDiscountObj.ruleTitleColor,//活动规则标题颜色
      closeIcon: app.peerDiscountObj.closeIcon,//活动规则关闭按钮
    })
  }
}