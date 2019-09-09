// pages/movies/movies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[]
  },

  //获取电影列表
  getMovieesList:function(){
    wx.showLoading({
      title: '拼命加载中。。',
    })
    wx.cloud.callFunction({
      name: 'movieList',
      data: {
        start: this.data.movieList.length,
        count: 10
      }
    }).then(res => {
      console.log(res);
      this.setData({
        movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)
      }); 
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    })
  },

  //去评价
  gotoComment:function(event){
    wx.navigateTo({
      // 这个引号是esc下面的按键，不是单引号，否则打印不出来。es6语法
      // 如果使用ES6的模板字符串${}语法的话，外面的引号需要用反引号，就是键盘1左边 和波浪线同一个的按钮：``
      
      url: `../common/common?movieid=${event.target.dataset.movieid}`,
    })
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieesList();
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
    this.getMovieesList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})