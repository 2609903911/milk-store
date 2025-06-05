<template>
  <view class="login-container">
    <!-- 登录图片 -->
    <view class="login-image">
      <image src="/static/images/login-image.png" mode="aspectFit"></image>
    </view>

    <!-- 登录标语 -->
    <view class="login-slogan">首次登录即享新人专属礼</view>

    <!-- 手机号验证码登录表单 -->
    <view class="login-form">
      <view class="form-container">
        <view class="form-item">
          <text class="label">手机号码</text>
          <view class="input-box">
            <input
              class="input"
              type="number"
              v-model="phone"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="label">验证码</text>
          <view class="input-box code-box">
            <input
              class="input"
              type="number"
              v-model="code"
              placeholder="请输入验证码"
              maxlength="6"
            />
            <button
              class="code-btn"
              :disabled="isCounting"
              @click="getVerificationCode"
            >
              {{ isCounting ? `${countdown}s` : "获取验证码" }}
            </button>
          </view>
        </view>
      </view>
      <button class="login-btn" @click="handleLogin">登录</button>
    </view>

    <!-- 暂不登录 -->
    <view class="skip-login" @click="skipLogin"> 暂不登录 </view>

    <!-- 用户协议 -->
    <view class="agreement">
      <view class="checkbox-wrapper" @click="toggleAgree">
        <checkbox
          class="checkbox"
          :checked="isAgree"
          :style="{ transform: 'scale(0.7)' }"
        />
        <text class="agreement-text">
          登录即代表您同意
          <text class="agreement-link" @click.stop="goToUserAgreement"
            >《用户协议》</text
          >
          和
          <text class="agreement-link" @click.stop="goToPrivacyPolicy"
            >《隐私政策》</text
          >
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { authApi } from "@/utils/api";
import { saveUserToStorage } from "@/utils/api/authApi";
import { fetchUserDataFromServer } from "@/utils/userData";

export default {
  data() {
    return {
      phone: "",
      code: "",
      isAgree: false,
      isCounting: false,
      countdown: 60,
      timer: null,
    };
  },
  methods: {
    // 返回上一页
    navBack() {
      uni.navigateBack();
    },

    validatePhone() {
      if (!this.phone) {
        uni.showToast({
          title: "请输入手机号码",
          icon: "none",
        });
        return false;
      }

      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(this.phone)) {
        uni.showToast({
          title: "请输入正确的手机号码",
          icon: "none",
        });
        return false;
      }

      return true;
    },

    validateCode() {
      if (!this.code) {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return false;
      }

      const codeRegex = /^\d{6}$/;
      if (!codeRegex.test(this.code)) {
        uni.showToast({
          title: "请输入6位数字验证码",
          icon: "none",
        });
        return false;
      }

      return true;
    },

    validateAgreement() {
      if (!this.isAgree) {
        uni.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none",
        });
        return false;
      }
      return true;
    },

    async getVerificationCode() {
      // 验证手机号
      if (!this.validatePhone()) {
        return;
      }

      try {
        uni.showLoading({
          title: "发送中...",
        });

        // 使用URL查询参数格式直接构建URL
        const url = `http://localhost:8082/api/auth/code/send?phone=${encodeURIComponent(
          this.phone
        )}&type=login`;

        // 发送POST请求，参数在URL中
        uni.request({
          url: url,
          method: "POST",
          success: (res) => {
            uni.hideLoading();

            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.code === 200) {
                uni.showToast({
                  title: "验证码已发送",
                  icon: "success",
                });

                // 开始倒计时
                this.startCountdown();
              } else {
                uni.showToast({
                  title: res.data.message || "验证码发送失败",
                  icon: "none",
                });
              }
            } else {
              uni.showToast({
                title: res.data?.message || "验证码发送失败",
                icon: "none",
              });
            }
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showToast({
              title: "网络错误，请稍后重试",
              icon: "none",
            });
          },
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || "验证码发送失败，请稍后重试",
          icon: "none",
        });
      }
    },

    startCountdown() {
      // 确保组件已经挂载
      this.$nextTick(() => {
        this.isCounting = true;
        this.countdown = 60;

        // 创建新的定时器
        this.timer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown -= 1;
          } else {
            if (this.timer) {
              clearInterval(this.timer);
              this.timer = null;
              this.isCounting = false;
            }
          }
        }, 1000);
      });
    },

    async handleLogin() {
      // 验证手机号、验证码和协议同意
      if (
        !this.validatePhone() ||
        !this.validateCode() ||
        !this.validateAgreement()
      ) {
        return;
      }

      try {
        uni.showLoading({
          title: "登录中...",
        });

        // 使用URL查询参数格式直接构建URL
        const url = `http://localhost:8082/api/auth/login/code?phone=${encodeURIComponent(
          this.phone
        )}&code=${encodeURIComponent(this.code)}`;

        // 发送POST请求，参数在URL中
        uni.request({
          url: url,
          method: "POST",
          success: async (res) => {
            uni.hideLoading();

            // 检查响应中的code字段 - 服务器成功码为200
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.code === 200) {
                // 获取用户信息和token
                const userData = res.data.data.user;
                const token = res.data.data.token;

                // 只保存用户ID和token到本地存储
                saveUserToStorage(userData, token);

                // 从服务器获取最新的用户数据
                await fetchUserDataFromServer();

                uni.showToast({
                  title: "登录成功",
                  icon: "success",
                });

                // 延迟1.5秒后跳转到首页
                setTimeout(() => {
                  uni.switchTab({
                    url: "/pages/home/home",
                    success: function () {},
                    fail: function (err) {
                      // 如果switchTab失败，尝试使用reLaunch
                      uni.reLaunch({
                        url: "/pages/home/home",
                      });
                    },
                  });
                }, 1500);
              } else {
                // 业务逻辑错误
                uni.showToast({
                  title: res.data.message || "验证码错误",
                  icon: "none",
                });
              }
            } else {
              uni.showToast({
                title: res.data?.message || "登录失败",
                icon: "none",
              });
            }
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showToast({
              title: "网络错误，请稍后重试",
              icon: "none",
            });
          },
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || "登录失败，请稍后重试",
          icon: "none",
        });
      }
    },

    toggleAgree() {
      this.isAgree = !this.isAgree;
    },

    goToUserAgreement() {
      uni.navigateTo({
        url: "/pages/agreement/user-agreement",
      });
    },

    goToPrivacyPolicy() {
      uni.navigateTo({
        url: "/pages/agreement/privacy-policy",
      });
    },

    // 暂不登录
    skipLogin() {
      // 跳转到首页
      uni.switchTab({
        url: "/pages/home/home",
        success: function () {},
        fail: function (err) {
          // 如果switchTab失败，尝试使用reLaunch
          uni.reLaunch({
            url: "/pages/home/home",
          });
        },
      });
    },

    // 组件销毁时清除定时器
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style lang="scss">
.login-container {
  padding: 0 30rpx;
  height: 100vh;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .login-image {
    display: flex;
    justify-content: center;
    margin-top: 200rpx;
    margin-bottom: 40rpx;

    image {
      width: 300rpx;
      height: 220rpx;
    }
  }

  .login-slogan {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
    margin-bottom: 50rpx;
  }

  .login-form {
    .form-container {
      width: 100%;
      margin-bottom: 30rpx;

      .form-item {
        margin-bottom: 20rpx;

        .label {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
          display: block;
        }

        .input-box {
          border: 1px solid #e0e0e0;
          border-radius: 8rpx;
          padding: 10rpx 20rpx;
          display: flex;
          align-items: center;

          .input {
            flex: 1;
            height: 80rpx;
            font-size: 28rpx;
          }
        }
      }

      .code-box {
        display: flex;
        justify-content: space-between;
      }

      .code-btn {
        width: 200rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 26rpx;
        color: #fff;
        background-color: #007aff;
        text-align: center;
        border-radius: 8rpx;
        padding: 0;
        margin: 0;
      }

      .code-btn[disabled] {
        background-color: #ccc;
      }
    }

    .login-btn {
      height: 90rpx;
      background-color: #007aff;
      border-radius: 45rpx;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      margin-top: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .skip-login {
    font-size: 28rpx;
    color: #999;
    text-align: center;
    margin-top: 30rpx;
  }

  .agreement {
    position: absolute;
    bottom: 50rpx;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #999;

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      margin-right: 5rpx;

      .checkbox {
        transform: scale(0.7);
        margin-right: 5rpx;
      }
    }

    .agreement-text {
      font-size: 24rpx;
      color: #666;
    }

    .agreement-link {
      color: #007aff;
      margin-right: 5rpx;
    }
  }

  .debug-info {
    margin-top: 20rpx;
    padding: 10rpx;
    border: 1px dashed #ccc;
    font-size: 24rpx;
    color: #666;
    display: flex;
    flex-direction: column;
  }
}
</style>
