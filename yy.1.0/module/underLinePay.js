const app = getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    inputs: '',
    placeholder:'请输入支付金额',
    paying:false
  },
  //线下微信支付
  wxPayment: function (revId, success, types, fail, complete) {
    var that = this;
    types = types ? types : 1;
    fail = fail || function (res) {
      console.log(res)
    };
    complete = complete || function (res) {
      console.log(res)
    };
    app.login(app.request, app.host + 'weiXin/unifiedUnderLineOrder/' + app.appid + '/' + app.openid + '/' + revId, 'POST', 'form', {
      category: types
    }, function (res) {
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': res.data.data.signType,
        'paySign': res.data.data.paySign,
        success: success,
        fail: fail,
        complete: complete
      })
    });
  },
  inputFocus:function(e){
    if(e.detail.value==''){
      this.setData({
        placeholder: ''
      })
    }
  },
  inputBlur:function(e){
    if (Number.isNaN(Number(e.detail.value))) {
      this.setData({
        inputs: ''
      })
    }else{
      if (e.detail.value==''){
        this.setData({
          inputs:''
        })
      }else{
        this.setData({
          inputs: parseFloat(e.detail.value)
        })
      }
    }
    if (this.data.inputs == '') {
      this.setData({
        placeholder: '请输入支付金额'
      })
    }
  },
  // 金额输入
  inputs: function (e) {
    var value;
    if (e.detail.value.indexOf('.')!=-1&&!Number.isNaN(Number(e.detail.value))){ //小数后两位
      value = e.detail.value.slice(0,e.detail.value.indexOf('.')+3);
    }else{
      value=e.detail.value
    }
    this.setData({
      inputs: value
    })
    
  },
  // 成为会员
  getPhoneNumber:function(e){
    var that=this;
    if(e.detail.iv){ //用户授权
      app.request(app.host +'member/info/becomeMember','POST','form',{
        openId:app.openid,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        appid:app.appid
      },function(res){
        that.pay();
      });
    }else{ //用户拒绝授权
      that.pay();
    }
  },
  throPay:function(){
    this.throttle(this.pay,this,500);
  },
  throttle:function(method,context,delay){
    clearTimeout(method.tId);
    method.tId=setTimeout(function(){
      method.call(context);
    },delay);
  },
  // 支付
  pay: function () {
    var that = this;
    if (that.data.inputs) {
      that.setData({
        paying: true
      }, function () {
        new Promise(function (resolve, reject) {
          app.request(app.host + "order/add4UnderLineOrder/" + app.appid + '/' + app.openid, 'POST', 'form', {
            consumerAmount: that.data.inputs,
            shopId: that.data.shopid
          }, function (res) {
            // resolve(res.data.data.summary.id);
            resolve(res.data.data.id)
          });
        }).then(function (id) {
          that.wxPayment(id, function (res) {
            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/public/underLinePaid/underLinePaid?shopname=' + that.data.shopname + '&id=' + id,
              })
            },300);
          }, 1, null, function () {
            // 支付遮罩
            that.setData({
              paying: false
            })
          });
        })
      });
    } else {
      wx.showToast({
        title: '金额输入有误',
        image: '/images/close@2x.png',
        mask: true
      })

    }

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
    //   shopId:111 //店铺id
    // }
    var that = this;
    app.request(app.host + 'shop/infoBo/find4App/' + options.shopId, 'POST', 'form', {}, function (res) {
      that.setData({
        shopname: res.data.data.name,
        shopid: options.shopId
      });
      wx.setStorageSync('businessId', res.data.data.id);
      wx.setStorageSync('businessName', res.data.data.name);
      wx.setStorageSync('businessAddress', res.data.data.detail);
      wx.setStorageSync('businessPhone', res.data.data.phone);
      wx.setStorageSync('businessIcon', res.data.data.icon);
      wx.setStorageSync('businessMap', res.data.data.map);
    });
    app.login(function () {
      app.request(app.host + 'member/info/findIsMember4App/' + app.openid, 'POST', 'form', {
        appId: app.appid
      }, function (res) {
        if (res.data.data) {
          that.setData({
            ismember: true,
            loading:false
          })
        } else {
          that.setData({
            ismember: false,
            loading: false
          })
        }
      });
    });
    this.setSkin();
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
  setSkin: function () {
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
      closeIcon: app.produtObj.closeIcon,//关闭按钮
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