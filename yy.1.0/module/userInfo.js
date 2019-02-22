const app=getApp();
export default {

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    sexRange: ["男", "女"],
    name:'',
    phone:''
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
  // 生日
  dateChange:function(e){
    this.setData({
      date:e.detail.value
    });
    this.test();
  },
  // 性别
  sexChange: function (e) {
    this.setData({
      sex: e.detail.value
    });
    this.test();
  },
  // 姓名
  nameBlur:function(e){
    this.setData({
      name:e.detail.value
    });
    this.test();
  },
  // 保存
  save:function(){
    var that=this;
    if(that.test()){
      app.request(app.host +'member/info/updateInfo','POST','form',{
        appId:app.appid,
        openId:app.openid,
        name:that.data.name,
        gender: that.data.sex ==0?'1':that.data.sex ==1?'2':'0',
        birthday:that.data.date
      },function(res){
        wx.reLaunch({
          url: '/pages/public/personalCenter/personalCenter',
        })
      })
    }else{
      if (that.data.name.trim().length == 0) {
        wx.showToast({
          title: '姓名输入有误',
          icon: 'none'
        });
        return;
      }
      if (!that.data.date) {
        wx.showToast({
          title: '请选择您的生日',
          icon: 'none'
        });
        return;
      }
      if (!that.data.sex) {
        wx.showToast({
          title: '请选择您的性别',
          icon: 'none'
        })
        return;
      }
    }
    
  },
  // 验证
  test:function(){
    var that=this;
    if (that.data.name.trim().length != 0 && that.data.date && that.data.sex){
      that.setData({
        ready:true
      })
      return true;
    }else{
      that.setData({
        ready: false
      })
      return false;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setSkin();
    app.request(app.host +'member/info/find4App/'+app.openid,'POST','form',{
      appId:app.appid
    },function(res){
      console.log(res.data);
      let sex=null;
      if(res.data.data.gender==1){
        sex='0';
      }else if(res.data.data.gender==2){
        sex = '1';
      }else if(res.data.data.gender==0){
        
      }
      that.setData({
        sex:sex,
        date: res.data.data.birthday?that.dateParse(res.data.data.birthday).dates:'',
        name:res.data.data.name||'',
        phone:res.data.data.phone||'',
        loading:false
      });
      that.test();
    });
  },
  setSkin:function(){
    this.setData({
      themeTxtColor: app.globalObj.themeTxtColor,
      assistedTxtColor2: app.globalObj.assistedTxtColor2,
      themeColor: app.globalObj.themeColor
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