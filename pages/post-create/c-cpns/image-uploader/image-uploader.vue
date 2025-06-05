<template>
  <view class="image-uploader-container">
    <view class="uploader-header">
      <text class="uploader-title">上传图片</text>
      <text class="uploader-count">{{ images.length }}/9</text>
    </view>

    <view class="image-list">
      <view class="image-item" v-for="(image, index) in images" :key="index">
        <image class="preview-image" :src="image" mode="aspectFill"></image>
        <view class="delete-btn" @click.stop="removeImage(index)">×</view>
      </view>

      <view class="upload-btn" @click="chooseImage" v-if="images.length < 9">
        <text class="upload-icon">+</text>
      </view>
    </view>

    <!-- 上传中提示 -->
    <view class="loading-container" v-if="uploading">
      <view class="loading-text">上传中...</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ImageUploader",
  props: {
    initialImages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      images: [...(this.initialImages || [])],
      uploading: false,
    };
  },
  methods: {
    // 选择图片
    chooseImage() {
      const that = this;
      uni.chooseImage({
        count: 9 - this.images.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: function (res) {
          // 获取临时文件路径
          const tempFilePaths = res.tempFilePaths;

          // 不上传到服务器，直接使用临时路径
          const newImages = [...that.images, ...tempFilePaths];
          that.images = newImages;
          that.$emit("update:images", newImages);
        },
      });
    },

    // 删除图片
    removeImage(index) {
      this.images.splice(index, 1);
      this.$emit("update:images", [...this.images]);
    },

    // 供父组件调用，设置图片数组
    setImages(images) {
      this.images = [...(images || [])];
    },

    // 获取所有图片的临时路径
    getImagePaths() {
      return [...this.images];
    },
  },
};
</script>

<style lang="scss" scoped>
.image-uploader-container {
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  position: relative;

  .uploader-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .uploader-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }

    .uploader-count {
      font-size: 24rpx;
      color: #999;
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;

    .image-item {
      position: relative;
      width: 210rpx;
      height: 210rpx;
      margin-right: 15rpx;
      margin-bottom: 15rpx;

      .preview-image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
      }

      .delete-btn {
        position: absolute;
        top: -15rpx;
        right: -15rpx;
        width: 40rpx;
        height: 40rpx;
        line-height: 34rpx;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        border-radius: 50%;
        font-size: 32rpx;
      }
    }

    .upload-btn {
      width: 210rpx;
      height: 210rpx;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8rpx;
      margin-bottom: 15rpx;

      .upload-icon {
        font-size: 60rpx;
        color: #999;
      }
    }
  }

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;

    .loading-text {
      font-size: 28rpx;
      color: #666;
    }
  }
}
</style>
