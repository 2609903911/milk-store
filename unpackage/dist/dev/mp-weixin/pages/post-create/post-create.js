"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_postApi = require("../../utils/api/postApi.js");
const TitleInput = () => "./c-cpns/title-input/title-input.js";
const ContentInput = () => "./c-cpns/content-input/content-input.js";
const ImageUploader = () => "./c-cpns/image-uploader/image-uploader.js";
const ProductSelector = () => "./c-cpns/product-selector/product-selector.js";
const SubmitButton = () => "./c-cpns/submit-button/submit-button.js";
const DRAFT_STORAGE_KEY = "post_draft_data";
const _sfc_main = {
  components: {
    TitleInput,
    ContentInput,
    ImageUploader,
    ProductSelector,
    SubmitButton
  },
  data() {
    return {
      postData: {
        title: "",
        content: "",
        productId: null,
        images: []
      },
      submitting: false,
      isDirty: false
      // 标记内容是否被编辑过
    };
  },
  computed: {
    // 表单验证
    isFormValid() {
      return this.postData.title.trim() !== "" && this.postData.content.trim() !== "";
    },
    // 判断是否有内容需要保存
    hasContent() {
      return this.postData.title.trim() !== "" || this.postData.content.trim() !== "" || this.postData.productId !== null || this.postData.images.length > 0;
    }
  },
  onLoad() {
    this.loadDraft();
  },
  onUnload() {
    if (this.isDirty && this.hasContent) {
      this.askToSaveDraft();
    }
  },
  // 监听返回按钮
  onBackPress() {
    if (this.isDirty && this.hasContent) {
      this.askToSaveDraft();
      return true;
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
        const draftData = common_vendor.index.getStorageSync(DRAFT_STORAGE_KEY);
        if (draftData) {
          const parsedData = JSON.parse(draftData);
          common_vendor.index.showModal({
            title: "发现草稿",
            content: "是否加载上次未完成的编辑内容？",
            confirmText: "加载",
            cancelText: "不加载",
            success: (res) => {
              if (res.confirm) {
                this.postData = parsedData;
                this.$nextTick(() => {
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
                common_vendor.index.showToast({
                  title: "已加载草稿",
                  icon: "success"
                });
              } else {
                this.clearDraft();
              }
            }
          });
        }
      } catch (error) {
      }
    },
    // 保存草稿
    saveDraft() {
      try {
        if (this.hasContent) {
          const draftData = JSON.stringify(this.postData);
          common_vendor.index.setStorageSync(DRAFT_STORAGE_KEY, draftData);
          common_vendor.index.showToast({
            title: "草稿已保存",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "保存草稿失败",
          icon: "none"
        });
      }
    },
    // 清除草稿
    clearDraft() {
      try {
        common_vendor.index.removeStorageSync(DRAFT_STORAGE_KEY);
      } catch (error) {
      }
    },
    // 询问是否保存草稿
    askToSaveDraft() {
      common_vendor.index.showModal({
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
        }
      });
    },
    // 提交帖子
    async submitPost() {
      if (!this.isFormValid) {
        common_vendor.index.showToast({
          title: "请填写标题和内容",
          icon: "none"
        });
        return;
      }
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "../login/login"
          });
        }, 1500);
        return;
      }
      const userId = userInfo.userId || userInfo.id || userInfo.user_id;
      if (!userId && userId !== 0) {
        common_vendor.index.showToast({
          title: "无法获取用户ID，请重新登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "../login/login"
          });
        }, 1500);
        return;
      }
      this.submitting = true;
      try {
        const imagePaths = this.postData.images || [];
        const hasImages = imagePaths.length > 0;
        if (hasImages) {
          try {
            common_vendor.index.showLoading({
              title: "正在上传图片...",
              mask: true
            });
            const uploadResult = await utils_api_postApi.uploadPostImagesString({
              filePaths: imagePaths,
              userId,
              imagesStr: ""
              // 初始为空字符串，因为是新帖子
            });
            common_vendor.index.hideLoading();
            if (uploadResult && uploadResult.code === 200 && uploadResult.data) {
              const postData = {
                title: this.postData.title,
                content: this.postData.content,
                productId: this.postData.productId || null,
                userId,
                images: uploadResult.data.imageUrls || [],
                // 使用返回的图片URL数组
                imagesStr: uploadResult.data.imagesStr || ""
                // 使用返回的图片URL字符串
              };
              const response = await utils_api_postApi.createPost(postData);
              if (response && response.data) {
                common_vendor.index.showToast({
                  title: "发布成功",
                  icon: "success"
                });
                this.clearDraft();
                setTimeout(() => {
                  common_vendor.index.switchTab({
                    url: "../community/community"
                  });
                }, 1500);
              }
            } else {
              throw new Error((uploadResult == null ? void 0 : uploadResult.message) || "上传图片失败");
            }
          } catch (error) {
            common_vendor.index.hideLoading();
            let errorMsg = "上传图片失败，请重试";
            if (error.message) {
              errorMsg = error.message;
            }
            common_vendor.index.showToast({
              title: errorMsg,
              icon: "none",
              duration: 3e3
            });
          }
        } else {
          const postData = {
            title: this.postData.title,
            content: this.postData.content,
            productId: this.postData.productId || null,
            userId,
            imagesStr: ""
            // 添加空的图片字符串
          };
          const response = await utils_api_postApi.createPost(postData);
          if (response && response.data) {
            common_vendor.index.showToast({
              title: "发布成功",
              icon: "success"
            });
            this.clearDraft();
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "../community/community"
              });
            }, 1500);
          } else {
            throw new Error("发布失败");
          }
        }
      } catch (error) {
        let errorMsg = "发布失败，请重试";
        if (error.message) {
          errorMsg = error.message;
        } else if (error.data && error.data.message) {
          errorMsg = error.data.message;
        }
        common_vendor.index.showToast({
          title: errorMsg,
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
if (!Array) {
  const _component_title_input = common_vendor.resolveComponent("title-input");
  const _component_content_input = common_vendor.resolveComponent("content-input");
  const _component_image_uploader = common_vendor.resolveComponent("image-uploader");
  const _component_product_selector = common_vendor.resolveComponent("product-selector");
  const _component_submit_button = common_vendor.resolveComponent("submit-button");
  (_component_title_input + _component_content_input + _component_image_uploader + _component_product_selector + _component_submit_button)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("titleInput", "5bb8531f-0"),
    b: common_vendor.o($options.handleTitleChange),
    c: common_vendor.p({
      ["initial-title"]: $data.postData.title
    }),
    d: common_vendor.sr("contentInput", "5bb8531f-1"),
    e: common_vendor.o($options.handleContentChange),
    f: common_vendor.p({
      ["initial-content"]: $data.postData.content
    }),
    g: common_vendor.sr("imageUploader", "5bb8531f-2"),
    h: common_vendor.o($options.handleImagesChange),
    i: common_vendor.p({
      ["initial-images"]: $data.postData.images
    }),
    j: common_vendor.sr("productSelector", "5bb8531f-3"),
    k: common_vendor.o($options.handleProductChange),
    l: common_vendor.p({
      ["initial-product-id"]: $data.postData.productId
    }),
    m: common_vendor.o($options.submitPost),
    n: common_vendor.p({
      disabled: !$options.isFormValid,
      loading: $data.submitting
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bb8531f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post-create/post-create.js.map
