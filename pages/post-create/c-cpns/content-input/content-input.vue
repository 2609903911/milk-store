<template>
  <view class="content-input-container">
    <view class="content-header">
      <view class="content-label">内容</view>
      <view class="panda-btn" @tap="showPandaPopup">
        <text class="panda-icon">🐼</text>
        <text class="panda-text">Panda管家</text>
      </view>
    </view>
    <textarea
      class="content-field"
      v-model="content"
      placeholder="请输入帖子内容..."
      maxlength="1000"
      @input="handleContentChange"
    />
    <view class="content-counter">{{ content.length }}/1000</view>

    <!-- 自定义弹窗 -->
    <view class="custom-modal" v-if="showModal" @tap.stop="closePandaPopup">
      <view class="modal-mask"></view>
      <view class="modal-container" @tap.stop>
        <view class="modal-box">
          <view class="modal-header">
            <text class="modal-title">Panda管家</text>
          </view>
          <view class="modal-content">
            <view class="modal-icon">🐼</view>
            <text class="modal-text"
              >Panda管家可以帮您智能生成文章内容，是您写内容的好帮手！</text
            >
            <text class="modal-text">是否前往Panda管家页面？</text>
          </view>
          <view class="modal-footer">
            <button class="modal-btn cancel-btn" @tap="closePandaPopup">
              取消
            </button>
            <button class="modal-btn confirm-btn" @tap="goPandaAssistant">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ContentInput",
  props: {
    initialContent: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: this.initialContent || "",
      showModal: false,
    };
  },
  methods: {
    handleContentChange() {
      this.$emit("update:content", this.content);
    },
    // 供父组件调用，设置内容值
    setContent(value) {
      this.content = value;
    },
    // 显示Panda管家弹窗
    showPandaPopup() {
      this.showModal = true;
    },
    // 关闭Panda管家弹窗
    closePandaPopup() {
      this.showModal = false;
    },
    // 跳转到Panda管家页面
    goPandaAssistant() {
      this.closePandaPopup();
      // 跳转到Panda管家页面
      uni.navigateTo({
        url: "/pages/ai-chat/index",
        fail: (err) => {
          // 如果页面不存在，提示用户
          uni.showToast({
            title: "Panda管家页面开发中...",
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content-input-container {
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  position: relative;

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .content-label {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }

    .panda-btn {
      display: flex;
      align-items: center;
      background: linear-gradient(to right, #e0f2ff, #f0f9ff);
      padding: 8rpx 16rpx;
      border-radius: 30rpx;
      border: 1px solid #d0e8ff;
      box-shadow: 0 2rpx 8rpx rgba(0, 102, 204, 0.1);
      position: relative;
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 1rpx 4rpx rgba(0, 102, 204, 0.1);
      }

      .panda-icon {
        font-size: 32rpx;
        margin-right: 8rpx;
      }

      .panda-text {
        font-size: 24rpx;
        color: #0066cc;
        font-weight: bold;
      }

      .panda-tip {
        position: absolute;
        bottom: -22rpx;
        left: 50%;
        transform: translateX(-50%);
        font-size: 20rpx;
        color: #0066cc;
        background-color: #fff;
        padding: 0 8rpx;
        border-radius: 10rpx;
        white-space: nowrap;
      }
    }
  }

  .content-field {
    width: 100%;
    height: 300rpx;
    font-size: 28rpx;
    padding: 10rpx;
    border: 1px solid #eee;
    border-radius: 8rpx;
  }

  .content-counter {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}

/* 自定义模态弹窗样式 */
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .modal-container {
    position: relative;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    animation: fadeInUp 0.3s ease;
  }

  .modal-box {
    width: 600rpx;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    .modal-header {
      padding: 30rpx;
      text-align: center;
      border-bottom: 1px solid #eee;

      .modal-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .modal-content {
      padding: 40rpx 30rpx;
      text-align: center;

      .modal-icon {
        font-size: 80rpx;
        margin-bottom: 20rpx;
        animation: bounce 2s infinite;
      }

      .modal-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        display: block;
        margin-bottom: 20rpx;
      }
    }

    .modal-footer {
      display: flex;
      border-top: 1px solid #eee;

      .modal-btn {
        flex: 1;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        font-size: 30rpx;
        background-color: #fff;
        border-radius: 0;

        &::after {
          border: none;
        }

        &.cancel-btn {
          color: #999;
          border-right: 1px solid #eee;
        }

        &.confirm-btn {
          color: #0066cc;
          font-weight: bold;
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20rpx);
  }
  60% {
    transform: translateY(-10rpx);
  }
}
</style>
