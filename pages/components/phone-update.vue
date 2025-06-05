<template>
  <view class="phone-update-container" v-if="visible">
    <!-- 遮罩层 -->
    <view class="mask" @click="cancel"></view>

    <!-- 弹窗内容 -->
    <view class="popup-content" @click.stop>
      <view class="popup-header">
        <text class="popup-title">修改手机号</text>
        <view class="close-btn" @click="cancel">
          <uni-icons type="closeempty" size="20" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 表单内容 -->
      <view class="form-content">
        <!-- 手机号输入 -->
        <view class="form-item">
          <view class="input-label">新手机号</view>
          <view class="input-wrapper">
            <input
              type="text"
              class="phone-input"
              placeholder="请输入手机号"
              maxlength="11"
              v-model="phone"
              @input="validatePhone"
            />
          </view>
        </view>

        <!-- 验证码输入 -->
        <view class="form-item">
          <view class="input-label">验证码</view>
          <view class="input-wrapper code-wrapper">
            <input
              type="text"
              class="code-input"
              placeholder="请输入验证码"
              maxlength="6"
              v-model="code"
              @input="handleCodeInput"
            />
            <view
              class="code-btn"
              :class="{
                'code-btn-disabled': !isPhoneValid || isCounting,
              }"
              @click="getVerificationCode"
            >
              {{ codeButtonText }}
            </view>
          </view>
        </view>

        <!-- 提交按钮 -->
        <view
          class="submit-btn"
          :class="{ 'submit-btn-disabled': !isFormValid }"
          @click="submitForm"
        >
          确认修改
        </view>

        <!-- 提示信息 -->
        <view class="tips">
          <text>* 修改手机号将同时变更账号登录手机号</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { post, get } from "../../utils/request";
import { API_PATHS } from "../../utils/api/config";

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  currentPhone: {
    type: String,
    default: "",
  },
});

// 定义组件事件
const emit = defineEmits(["update:visible", "success", "cancel"]);

// 表单数据
const phone = ref("");
const code = ref("");
const isPhoneValid = ref(false);
const isCounting = ref(false);
const countdown = ref(60);
const codeButtonText = ref("获取验证码");

// 监听手机号变化
watch(
  () => props.currentPhone,
  (newValue) => {
    // 设置默认值但不显示完整手机号
    if (newValue && newValue.length >= 11) {
      phone.value = "";
    }
  },
  { immediate: true }
);

// 计算表单是否有效
const isFormValid = computed(() => {
  return isPhoneValid.value && code.value.length === 6;
});

// 验证手机号格式
const validatePhone = () => {
  // 确保只有数字
  phone.value = phone.value.replace(/\D/g, "");

  // 限制长度不超过11位
  if (phone.value.length > 11) {
    phone.value = phone.value.slice(0, 11);
  }

  // 验证手机号格式
  const phoneReg = /^1[3-9]\d{9}$/;
  isPhoneValid.value = phoneReg.test(phone.value);
};

// 处理验证码输入
const handleCodeInput = () => {
  // 确保只有数字
  code.value = code.value.replace(/\D/g, "");

  // 限制长度不超过6位
  if (code.value.length > 6) {
    code.value = code.value.slice(0, 6);
  }
};

// 获取验证码
const getVerificationCode = async () => {
  if (!isPhoneValid.value || isCounting.value) {
    return;
  }

  try {
    // 使用URL查询参数格式直接构建URL
    const url = `${API_PATHS.AUTH_SEND_CODE}?phone=${encodeURIComponent(
      phone.value
    )}&type=update_phone`;

    // 调用发送验证码API
    const response = await get(
      url,
      {},
      {
        loading: true,
        loadingText: "发送中...",
      }
    );

    // 判断发送是否成功
    if (
      response &&
      (response.code === 200 || (response.data && response.data.code === 200))
    ) {
      uni.showToast({
        title: "验证码已发送",
        icon: "success",
      });

      // 开始倒计时
      startCountdown();
    } else {
      uni.showToast({
        title: response?.message || "发送失败，请重试",
        icon: "none",
      });
    }
  } catch (error) {
    uni.showToast({
      title: "网络异常，请稍后再试",
      icon: "none",
    });
  }
};

// 倒计时逻辑
const startCountdown = () => {
  isCounting.value = true;
  countdown.value = 60;
  codeButtonText.value = `${countdown.value}秒后重发`;

  const timer = setInterval(() => {
    countdown.value--;
    codeButtonText.value = `${countdown.value}秒后重发`;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
      codeButtonText.value = "获取验证码";
    }
  }, 1000);
};

// 提交表单
const submitForm = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    // 从本地存储获取用户ID
    const userInfo = uni.getStorageSync("userInfo");
    if (!userInfo || !userInfo.userId) {
      uni.showToast({
        title: "用户未登录",
        icon: "none",
      });
      return;
    }

    // 调用更新手机号API
    const response = await post(
      API_PATHS.USER_UPDATE_PHONE,
      {
        userId: userInfo.userId,
        phone: phone.value,
        code: code.value,
      },
      {
        loading: true,
        loadingText: "提交中...",
      }
    );

    // 判断更新是否成功
    if (
      response &&
      (response.code === 200 || (response.data && response.data.code === 200))
    ) {
      uni.showToast({
        title: "手机号修改成功",
        icon: "success",
      });

      // 成功后发送事件并关闭弹窗
      emit("success", phone.value);
      closePopup();
    } else {
      uni.showToast({
        title: response?.data.message || "修改失败，请重试",
        icon: "none",
      });
    }
  } catch (error) {
    uni.showToast({
      title: "网络异常，请稍后再试",
      icon: "none",
    });
  }
};

// 取消操作
const cancel = () => {
  emit("cancel");
  closePopup();
};

// 关闭弹窗
const closePopup = () => {
  emit("update:visible", false);
  // 重置表单
  phone.value = "";
  code.value = "";
};
</script>

<style lang="scss" scoped>
.phone-update-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
  width: 90%;
  max-width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  z-index: 1000;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #f5f5f5;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.close-btn {
  padding: 10rpx;
}

.form-content {
  padding: 30rpx 0;
}

.form-item {
  margin-bottom: 30rpx;
}

.input-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.input-wrapper {
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  padding: 16rpx;
}

.phone-input,
.code-input {
  font-size: 28rpx;
  color: #333;
  width: 100%;
  height: 60rpx;
}

.code-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-input {
  flex: 1;
}

.code-btn {
  padding: 0 20rpx;
  height: 60rpx;
  background-color: #0066cc;
  color: #fff;
  font-size: 26rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-btn-disabled {
  background-color: #cccccc;
  color: #fff;
}

.submit-btn {
  height: 90rpx;
  background-color: #0066cc;
  color: #fff;
  font-size: 30rpx;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx 0;
}

.submit-btn-disabled {
  background-color: #cccccc;
}

.tips {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}
</style>
