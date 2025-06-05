"use strict";
const common_vendor = require("../../../../common/vendor.js");
const utils_userService = require("../../../../utils/userService.js");
const utils_api_config = require("../../../../utils/api/config.js");
const utils_api_followApi = require("../../../../utils/api/followApi.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  name: "ProfileHeader",
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isFollowed: false,
      isUploading: false,
      // 上传状态标记
      showBioModal: false,
      newBio: ""
    };
  },
  computed: {
    // 判断是否为当前登录用户
    isCurrentUser() {
      const currentUser = common_vendor.index.getStorageSync("userInfo");
      return currentUser && currentUser.userId === this.userInfo.userId;
    },
    // 获取完整的背景图片URL
    getBackgroundImageUrl() {
      if (!this.userInfo.backgroundImage) {
        return "/static/images/post-background.jpg";
      }
      if (this.userInfo.backgroundImage.startsWith("http")) {
        return this.userInfo.backgroundImage;
      }
      return utils_api_config.getFullUrl(this.userInfo.backgroundImage);
    },
    // 获取完整的头像URL
    getAvatarUrl() {
      if (!this.userInfo.avatar) {
        return "/static/images/avatar.png";
      }
      if (this.userInfo.avatar.startsWith("http")) {
        return this.userInfo.avatar;
      }
      return utils_api_config.getFullUrl(this.userInfo.avatar);
    }
  },
  watch: {
    // 监听userInfo变化，更新关注状态
    userInfo: {
      handler(newVal) {
        if (newVal && typeof newVal.isFollowed !== "undefined") {
          this.isFollowed = newVal.isFollowed;
        }
        if (newVal && newVal.bio) {
          this.newBio = newVal.bio;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 处理头像加载错误
    handleAvatarError() {
    },
    // 处理关注/取消关注操作
    async handleFollowAction() {
      var _a, _b, _c;
      const currentUser = common_vendor.index.getStorageSync("userInfo");
      if (!currentUser || !currentUser.userId) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: this.isFollowed ? "取消关注中..." : "关注中...",
          mask: true
        });
        if (this.isFollowed) {
          const result = await utils_api_followApi.unfollowUser(this.userInfo.userId);
          if (result.code === 200) {
            this.isFollowed = false;
            common_vendor.index.showToast({
              title: "已取消关注",
              icon: "none"
            });
          } else {
            const checkResponse = await utils_api_followApi.checkFollowStatus(this.userInfo.userId);
            this.isFollowed = ((_a = checkResponse.data) == null ? void 0 : _a.isFollowing) === true;
            common_vendor.index.showToast({
              title: result.message || "操作失败",
              icon: "none"
            });
          }
        } else {
          const result = await utils_api_followApi.followUser(this.userInfo.userId);
          if (result.code === 200) {
            this.isFollowed = true;
            common_vendor.index.showToast({
              title: "关注成功",
              icon: "success"
            });
          } else {
            const checkResponse = await utils_api_followApi.checkFollowStatus(this.userInfo.userId);
            this.isFollowed = ((_b = checkResponse.data) == null ? void 0 : _b.isFollowing) === true;
            common_vendor.index.showToast({
              title: result.message || "操作失败",
              icon: "none"
            });
          }
        }
        common_vendor.index.hideLoading();
        this.$forceUpdate();
        this.$emit("follow-status-changed", {
          userId: this.userInfo.userId,
          isFollowed: this.isFollowed
        });
        this.$emit("update:userInfo", {
          ...this.userInfo,
          isFollowed: this.isFollowed
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        try {
          const checkResponse = await utils_api_followApi.checkFollowStatus(this.userInfo.userId);
          this.isFollowed = ((_c = checkResponse.data) == null ? void 0 : _c.isFollowing) === true;
        } catch (checkError) {
        }
        common_vendor.index.showToast({
          title: "操作失败，请稍后再试",
          icon: "none"
        });
        this.$forceUpdate();
        this.$emit("update:userInfo", {
          ...this.userInfo,
          isFollowed: this.isFollowed
        });
      }
    },
    // 选择背景图片
    chooseBackgroundImage() {
      if (this.isUploading) {
        common_vendor.index.showToast({
          title: "正在上传中，请稍候",
          icon: "none"
        });
        return;
      }
      common_vendor.index.chooseImage({
        count: 1,
        // 只选择一张图片
        sizeType: ["compressed"],
        // 压缩图片
        sourceType: ["album", "camera"],
        // 从相册或相机选择
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.uploadBackgroundImage(tempFilePath);
        },
        fail: (err) => {
        }
      });
    },
    // 上传背景图片
    async uploadBackgroundImage(filePath) {
      try {
        this.isUploading = true;
        common_vendor.index.showLoading({
          title: "上传中...",
          mask: true
        });
        const fullUploadUrl = utils_api_config.getFullUrl(utils_api_config.API_PATHS.USER_BACKGROUND_UPLOAD);
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            common_vendor.index.uploadFile({
              url: fullUploadUrl,
              filePath,
              name: "backgroundFile",
              formData: {
                userId: this.userInfo.userId,
                returnFullUrl: "true",
                // 请求后端返回完整URL
                baseUrl: utils_api_config.getFullUrl("")
                // 提供基础URL给后端
              },
              success: (uploadRes) => {
                try {
                  const result = typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data) : uploadRes.data;
                  resolve(result);
                } catch (parseError) {
                  reject(new Error("解析响应数据失败"));
                }
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
          common_vendor.index.hideLoading();
          if (uploadResult && uploadResult.code === 200) {
            let backgroundUrl = uploadResult.data.backgroundUrl;
            if (backgroundUrl && backgroundUrl.startsWith("/")) {
              backgroundUrl = utils_api_config.getFullUrl(backgroundUrl);
            }
            this.$emit("update:userInfo", {
              ...this.userInfo,
              backgroundImage: backgroundUrl
            });
            common_vendor.index.showToast({
              title: "背景上传成功",
              icon: "success"
            });
            this.$emit("background-updated", backgroundUrl);
          } else {
            throw new Error((uploadResult == null ? void 0 : uploadResult.message) || "上传失败");
          }
        } catch (uploadError) {
          throw uploadError;
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "上传失败",
          icon: "none"
        });
      } finally {
        this.isUploading = false;
      }
    },
    // 编辑个人资料
    editProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/personal-data/personal-data"
      });
    },
    // 显示编辑简介弹窗
    showEditBioModal() {
      this.newBio = this.userInfo.bio || "";
      this.$refs.bioPopup.open();
    },
    // 隐藏编辑简介弹窗
    hideBioModal() {
      this.$refs.bioPopup.close();
    },
    // 更新简介
    async updateBio() {
      if (this.newBio.trim() === this.userInfo.bio) {
        this.hideBioModal();
        return;
      }
      common_vendor.index.showLoading({
        title: "更新中...",
        mask: true
      });
      try {
        const result = await utils_userService.updateUserBio(
          this.newBio.trim(),
          this.userInfo.userId
        );
        if (result.success) {
          this.$emit("update:userInfo", {
            ...this.userInfo,
            bio: this.newBio.trim()
          });
          common_vendor.index.showToast({
            title: "简介更新成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: result.message || "简介更新失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "简介更新失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
        this.hideBioModal();
      }
    }
  },
  async mounted() {
    var _a;
    if (this.userInfo.userId && !this.isCurrentUser) {
      try {
        const currentUser = common_vendor.index.getStorageSync("userInfo");
        if (currentUser && currentUser.userId) {
          common_vendor.index.showLoading({
            title: "加载中...",
            mask: false
          });
          const response = await utils_api_followApi.checkFollowStatus(this.userInfo.userId);
          common_vendor.index.hideLoading();
          if (response.code === 200) {
            this.isFollowed = ((_a = response.data) == null ? void 0 : _a.isFollowing) === true;
            this.$emit("update:userInfo", {
              ...this.userInfo,
              isFollowed: this.isFollowed
            });
          } else {
            this.isFollowed = Boolean(this.userInfo.isFollowed);
          }
        } else {
          this.isFollowed = Boolean(this.userInfo.isFollowed);
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        this.isFollowed = Boolean(this.userInfo.isFollowed);
      }
      this.$forceUpdate();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.getBackgroundImageUrl,
    b: $options.isCurrentUser
  }, $options.isCurrentUser ? {
    c: common_vendor.o((...args) => $options.chooseBackgroundImage && $options.chooseBackgroundImage(...args))
  } : {}, {
    d: $options.getAvatarUrl,
    e: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args)),
    f: common_vendor.t($props.userInfo.nickname || "用户昵称"),
    g: common_vendor.t($props.userInfo.bio || "记录生活的点滴，热爱分享☀"),
    h: $options.isCurrentUser
  }, $options.isCurrentUser ? {
    i: common_assets._imports_0$15,
    j: common_vendor.o((...args) => $options.showEditBioModal && $options.showEditBioModal(...args))
  } : {}, {
    k: !$options.isCurrentUser && $props.userInfo.userId
  }, !$options.isCurrentUser && $props.userInfo.userId ? {
    l: common_vendor.t($data.isFollowed ? "已关注" : "关注"),
    m: $data.isFollowed ? 1 : "",
    n: common_vendor.o((...args) => $options.handleFollowAction && $options.handleFollowAction(...args))
  } : {}, {
    o: $options.isCurrentUser
  }, $options.isCurrentUser ? {
    p: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args))
  } : {}, {
    q: $data.newBio,
    r: common_vendor.o(($event) => $data.newBio = $event.detail.value),
    s: common_vendor.t($data.newBio.length),
    t: common_vendor.o((...args) => $options.hideBioModal && $options.hideBioModal(...args)),
    v: common_vendor.o((...args) => $options.updateBio && $options.updateBio(...args)),
    w: common_vendor.sr("bioPopup", "515a44d8-0"),
    x: common_vendor.p({
      type: "center",
      ["background-color"]: "#00000000"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-profile/c-cpns/profile-header/profile-header.js.map
