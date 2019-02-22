const app=getApp();
export default {

  /**
   * 页面的初始数据
   */
  data: {
    loading:true

  },
  nav:function(e){
    app.nav(e.currentTarget.dataset.url);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    this.setSkin();
    app.request(app.host + 'member/info/find4App/' + app.openid, 'POST', 'form', {
      appId: app.appid
    }, function (res) {
      that.setData({
        point: res.data.data.totalScore,
        loading:false
      })
    });
  },
  setSkin:function(){
    this.setData({
      themeTxtColor: app.globalObj.themeTxtColor,
      topicon:app.pointObj.topicon
    })
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