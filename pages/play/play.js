// pages/kaiyanli/kaiyanli.js
const app = getApp();
let theId;
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heartImg: '/pages/images/heart.png',
    heartSelectImg: '/pages/images/heart_select.png',
    shareImg: '/pages/images/share.png',
    commentImg: '/pages/images/comment.png',
    eyeUrl: app.globalData.eyeUrl,
    videoLi: {
      poster: '',
      video: '',
      title: '',
      category: "",
      videoTime: '',
      description: '',
      like: '',
      share: '',
      comment: '',
      authorImg: '',
      authorName: '',
      authorDes: ''
    },
    otherVideoList: [],
    isCommentShow: false, // 评论是否显示，默认否
    commentList: [{
      img: '',
      name: '',
      time: '',
      cont: ''
    }], // 评论列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    theId = options.id;
    let shareId = wx.getStorageSync('shareId');
    if (theId) {
      this.getCurrentVideo(theId);
      this.getGroomVideo(theId);
    } else if (shareId) {
      this.getCurrentVideo(shareId);
    }
  },

  // 获取当前视频信息
  getCurrentVideo(id) {
    let self = this;
    let eyeUrl = this.data.eyeUrl;
    let videoLi = this.data.videoLi;
    wx.showLoading({
      title: '视频加载中...',
    })
    wx.request({
      url: `${eyeUrl}api/v1/video/${id}`,
      data: {},
      success(res) {
        wx.hideLoading();
        let item = res.data;
        console.log(item)
        let _videoLi = {};
        _videoLi.id = item.id;
        _videoLi.poster = item.coverForDetail;
        _videoLi.video = item.playUrl;
        _videoLi.title = item.title;
        _videoLi.category = item.category;

        console.log(_videoLi.video)
        // 时间
        let min = parseInt(item.duration / 60);
        let sec = parseInt(item.duration % 60);
        if (min.toString().length == 1) {
          min = `0${min}`;
        };
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        };
        _videoLi.videoTime = `${min}′${sec}″`
        _videoLi.description = item.description;
        _videoLi.like = item.consumption.collectionCount;
        _videoLi.share = item.consumption.shareCount;
        _videoLi.comment = item.consumption.replyCount;
        _videoLi.authorImg = item.author.icon;
        _videoLi.authorName = item.author.name;
        _videoLi.authorDes = item.author.description;
        _videoLi.isCollection = false;
        wx.setNavigationBarTitle({
          title: item.title,
        })

        let videosArr = wx.getStorageSync('videosArr');
        if (videosArr) {
          videosArr.forEach((item, index) => {
            if (item.id == _videoLi.id) {
              _videoLi.isCollection = item.isCollection
            }
          })
        }

        self.setData({
          videoLi: _videoLi
        })
      }
    })
  },

  // 点击收藏，评论
  bindVideoType(e) {
    let self = this;
    let eyeUrl = this.data.eyeUrl;
    let type = e.currentTarget.dataset.type;
    let videoLi = this.data.videoLi;
    let commentNum = videoLi.comment;
    console.log(type, theId)
    if (!theId) {
      let shareId = wx.getStorageSync('shareId');
      if (shareId) {
        theId = shareId;
      }
    } else {
      theId
    }

    if (type == 'comment') {
      if (commentNum == 0) {
        util.showMsg('此视频暂无评论哦...')
      } else {
        wx.showLoading({
          title: '评论加载中...',
        })
        wx.request({
          url: `${eyeUrl}api/v1/replies/video?id=${theId}&num=${commentNum}`,
          data: {},
          success(res) {
            wx.hideLoading();
            self.setData({
              isCommentShow: true,
            })
            console.log(res);
            let data = res.data.replyList
            let _commentList = data.map((item, index) => {
              let _commentList1 = {};
              _commentList1.img = item.user.avatar;
              _commentList1.name = item.user.nickname;
              _commentList1.cont = item.message;
              _commentList1.time = util.formatTime(new Date(item.createTime))
              return _commentList1;
            })
            console.log(_commentList)
            self.setData({
              commentList: _commentList
            })
          }
        })
      }

    } else if (type == 'like') {
      let videosArr = wx.getStorageSync('videosArr') || [];
      if (videoLi.isCollection == false) {
        videoLi.isCollection = true;
        videoLi.like = videoLi.like + 1;
        self.setData({
          videoLi
        })
        videosArr.push(videoLi)
      } else {
        videoLi.isCollection = false;
        videoLi.like = videoLi.like - 1;
        self.setData({
          videoLi
        })
        videosArr.pop(videoLi)
      }
      wx.setStorageSync('videosArr', videosArr);
    } else if (type == 'share') {
      let shareId = wx.getStorageSync('shareId');
      if (shareId) {
        // wx.clearStorageSync('shareId')
        wx.setStorageSync('shareId', theId)
      } else {
        wx.setStorageSync('shareId', theId)
      }
    }
  },

  // 点击取消评论
  bindUpCancel() {
    this.setData({
      isCommentShow: false
    })
  },

  // 获取推荐视频信息
  getGroomVideo(id) {
    let self = this;
    let eyeUrl = this.data.eyeUrl;
    let otherVideoList = this.data.otherVideoList;
    wx.showLoading({
      title: '视频加载中...',
    })
    wx.request({
      url: `${eyeUrl}api/v4/video/related?id=${id}`,
      data: {},
      success(res) {
        let _otherList = []; // 所有推荐
        let _otherArr = []; // 每个类型下视频
        let dataArr = res.data.itemList;
        let dataNum = res.data.count
        // console.log(dataArr)
        let textCardArr = dataArr.filter((item, index) => {
          return item.type == "textCard"
        })
        let theVideoCardArr = dataArr.filter((item, index) => {
          return item.type == "videoSmallCard"
        })
        let videoCardArr = theVideoCardArr.map((item, index) => {
          let _videoCardArr = {};
          _videoCardArr.img = item.data.cover.detail;
          _videoCardArr.authorImg = item.data.author.icon;
          _videoCardArr.author = item.data.author.name;
          _videoCardArr.title = item.data.title;
          _videoCardArr.id = item.data.id;
          // 时间
          let min = parseInt(item.data.duration / 60);
          let sec = parseInt(item.data.duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          };
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          };
          _videoCardArr.videoTime = `${min}′${sec}″`
          return _videoCardArr
        })
        var _otherVideoList = [];
        // 均分数组
        for (let i = 0, len = videoCardArr.length; i < len; i += 5) {
          _otherVideoList.push(videoCardArr.slice(i, i + 5));
        }
        _otherVideoList.forEach((item, index) => {
          textCardArr.forEach((text, i) => {
            if (index == i) {
              _otherList.push({
                title: text.data.text,
                videoArr: item
              })
            }
          })
        })
        // console.log(_otherList)

        self.setData({
          otherVideoList: _otherList
        })
        wx.hideLoading();
        // console.log(otherVideoList)
      }
    })
  },

  // 点击其他视频
  bindOtherVideo(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.redirectTo({
      url: `/pages/video/video_play/video_play?id=${id}`,
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
  onShareAppMessage: function (options) {
    let videoLi = this.data.videoLi;
    console.log(videoLi)
    var path = '/pages/play/play';
    theId = videoLi.id;
    return {
      title: videoLi.title,
      path: path,
      imageUrl: videoLi.poster,
    }
  },
})