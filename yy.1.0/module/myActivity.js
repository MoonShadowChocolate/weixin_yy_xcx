const app = getApp();
export default {

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,

  },
  nav: function (e) {
    app.nav(e.currentTarget.dataset.url)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setSkin();
    app.request(app.host + 'peer/findSummaryPage4App/' + wx.getStorageSync('businessId') + '/' + app.openid, 'POST', 'form', {}, function (res) {
      console.log(res.data);
      let list = [];
      for (let i of res.data.data) {
        if(i.status==3){
          continue;
        }
        let item = {};
        item.id = i.id;
        item.img = i.iconUrl;
        item.title = i.goodsName;
        list.push(item);
      }
      that.setData({
        list: list,
        loading: false
      })
    });
  },
  setSkin: function () {
    this.setData({
      assistedTxtColor1: app.globalObj.assistedTxtColor1,
      themeTxtColor: app.globalObj.themeTxtColor
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