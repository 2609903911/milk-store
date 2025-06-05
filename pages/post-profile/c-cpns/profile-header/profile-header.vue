<template>
  <view class="profile-header">
    <!-- 顶部背景 -->
    <view class="header-background">
      <image
        class="background-image"
        :src="getBackgroundImageUrl"
        mode="aspectFill"
      />
      <view class="background-overlay"></view>

      <!-- 修改背景按钮 (仅自己可见) 放在右上角 -->
      <view
        v-if="isCurrentUser"
        class="edit-btn-corner"
        @click="chooseBackgroundImage"
      >
        <text>修改背景</text>
      </view>
    </view>

    <!-- 用户信息 -->
    <view class="user-info">
      <view class="avatar-container">
        <image
          class="avatar"
          :src="getAvatarUrl"
          mode="aspectFill"
          @error="handleAvatarError"
        />
      </view>

      <view class="user-details">
        <text class="username">{{ userInfo.nickname || "用户昵称" }}</text>
        <view class="signature-container">
          <text class="signature">{{
            userInfo.bio || "记录生活的点滴，热爱分享☀"
          }}</text>
          <!-- 编辑简介图标 (仅自己可见) -->
          <image
            v-if="isCurrentUser"
            class="edit-bio-icon"
            src="/static/images/pen.png"
            @click.stop="showEditBioModal"
          ></image>
        </view>
      </view>

      <!-- 关注按钮 -->
      <view
        v-if="!isCurrentUser && userInfo.userId"
        class="follow-btn"
        :class="{ followed: isFollowed }"
        @click="handleFollowAction"
      >
        <text>{{ isFollowed ? "已关注" : "关注" }}</text>
      </view>

      <!-- 编辑资料按钮 (仅自己可见) -->
      <view v-if="isCurrentUser" class="profile-edit-btn" @click="editProfile">
        <text>编辑资料</text>
      </view>
    </view>

    <!-- 编辑简介弹窗 - 使用uni-popup组件 -->
    <uni-popup ref="bioPopup" type="center" background-color="#00000000">
      <view class="bio-popup-content">
        <view class="bio-popup-header">
          <text class="bio-popup-title">编辑简介</text>
        </view>
        <view class="bio-popup-body">
          <textarea
            class="bio-textarea"
            v-model="newBio"
            placeholder="请输入简介"
            maxlength="100"
          ></textarea>
          <text class="bio-count">{{ newBio.length }}/100</text>
        </view>
        <view class="bio-popup-footer">
          <button class="bio-btn bio-btn-cancel" @click="hideBioModal">
            取消
          </button>
          <button class="bio-btn bio-btn-confirm" @click="updateBio">
            确认
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  uploadBackgroundImage,
  updateBackgroundUrl,
  updateUserBio,
} from "../../../../utils/userService.js";
import { API_PATHS, getFullUrl } from "../../../../utils/api/config";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../../../../utils/api/followApi";

export default {
  name: "ProfileHeader",
  props: {
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isFollowed: false,
      isUploading: false, // 上传状态标记
      showBioModal: false,
      newBio: "",
    };
  },
  computed: {
    // 判断是否为当前登录用户
    isCurrentUser() {
      const currentUser = uni.getStorageSync("userInfo");
      return currentUser && currentUser.userId === this.userInfo.userId;
    },

    // 获取完整的背景图片URL
    getBackgroundImageUrl() {
      if (!this.userInfo.backgroundImage) {
        return "/static/images/post-background.jpg";
      }

      // 如果已经是完整URL，直接返回
      if (this.userInfo.backgroundImage.startsWith("http")) {
        return this.userInfo.backgroundImage;
      }

      // 否则转换为完整URL
      return getFullUrl(this.userInfo.backgroundImage);
    },

    // 获取完整的头像URL
    getAvatarUrl() {
      if (!this.userInfo.avatar) {
        return "/static/images/avatar.png";
      }

      // 如果已经是完整URL，直接返回
      if (this.userInfo.avatar.startsWith("http")) {
        return this.userInfo.avatar;
      }

      // 否则转换为完整URL
      return getFullUrl(this.userInfo.avatar);
    },
  },
  watch: {
    // 监听userInfo变化，更新关注状态
    userInfo: {
      handler(newVal) {
        if (newVal && typeof newVal.isFollowed !== "undefined") {
          this.isFollowed = newVal.isFollowed;
        }
        // 更新简介编辑框的内容
        if (newVal && newVal.bio) {
          this.newBio = newVal.bio;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 处理头像加载错误
    handleAvatarError() {
      // 使用默认头像
    },

    // 处理关注/取消关注操作
    async handleFollowAction() {
      // 检查是否登录
      const currentUser = uni.getStorageSync("userInfo");
      if (!currentUser || !currentUser.userId) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        return;
      }

      try {
        // 防止重复点击
        uni.showLoading({
          title: this.isFollowed ? "取消关注中..." : "关注中...",
          mask: true,
        });

        if (this.isFollowed) {
          // 调用取消关注API
          const result = await unfollowUser(this.userInfo.userId);

          if (result.code === 200) {
            // 操作成功，更新UI状态
            this.isFollowed = false;

            uni.showToast({
              title: "已取消关注",
              icon: "none",
            });
          } else {
            // 操作失败，重新获取关注状态
            const checkResponse = await checkFollowStatus(this.userInfo.userId);
            this.isFollowed = checkResponse.data?.isFollowing === true;

            uni.showToast({
              title: result.message || "操作失败",
              icon: "none",
            });
          }
        } else {
          // 调用关注API
          const result = await followUser(this.userInfo.userId);

          if (result.code === 200) {
            // 操作成功，更新UI状态
            this.isFollowed = true;

            uni.showToast({
              title: "关注成功",
              icon: "success",
            });
          } else {
            // 操作失败，重新获取关注状态
            const checkResponse = await checkFollowStatus(this.userInfo.userId);
            this.isFollowed = checkResponse.data?.isFollowing === true;

            uni.showToast({
              title: result.message || "操作失败",
              icon: "none",
            });
          }
        }

        // 隐藏加载提示
        uni.hideLoading();

        // 强制刷新UI
        this.$forceUpdate();

        // 通知父组件关注状态已更新
        this.$emit("follow-status-changed", {
          userId: this.userInfo.userId,
          isFollowed: this.isFollowed,
        });

        // 更新userInfo中的isFollowed属性，确保数据同步
        this.$emit("update:userInfo", {
          ...this.userInfo,
          isFollowed: this.isFollowed,
        });
      } catch (error) {
        uni.hideLoading();

        // 发生错误时，重新获取关注状态
        try {
          const checkResponse = await checkFollowStatus(this.userInfo.userId);
          this.isFollowed = checkResponse.data?.isFollowing === true;
        } catch (checkError) {
          // 如果获取状态也失败，则保持当前状态
        }

        uni.showToast({
          title: "操作失败，请稍后再试",
          icon: "none",
        });

        // 强制刷新UI
        this.$forceUpdate();

        // 更新userInfo中的isFollowed属性，确保数据同步
        this.$emit("update:userInfo", {
          ...this.userInfo,
          isFollowed: this.isFollowed,
        });
      }
    },

    // 选择背景图片
    chooseBackgroundImage() {
      if (this.isUploading) {
        uni.showToast({
          title: "正在上传中，请稍候",
          icon: "none",
        });
        return;
      }

      uni.chooseImage({
        count: 1, // 只选择一张图片
        sizeType: ["compressed"], // 压缩图片
        sourceType: ["album", "camera"], // 从相册或相机选择
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.uploadBackgroundImage(tempFilePath);
        },
        fail: (err) => {
          // 选择图片失败
        },
      });
    },

    // 上传背景图片
    async uploadBackgroundImage(filePath) {
      try {
        this.isUploading = true;

        uni.showLoading({
          title: "上传中...",
          mask: true,
        });

        // 构建完整的上传URL
        const fullUploadUrl = getFullUrl(API_PATHS.USER_BACKGROUND_UPLOAD);

        // 执行上传任务
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            uni.uploadFile({
              url: fullUploadUrl,
              filePath: filePath,
              name: "backgroundFile",
              formData: {
                userId: this.userInfo.userId,
                returnFullUrl: "true", // 请求后端返回完整URL
                baseUrl: getFullUrl(""), // 提供基础URL给后端
              },
              success: (uploadRes) => {
                try {
                  // 解析响应数据
                  const result =
                    typeof uploadRes.data === "string"
                      ? JSON.parse(uploadRes.data)
                      : uploadRes.data;

                  resolve(result);
                } catch (parseError) {
                  reject(new Error("解析响应数据失败"));
                }
              },
              fail: (err) => {
                reject(err);
              },
            });
          });

          uni.hideLoading();

          if (uploadResult && uploadResult.code === 200) {
            // 更新本地展示的背景图
            // 获取背景URL
            let backgroundUrl = uploadResult.data.backgroundUrl;

            // 如果是相对URL，添加baseURL
            if (backgroundUrl && backgroundUrl.startsWith("/")) {
              backgroundUrl = getFullUrl(backgroundUrl);
            }

            this.$emit("update:userInfo", {
              ...this.userInfo,
              backgroundImage: backgroundUrl,
            });

            uni.showToast({
              title: "背景上传成功",
              icon: "success",
            });

            // 通知页面刷新
            this.$emit("background-updated", backgroundUrl);
          } else {
            throw new Error(uploadResult?.message || "上传失败");
          }
        } catch (uploadError) {
          throw uploadError;
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || "上传失败",
          icon: "none",
        });
      } finally {
        this.isUploading = false;
      }
    },

    // 编辑个人资料
    editProfile() {
      uni.navigateTo({
        url: "/pages/personal-data/personal-data",
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

      uni.showLoading({
        title: "更新中...",
        mask: true,
      });

      try {
        const result = await updateUserBio(
          this.newBio.trim(),
          this.userInfo.userId
        );

        if (result.success) {
          // 更新本地显示的简介
          this.$emit("update:userInfo", {
            ...this.userInfo,
            bio: this.newBio.trim(),
          });

          uni.showToast({
            title: "简介更新成功",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: result.message || "简介更新失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "简介更新失败",
          icon: "none",
        });
      } finally {
        uni.hideLoading();
        this.hideBioModal();
      }
    },
  },
  async mounted() {
    if (this.userInfo.userId && !this.isCurrentUser) {
      try {
        // 每次组件挂载时都通过API查询最新的关注状态
        const currentUser = uni.getStorageSync("userInfo");
        if (currentUser && currentUser.userId) {
          // 显示加载状态
          uni.showLoading({
            title: "加载中...",
            mask: false,
          });

          const response = await checkFollowStatus(this.userInfo.userId);

          uni.hideLoading();

          if (response.code === 200) {
            // 新的API响应格式中，关注状态在response.data.isFollowing中
            this.isFollowed = response.data?.isFollowing === true;

            // 通知父组件更新关注状态
            this.$emit("update:userInfo", {
              ...this.userInfo,
              isFollowed: this.isFollowed,
            });
          } else {
            // 如果API查询失败，则使用传入的状态
            this.isFollowed = Boolean(this.userInfo.isFollowed);
          }
        } else {
          // 未登录，使用传入的状态
          this.isFollowed = Boolean(this.userInfo.isFollowed);
        }
      } catch (error) {
        uni.hideLoading();
        // 如果出错，则使用传入的状态
        this.isFollowed = Boolean(this.userInfo.isFollowed);
      }

      // 强制刷新UI
      this.$forceUpdate();
    }
  },
};
</script>

<style>
.profile-header {
  position: relative;
  width: 100%;
}

.header-background {
  width: 100%;
  height: 340rpx;
  overflow: hidden;
  position: relative;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* 右上角修改背景按钮 */
.edit-btn-corner {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 25rpx;
  padding: 6rpx 16rpx;
  font-size: 22rpx;
  color: #333;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
  border: 1rpx solid rgba(255, 255, 255, 0.9);
}

.edit-btn-corner:active {
  background-color: rgba(240, 240, 240, 0.95);
  transform: scale(0.97);
}

.user-info {
  position: relative;
  padding: 80rpx 30rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
}

.avatar-container {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  border: 4rpx solid #fff;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  position: absolute;
  top: -80rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  background-color: #fff;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-details {
  width: 100%;
  display: flex;
  margin-top: 20rpx;
  flex-direction: column;
  align-items: center;
}

.username {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.signature-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60rpx;
  line-height: 1.4;
}

.signature {
  font-size: 26rpx;
  color: #666;
  text-align: center;
}

.edit-bio-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

.follow-btn {
  width: 140rpx;
  height: 56rpx;
  border-radius: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26rpx;
  margin-top: 10rpx;
  transition: all 0.3s;
  background-color: #1296db;
  color: #fff;
  box-shadow: 0 2rpx 6rpx rgba(18, 150, 219, 0.2);
}

.follow-btn:active {
  transform: scale(0.96);
  opacity: 0.9;
}

.followed {
  background-color: #f5f5f5;
  color: #666;
  border: 1rpx solid #eee;
  box-shadow: none;
}

/* 编辑资料按钮 */
.profile-edit-btn {
  margin-top: 20rpx;
  padding: 6rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666;
  border: 1rpx solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-edit-btn:active {
  background-color: #ebebeb;
}

/* 编辑简介弹窗 - 黑白主题 */
.bio-popup-content {
  background-color: #ffffff;
  border-radius: 16rpx;
  width: 330px;
  max-width: 600rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.bio-popup-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.bio-popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #000000;
  text-align: center;
  display: block;
}

.bio-popup-body {
  padding: 30rpx;
}

.bio-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333333;
  background-color: #fafafa;
  box-sizing: border-box;
}

.bio-count {
  font-size: 24rpx;
  color: #999999;
  margin-top: 16rpx;
  text-align: right;
  display: block;
}

.bio-popup-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.bio-btn {
  flex: 1;
  height: 90rpx;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0;
}

.bio-btn-cancel {
  background-color: #ffffff;
  color: #666666;
  border-right: 1rpx solid #f0f0f0;
}

.bio-btn-confirm {
  background-color: #000000;
  color: #ffffff;
}

.bio-btn-cancel:active {
  background-color: #f5f5f5;
}

.bio-btn-confirm:active {
  background-color: #333333;
}
</style>
