<template>
  <view class="profile-tabs">
    <view
      class="tab-item"
      :class="{ active: activeTab === 'posts' }"
      @click="changeTab('posts')"
    >
      <text>发布</text>
      <view class="tab-indicator" v-if="activeTab === 'posts'"></view>
    </view>

    <view
      class="tab-item"
      :class="{ active: activeTab === 'likes' }"
      @click="changeTab('likes')"
    >
      <text>喜欢</text>
      <view class="tab-indicator" v-if="activeTab === 'likes'"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ProfileTabs",
  props: {
    activeTab: {
      type: String,
      default: "posts",
    },
  },
  methods: {
    changeTab(tab) {
      if (this.activeTab !== tab) {
        this.$emit("tab-change", tab);
      }
    },
  },
};
</script>

<style>
.profile-tabs {
  display: flex;
  background-color: #fff;
  height: 80rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #333;
  font-weight: bold;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 40rpx;
  height: 4rpx;
  background-color: #1296db;
  border-radius: 2rpx;
}
</style>
