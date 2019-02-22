const app=getApp();
export default {
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options:{
    //   id:''
    // } 
    this.setSkin();
    this.loadInfo(options.id);
  },
  // 加载页面数据
  loadInfo:function(id){
    var that = this;
    new Promise(function (resolve, reject) {
      app.request(app.host + 'shop/infoBo/find4App/' + id, 'POST', 'form', {}, function (res) {
        if (res.data.code == 200) {
          resolve(res.data.data);
        } else {
          reject(`后台接口状态码异常:${res.data.code}`);
        }
      });
    }).then(function (data) {
      var days = data.dayOfWeek.split(',').sort();
      if (days[0] == '0') {
        var last = days.shift();
        days.push(last);
      }
      function parse(day) {
        switch (String(day)) {
          case '0':
            return '周日';
            break;
          case '1':
            return '周一';
            break;
          case '2':
            return '周二';
            break;
          case '3':
            return '周三';
            break;
          case '4':
            return '周四';
            break;
          case '5':
            return '周五';
            break;
          case '6':
            return '周六';
            break;
          default:
            console.error('参数有误!');
        }
      }
      for(let i in days){
        days[i]=parse(days[i]);
      }
      // let startday = parse(days[0]);
      // let endday = parse(days[days.length - 1]);
      let list = [{}, {}, {}, {}, {}];
      list[0].left = '商家名称：';
      list[0].right = data.name;
      list[1].left = '联系电话：';
      list[1].right = data.phone;
      list[2].left = '营业时间：';
      // list[2].right = `周${startday}至周${endday}${data.timeStart}-${data.timeEnd}`;
      list[2].right=days.join('、')+'('+data.timeStart+'-'+data.timeEnd+')';
      list[3].left = '门店地址：';
      list[3].right = data.address;
      list[4].left = '店铺简介：';
      list[4].right = data.summary;
      list[4].row = true;
      that.setData({
        list: list,
        loading:false
      })

    }).catch(function (error) {
      console.error(error);
    });
  },
  setSkin:function(){
    this.setData({
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