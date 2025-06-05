<template>
  <view class="submit-button-container">
    <button
      class="submit-btn"
      :disabled="disabled"
      :loading="loading"
      @click="handleSubmit"
    >
      {{ loading ? "发布中..." : "发布帖子" }}
    </button>
  </view>
</template>

<script>
export default {
  name: "SubmitButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSubmit() {
      if (!this.disabled && !this.loading) {
        this.$emit("submit");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-button-container {
  padding: 40rpx 20rpx;

  .submit-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #0066cc;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 45rpx;

    &:active {
      opacity: 0.8;
    }

    &[disabled] {
      background-color: #cccccc;
      opacity: 0.6;
    }
  }
}
</style>
