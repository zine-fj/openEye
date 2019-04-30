// pages/collection/collection.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoCancelImg: '/pages/images/close.png',
    nowNav: 'kysp', // 当前的列表
    wordsList: [], // 文章列表
    videosList: [], // 视频列表
    nowClickWord: -1, // 当前点击的小红心
    isNoCollec: true, // 是否暂无收藏，默认是
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 获取开眼视频
  getVideos() {
    let self = this;
    let videos = wx.getStorageSync('videosArr');
    let nowNav = this.data.nowNav;
    if (videos) {
      videos = videos.reverse();
      let _isNoCollec;
      if (videos.length > 0) {
        _isNoCollec = false;
      } else {
        _isNoCollec = true;
      }
      self.setData({
        videosList: videos,
        isNoCollec: _isNoCollec
      })
    } else {
      this.setData({
        isNoCollec: true,
      })
    }
  },

  // 点击视频
  bindVideo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/video/video_play/video_play?id=${id}`,
    })
  },

  // 点击视频取消按钮
  bindVideoCancel(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;

    let videosList = this.data.videosList;
    console.log(videosList)
    videosList[videosList.indexOf(videosList[id])] = null;
    videosList.splice(videosList.indexOf(null), 1);
    wx.setStorageSync('videosArr', videosList);
    wx.showLoading({
      title: '删除视频中..',
    })
    setTimeout(() => {
      wx.hideLoading();
      self.setData({
        videosList,
      })

      let _isNoCollec;
      if (videosList.length > 0) {
        _isNoCollec = false;
      } else {
        _isNoCollec = true;
      }
      this.setData({
        isNoCollec: _isNoCollec
      })
    }, 500)
  },
  // 暂无收藏去添加
  bindToAdd() {
    let nowNav = this.data.nowNav;
    if (nowNav == 'kysp') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let nowNav = this.data.nowNav;
    this.getVideos()
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

  // 时间转换
  timeFormat(time) {
    let y = time.substring(0, 4);
    let m = time.substring(4, 6);
    let n = time.substring(6, 8);
    let endInfo = `${y}-${m}-${n}`
    return endInfo
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})