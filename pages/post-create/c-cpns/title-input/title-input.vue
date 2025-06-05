<template>
  <view class="title-input-container">
    <view class="title-label">标题</view>
    <input
      class="title-field"
      type="text"
      v-model="title"
      placeholder="请输入帖子标题"
      maxlength="50"
      @input="handleTitleChange"
    />
    <view class="title-counter">{{ title.length }}/50</view>
  </view>
</template>

<script>
export default {
  name: "TitleInput",
  props: {
    initialTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: this.initialTitle || "",
    };
  },
  methods: {
    handleTitleChange() {
      this.$emit("update:title", this.title);
    },
    // 供父组件调用，设置标题值
    setTitle(value) {
      this.title = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.title-input-container {
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  position: relative;

  .title-label {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
    color: #333;
  }

  .title-field {
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    padding: 0 10rpx;
    border-bottom: 1px solid #eee;
  }

  .title-counter {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}
</style>
