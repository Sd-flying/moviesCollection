// pages/common/common.js
//初始化数据库
const db=wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:[],
    content:'', //评价内容
    score:5, //评价的分数
    images:[],
    fileIds:[],
    movieId:-1
  },
  //提交评价
  submit:function(){
    wx.showLoading({
      title: '评论中。。',
    })
    let promiseArr=[];
    for(let i=0;i<this.data.images.length;i++){
      promiseArr.push(new Promise((reslove,reject)=>{
        let item=this.data.images[i];
        let suffix=/\.\w+$/.exec(item)[0];//正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime()+suffix,
          filePath: item, // 文件路径
        }).then(res => {
          // 返回文件 ID
          console.log(res.fileID)
          this.setData({
            fileIds:this.data.fileIds.concat(res.fileID)
          });
          reslove();
        }).catch(error => {
          // handle error
        })
      }))
    }
    Promise.all(promiseArr).then(res=>{
      //插入数据
      db.collection('comment').add({
        data:{
          content:this.data.content,
          score:this.data.score,
          movieid:this.data.movieId,
          fileIds:this.data.fileIds
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err=>{
        wx.hideLoading();
        wx.showToast({
          title: '评价失败',
        })
      })
    })
  },
  //获取填写的评价
  onContentChange:function(event){
    this.setData({
      content:event.detail
    })
  },
  //获取选择的分数
  onScoreChange:function(event){
    this.setData({
      score: event.detail
    })
  },

  //选择图片进行上传
  uploadImg:function(){
    //选择图片
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=>{
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.movieid
    });
    
    console.log(options);
    wx.cloud.callFunction({ 
      name:'getDetail',
      data:{
        movieid:options.movieid
      }
    }).then(res=>{
      console.log(res);
      this.setData({
        details:JSON.parse(res.result)
      })
    }).catch(err=>{
      console.log(err);
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
})