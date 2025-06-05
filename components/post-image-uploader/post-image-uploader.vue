<template>
  <view class="post-image-uploader">
    <!-- 已上传图片预览区 -->
    <view class="image-preview-area" v-if="imageList.length > 0">
      <view class="image-item" v-for="(item, index) in imageList" :key="index">
        <image class="preview-image" :src="item" mode="aspectFill"></image>
        <text class="delete-icon" @tap="handleDeleteImage(index)">×</text>
      </view>
    </view>

    <!-- 上传按钮 -->
    <view
      class="upload-button"
      @tap="handleChooseImage"
      v-if="imageList.length < maxCount"
    >
      <text class="upload-icon">+</text>
      <text class="upload-text">添加图片</text>
    </view>

    <!-- 提示信息 -->
    <view class="tips-text" v-if="imageList.length < maxCount">
      最多上传{{ maxCount }}张图片
    </view>
  </view>
</template>

<script>
import { uploadPostImages } from "../../utils/api/postApi";

export default {
  name: "PostImageUploader",
  props: {
    // 最大上传数量
    maxCount: {
      type: Number,
      default: 9,
    },
    // 用户ID
    userId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 已上传图片URL列表
      imageList: [],
      // 本地临时文件路径列表
      tempFilePaths: [],
      // 是否正在上传
      uploading: false,
    };
  },
  methods: {
    /**
     * 选择图片
     */
    async handleChooseImage() {
      if (this.uploading) {
        uni.showToast({
          title: "正在上传中，请稍候",
          icon: "none",
        });
        return;
      }

      try {
        // 计算还可以选择的图片数量
        const remainCount = this.maxCount - this.imageList.length;
        if (remainCount <= 0) {
          uni.showToast({
            title: `最多只能上传${this.maxCount}张图片`,
            icon: "none",
          });
          return;
        }

        // 选择图片
        const { tempFilePaths } = await uni.chooseImage({
          count: remainCount,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
        });

        if (!tempFilePaths || tempFilePaths.length === 0) return;

        // 开始上传
        await this.uploadImages(tempFilePaths);
      } catch (error) {
        uni.showToast({
          title: "选择图片失败",
          icon: "none",
        });
      }
    },

    /**
     * 上传图片
     */
    async uploadImages(filePaths) {
      if (!filePaths || filePaths.length === 0) return;

      this.uploading = true;
      uni.showLoading({
        title: "上传中...",
        mask: true,
      });

      try {
        // 调用上传接口
        const result = await uploadPostImages({
          filePaths,
          userId: this.userId,
        });

        uni.hideLoading();
        this.uploading = false;

        if (
          result &&
          result.code === 200 &&
          result.data &&
          result.data.imageUrls
        ) {
          // 更新图片列表
          this.imageList = [...this.imageList, ...result.data.imageUrls];

          // 触发事件通知父组件
          this.$emit("imagesChanged", this.imageList);

          uni.showToast({
            title: "上传成功",
            icon: "success",
          });
        } else {
          throw new Error(result?.message || "上传失败");
        }
      } catch (error) {
        uni.hideLoading();
        this.uploading = false;
        uni.showToast({
          title: error.message || "上传图片失败",
          icon: "none",
        });
      }
    },

    /**
     * 删除图片
     */
    handleDeleteImage(index) {
      if (this.uploading) {
        uni.showToast({
          title: "正在上传中，请稍候",
          icon: "none",
        });
        return;
      }

      uni.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            // 删除指定索引的图片
            this.imageList.splice(index, 1);

            // 触发事件通知父组件
            this.$emit("imagesChanged", this.imageList);
          }
        },
      });
    },

    /**
     * 获取已上传的图片URL列表
     */
    getImageList() {
      return this.imageList;
    },

    /**
     * 清空图片列表
     */
    clearImageList() {
      this.imageList = [];
      this.$emit("imagesChanged", this.imageList);
    },
  },
};
</script>

<style scoped>
.post-image-uploader {
  padding: 10px 0;
}

.image-preview-area {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 18px;
}

.upload-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background-color: #f5f5f5;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.upload-icon {
  font-size: 32px;
  color: #999;
  margin-bottom: 5px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

.tips-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
</style>
