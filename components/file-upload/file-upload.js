// components/file-upload/file-upload.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    required: { // 属性名
      type: Boolean,
      value: false
    },
    title:{
      type: String,
      value: '上传照片或视频'
    },
    videoMaxSize:{
      type:Number,
      value:200
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPaths:[],
    videoPaths:[],
    fileNum:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fileTypeSelect(){
      let that=this;
      wx.showActionSheet({
        itemList: ['图片', '视频'],
        success (res) {
          let currentSelectIndex=res.tapIndex;
          if(currentSelectIndex===0){
            wx.chooseImage({
              count: 9,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                that.data.fileNum+=tempFilePaths.length;
                if(that.data.fileNum>9){
                  let exceedFileNum=that.data.fileNum - 9;
                  tempFilePaths.splice(tempFilePaths.length-exceedFileNum,exceedFileNum);
                  that.data.fileNum=9;
                  wx.showToast({
                    title: '最多上传9个',
                    icon: 'none',
                    duration: 2000
                  })
                }
                that.data.imgPaths.push(...tempFilePaths);
                that.setData({
                  fileNum:that.data.fileNum,
                  imgPaths:that.data.imgPaths
                });
                that.triggerEvent('change',
                [that.data.imgPaths,that.data.videoPaths]
                );
              }
            })
          }else {
            wx.chooseVideo({
              sourceType: ['album','camera'],
              maxDuration: 60,
              camera: 'back',
              success(res) {
                let videoSize=res.size/1024/1024;
                if(videoSize<=that.properties.videoMaxSize){
                  that.data.videoPaths.push(res.tempFilePath);
                  that.setData({
                    fileNum:++that.data.fileNum,
                    videoPaths:that.data.videoPaths
                  });
                  that.triggerEvent('change',[that.data.imgPaths,that.data.videoPaths]);
                }else {
                  wx.showToast({
                    title: `视频最大不超过${that.properties.videoMaxSize}M`,
                    icon: 'none',
                    duration: 2000
                  })
                }

              }
            })
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },
    // 删除图片
    deleteImg: function (e) {
      let index = e.currentTarget.dataset.index;
      this.data.imgPaths.splice(index, 1);
      this.setData({
        fileNum: --this.data.fileNum,
        imgPaths: this.data.imgPaths
      });
      this.triggerEvent('change',[this.data.imgPaths,this.data.videoPaths]);

    },
    // 预览图片
    previewImg: function (e) {
      let index = e.currentTarget.dataset.index;
      let imgs = this.data.imgPaths;
      wx.previewImage({
        current: imgs[index],
        urls: imgs
      })
    },
    deleteVideo:function (e){
      let index = e.currentTarget.dataset.index;
      this.data.videoPaths.splice(index,1);
      this.setData({
        fileNum: --this.data.fileNum,
        videoPaths: this.data.videoPaths
      });
      this.triggerEvent('change',[this.data.imgPaths,this.data.videoPaths]);

    }
  }
})
