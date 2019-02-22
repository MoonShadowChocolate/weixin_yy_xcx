// var QQMapWX = require('../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
const app=getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    
  },
  // 切换店铺
  select:function(e){
    var that=this;
    for(let i of that.data.list){
      if(i.id==e.currentTarget.dataset.id){
        wx.setStorageSync('businessId', i.id);
        wx.setStorageSync('businessName', i.name);
        wx.setStorageSync('businessAddress', i.detail);
        wx.setStorageSync('businessPhone', i.phone);
        wx.setStorageSync('businessIcon', i.icon);
        wx.setStorageSync('businessMap', i.map);
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    }
    
  },
  // 根据两点的经纬度算距离
  getDistance: function (lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
  },
  phoneCall:function(e){
    app.phoneCall(e.currentTarget.dataset.phone);
  },
  // 打开手机位置权限设置
  openSetting:function(e){
    var that=this;
    if (e.detail.authSetting['scope.userLocation'] == true) {
      wx.openLocation({
        latitude: parseFloat(e.currentTarget.dataset.map.latitude),
        longitude: parseFloat(e.currentTarget.dataset.map.longitude)
      })
    } else {

    }
      
  },
  // 打开地图
  map:function(e) {
    var that=this;
    wx.getLocation({
      success: function(res) {
        wx.openLocation({ //latitude、longitude只能为number，不能为string
          latitude: parseFloat(e.currentTarget.dataset.map.latitude),
          longitude: parseFloat(e.currentTarget.dataset.map.longitude)
        })
      },
    })
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
    this.setSkin();
    this.loadInfo();
  },
  // 数据加载
  loadInfo:function(){
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: 'ECZBZ-ZMA66-OHMSP-MJTVY-G2JKE-LJFT6'
    // });
    var that = this;
    var latitude,longitude;
    wx.getLocation({
      success: function(res) {
        latitude=res.latitude;
        longitude=res.longitude;
        info(true);
        // qqmapsdk.reverseGeocoder({
        //   location: {
        //     latitude:res.latitude,
        //     longitude:res.longitude
        //   },
        //   success:function(re){
        //     that.setData({
        //       userAddress: re.result.address
        //     })
        //   }
        // });
        that.setData({
          getLocation: true
        })
      },
      fail: function () {
        info();
        that.setData({
          getLocation: false
        })
      }
    })
    function info(success){
      new Promise(function (resolve, reject) {
        app.request(app.host + 'shop/infoBo/findList4App/' + app.appid, 'POST', 'form', {}, function (res) {
          if (res.data.code == 200) {
            resolve(res.data.data);
          } else {
            reject(`后台接口状态码异常:${res.data.code}`);
          }
        });
      }).then(function (data) {
        let list = [];
        for (let i of data) {
          if(i.status==2||i.runStatus==2){
            continue;
          }
          let item = {};
          item.id=i.id;
          item.name = i.name;
          item.detail = i.address;
          item.phone = i.phone;
          item.icon = i.iconImgUrl;
          item.map = {
            latitude: parseFloat(i.latitude),
            longitude: parseFloat(i.longitude)
          };
          item.time = `${i.timeStart}-${i.timeEnd}`;
          if (success) {
            item.meter = that.getDistance(latitude, longitude, parseFloat(i.latitude), parseFloat(i.longitude));
          }
          list.push(item);
        }
        that.setData({
          list: list,
          loading: false
        })
      }).catch(function (error) {
        console.error(error);
      });
    }
    
  },
  setSkin: function () {
    this.setData({
      themeTxtColor: app.globalObj.themeTxtColor,
      assistedTxtColor2: app.globalObj.assistedTxtColor2,
      assistedColor2: app.globalObj.assistedColor2,
      phoneicon: app.changeStoreObj.phoneicon,
      locationicon: app.changeStoreObj.locationicon
    });
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