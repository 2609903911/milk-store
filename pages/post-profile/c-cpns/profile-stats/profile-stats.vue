<template>
  <view class="profile-stats">
    <view class="stats-item" @click="navigateTo('followers')">
      <text class="stats-value">{{ formatNumber(statsData.followers) }}</text>
      <text class="stats-label">粉丝</text>
    </view>

    <view class="stats-divider"></view>

    <view class="stats-item" @click="navigateTo('following')">
      <text class="stats-value">{{ formatNumber(statsData.following) }}</text>
      <text class="stats-label">关注</text>
    </view>

    <view class="stats-divider"></view>

    <view class="stats-item">
      <text class="stats-value">{{ formatNumber(statsData.likes) }}</text>
      <text class="stats-label">获赞</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "ProfileStats",
  props: {
    statsData: {
      type: Object,
      default: () => ({
        followers: 0,
        following: 0,
        likes: 0,
      }),
    },
  },
  methods: {
    // 格式化数字，超过一万显示为x.x万
    formatNumber(num) {
      if (!num) return "0";

      if (num < 10000) {
        return num.toString();
      } else {
        const formattedNum = (num / 10000).toFixed(1);
        // 如果小数点后是0，则去掉小数点和0
        return formattedNum.endsWith(".0")
          ? formattedNum.slice(0, -2) + "万"
          : formattedNum + "万";
      }
    },

    // 导航到粉丝/关注列表页面
    navigateTo(type) {
      // 这里添加跳转到粉丝/关注页面的逻辑

      // 示例代码
      // uni.navigateTo({
      //   url: `/pages/follows/follows?type=${type}&userId=${this.userId}`
      // });

      // 暂时显示提示信息
      uni.showToast({
        title: `${type === "followers" ? "粉丝" : "关注"}列表功能开发中`,
        icon: "none",
      });
    },
  },
};
</script>

<style>
.profile-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30rpx 0;
  background-color: #fff;
  margin: 20rpx 0;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stats-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.stats-label {
  font-size: 24rpx;
  color: #999;
}

.stats-divider {
  width: 1rpx;
  height: 40rpx;
  background-color: #eee;
}
</style>
