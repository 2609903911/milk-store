<template>
  <view class="post-create-container">
    <scroll-view class="content-scroll" scroll-y>
      <!-- 标题输入 -->
      <title-input
        ref="titleInput"
        :initial-title="postData.title"
        @update:title="handleTitleChange"
      />

      <!-- 内容输入 -->
      <content-input
        ref="contentInput"
        :initial-content="postData.content"
        @update:content="handleContentChange"
      />

      <!-- 图片上传 -->
      <image-uploader
        ref="imageUploader"
        :initial-images="postData.images"
        @update:images="handleImagesChange"
      />

      <!-- 产品选择 -->
      <product-selector
        ref="productSelector"
        :initial-product-id="postData.productId"
        @update:productId="handleProductChange"
      />

      <!-- 提交按钮 -->
      <submit-button
        :disabled="!isFormValid"
        :loading="submitting"
        @submit="submitPost"
      />
    </scroll-view>
  </view>
</template>

<script>
import { createPost, uploadPostImagesString } from "../../utils/api/postApi";
import TitleInput from "./c-cpns/title-input/title-input.vue";
import ContentInput from "./c-cpns/content-input/content-input.vue";
import ImageUploader from "./c-cpns/image-uploader/image-uploader.vue";
import ProductSelector from "./c-cpns/product-selector/product-selector.vue";
import SubmitButton from "./c-cpns/submit-button/submit-button.vue";

// 本地存储的草稿key
const DRAFT_STORAGE_KEY = "post_draft_data";

export default {
  components: {
    TitleInput,
    ContentInput,
    ImageUploader,
    ProductSelector,
    SubmitButton,
  },
  data() {
    return {
      postData: {
        title: "",
        content: "",
        productId: null,
        images: [],
      },
      submitting: false,
      isDirty: false, // 标记内容是否被编辑过
    };
  },
  computed: {
    // 表单验证
    isFormValid() {
      return (
        this.postData.title.trim() !== "" && this.postData.content.trim() !== ""
      );
    },
    // 判断是否有内容需要保存
    hasContent() {
      return (
        this.postData.title.trim() !== "" ||
        this.postData.content.trim() !== "" ||
        this.postData.productId !== null ||
        this.postData.images.length > 0
      );
    },
  },
  onLoad() {
    // 加载本地存储的草稿
    this.loadDraft();
  },
  onUnload() {
    // 页面卸载前检查是否需要保存草稿
    if (this.isDirty && this.hasContent) {
      this.askToSaveDraft();
    }
  },
  // 监听返回按钮
  onBackPress() {
    if (this.isDirty && this.hasContent) {
      this.askToSaveDraft();
      return true; // 拦截默认返回行为
    }
    return false;
  },
  methods: {
    // 处理标题变化
    handleTitleChange(value) {
      this.postData.title = value;
      this.isDirty = true;
    },

    // 处理内容变化
    handleContentChange(value) {
      this.postData.content = value;
      this.isDirty = true;
    },

    // 处理图片变化
    handleImagesChange(images) {
      this.postData.images = images;
      this.isDirty = true;
    },

    // 处理产品变化
    handleProductChange(productId) {
      this.postData.productId = productId;
      this.isDirty = true;
    },

    // 加载草稿
    loadDraft() {
      try {
        const draftData = uni.getStorageSync(DRAFT_STORAGE_KEY);
        if (draftData) {
          // 解析存储的草稿数据
          const parsedData = JSON.parse(draftData);

          // 弹出确认框询问是否加载草稿
          uni.showModal({
            title: "发现草稿",
            content: "是否加载上次未完成的编辑内容？",
            confirmText: "加载",
            cancelText: "不加载",
            success: (res) => {
              if (res.confirm) {
                // 用户点击确认，加载草稿
                this.postData = parsedData;

                // 通知各子组件更新数据
                this.$nextTick(() => {
                  // 更新子组件的值
                  if (this.$refs.titleInput) {
                    this.$refs.titleInput.setTitle(parsedData.title || "");
                  }

                  if (this.$refs.contentInput) {
                    this.$refs.contentInput.setContent(
                      parsedData.content || ""
                    );
                  }

                  if (this.$refs.imageUploader) {
                    this.$refs.imageUploader.setImages(parsedData.images || []);
                  }

                  if (this.$refs.productSelector) {
                    this.$refs.productSelector.setProductId(
                      parsedData.productId
                    );
                  }
                });

                uni.showToast({
                  title: "已加载草稿",
                  icon: "success",
                });
              } else {
                // 用户点击取消，删除草稿
                this.clearDraft();
              }
            },
          });
        }
      } catch (error) {}
    },

    // 保存草稿
    saveDraft() {
      try {
        // 只保存有实际内容的草稿
        if (this.hasContent) {
          const draftData = JSON.stringify(this.postData);
          uni.setStorageSync(DRAFT_STORAGE_KEY, draftData);

          uni.showToast({
            title: "草稿已保存",
            icon: "success",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "保存草稿失败",
          icon: "none",
        });
      }
    },

    // 清除草稿
    clearDraft() {
      try {
        uni.removeStorageSync(DRAFT_STORAGE_KEY);
      } catch (error) {}
    },

    // 询问是否保存草稿
    askToSaveDraft() {
      uni.showModal({
        title: "保存草稿",
        content: "是否保存当前编辑的内容？",
        confirmText: "保存",
        cancelText: "不保存",
        success: (res) => {
          if (res.confirm) {
            this.saveDraft();
          } else {
            this.clearDraft();
          }
        },
      });
    },

    // 提交帖子
    async submitPost() {
      // 表单验证
      if (!this.isFormValid) {
        uni.showToast({
          title: "请填写标题和内容",
          icon: "none",
        });
        return;
      }

      // 检查用户登录状态
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateTo({
            url: "../login/login",
          });
        }, 1500);
        return;
      }

      // 获取用户ID
      const userId = userInfo.userId || userInfo.id || userInfo.user_id;
      if (!userId && userId !== 0) {
        uni.showToast({
          title: "无法获取用户ID，请重新登录",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateTo({
            url: "../login/login",
          });
        }, 1500);
        return;
      }

      this.submitting = true;

      try {
        // 获取选择的图片临时路径
        const imagePaths = this.postData.images || [];
        const hasImages = imagePaths.length > 0;

        // 判断是否需要先上传图片
        if (hasImages) {
          // 使用字符串版本的图片上传API
          try {
            uni.showLoading({
              title: "正在上传图片...",
              mask: true,
            });

            // 上传图片，获取图片URL
            const uploadResult = await uploadPostImagesString({
              filePaths: imagePaths,
              userId: userId,
              imagesStr: "", // 初始为空字符串，因为是新帖子
            });

            uni.hideLoading();

            if (
              uploadResult &&
              uploadResult.code === 200 &&
              uploadResult.data
            ) {
              // 图片上传成功，创建包含图片URL的帖子
              const postData = {
                title: this.postData.title,
                content: this.postData.content,
                productId: this.postData.productId || null,
                userId: userId,
                images: uploadResult.data.imageUrls || [], // 使用返回的图片URL数组
                imagesStr: uploadResult.data.imagesStr || "", // 使用返回的图片URL字符串
              };

              // 调用API发布帖子
              const response = await createPost(postData);

              if (response && response.data) {
                // 发布成功
                uni.showToast({
                  title: "发布成功",
                  icon: "success",
                });

                // 发布成功后清除草稿
                this.clearDraft();

                // 跳转到社区页面
                setTimeout(() => {
                  uni.switchTab({
                    url: "../community/community",
                  });
                }, 1500);
              }
            } else {
              throw new Error(uploadResult?.message || "上传图片失败");
            }
          } catch (error) {
            uni.hideLoading();
            let errorMsg = "上传图片失败，请重试";
            if (error.message) {
              errorMsg = error.message;
            }
            uni.showToast({
              title: errorMsg,
              icon: "none",
              duration: 3000,
            });
          }
        } else {
          // 没有图片，直接创建帖子
          const postData = {
            title: this.postData.title,
            content: this.postData.content,
            productId: this.postData.productId || null,
            userId: userId,
            imagesStr: "", // 添加空的图片字符串
          };

          // 调用API发布帖子
          const response = await createPost(postData);

          if (response && response.data) {
            // 帖子发布成功
            uni.showToast({
              title: "发布成功",
              icon: "success",
            });

            // 发布成功后清除草稿
            this.clearDraft();

            // 跳转到社区页面
            setTimeout(() => {
              uni.switchTab({
                url: "../community/community",
              });
            }, 1500);
          } else {
            throw new Error("发布失败");
          }
        }
      } catch (error) {
        // 显示详细错误信息
        let errorMsg = "发布失败，请重试";
        if (error.message) {
          errorMsg = error.message;
        } else if (error.data && error.data.message) {
          errorMsg = error.data.message;
        }

        uni.showToast({
          title: errorMsg,
          icon: "none",
          duration: 3000,
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.post-create-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;

  .page-header {
    height: 90rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: relative;

    .header-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .content-scroll {
    flex: 1;
  }
}
</style>
