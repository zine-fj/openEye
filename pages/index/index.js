// pages/kaiyan/kaiyan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eyeUrl: app.globalData.eyeUrl,
    infoList: [{
      id: '',
      title: '', // 名字
      slogan: '', // 标语
      description: '', // 简介
      category: '', // 分类
      author: {
        icon: '', // 头像
        name: '',
        description: '', // 介绍
      },
      cover: {}, // 背景图
      playUrl: '', // 视频播放地址
      duration: '', // 播放时长
      videoTime: '',
      consumption: {
        collectionCount: '', // 多少人收藏
        shareCount: '', // 分享
        replyCount: '' // 回复
      }
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
    let _bg = wx.getStorageSync('bg');
    if (_bg) {
      this.setData({
        bg: _bg
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: _bg.hex,
      })
    }
  },

  getInfo() {
    let self = this;
    let eyeUrl = this.data.eyeUrl;
    wx.showLoading({
      title: '努力加载中...',
    })
    wx.request({
      url: `${eyeUrl}api/v4/tabs/selected`,
      success(res) {
        let _itemList = res.data.itemList;
        let itemList = _itemList.filter((item) => {
          return item.type == 'video'
        })
        // console.log(itemList)
        let _infoList = itemList.map((item, index) => {
          let _infoListArr = {};
          _infoListArr.id = item.data.id;
          _infoListArr.title = item.data.title;
          _infoListArr.slogan = item.data.slogan;
          _infoListArr.description = item.data.description;
          _infoListArr.category = item.data.category;
          _infoListArr.author = {};
          _infoListArr.author.icon = item.data.author.icon;
          _infoListArr.author.name = item.data.author.name;
          _infoListArr.author.description = item.data.author.description;
          _infoListArr.cover = item.data.cover;
          _infoListArr.playUrl = item.data.playUrl;
          _infoListArr.duration = item.data.duration;
          _infoListArr.consumption = {};
          _infoListArr.consumption.collectionCount = item.data.consumption.collectionCount;
          _infoListArr.consumption.shareCount = item.data.consumption.shareCount;
          _infoListArr.consumption.replyCount = item.data.consumption.replyCount;

          // 时间
          let min = parseInt(item.data.duration / 60);
          let sec = parseInt(item.data.duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          };
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          };
          _infoListArr.videoTime = `${min}′${sec}″`
          return _infoListArr;
        })
        // console.log(_infoList);
        wx.hideLoading();
        self.setData({
          infoList: _infoList
        })
        wx.stopPullDownRefresh({});
      }
    })
  },

  bindKanYan(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/play/play?id=${id}`,
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
    this.getInfo();
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
    var path = '/pages/play/play';
    let _title = '开眼视频';
    return {
      title: _title,
      path: path,
    }
  }
})