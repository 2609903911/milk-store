<template>
  <scroll-view class="scroll-container" scroll-y>
    <view class="container">
      <!-- 轮播图区域 -->
      <view class="banner-wrapper">
        <!-- 轮播图背景 -->
        <view class="banner-bg">
          <image
            v-for="(item, index) in bannerList"
            :key="index"
            class="banner-bg-image"
            :src="item.image"
            mode="aspectFill"
            :style="{
              opacity: currentSwiper === index ? 1 : 0,
              backgroundColor: item.bgColor,
            }"
          ></image>
          <view class="banner-bg-mask"></view>
        </view>

        <!-- 轮播图内容 -->
        <swiper
          class="banner-swiper"
          circular
          :indicator-dots="false"
          autoplay
          :interval="3000"
          @change="swiperChange"
          @click="navigateToOrder"
        >
          <swiper-item v-for="(item, index) in bannerList" :key="index">
            <view class="banner-item">
              <view class="banner-content">
                <view class="banner-tag">
                  <text>{{ item.tag }}</text>
                </view>
                <view class="banner-title">
                  <text v-for="(line, idx) in item.title" :key="idx">{{
                    line
                  }}</text>
                </view>
                <view class="banner-desc">
                  <text v-for="(line, idx) in item.desc" :key="idx">{{
                    line
                  }}</text>
                </view>
                <view class="order-btn" @click.stop="navigateToOrder">
                  <text
                    >立即下单
                    <uni-icons
                      type="arrowright"
                      size="16"
                      color="#fff"
                    ></uni-icons>
                  </text>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <!-- 自定义进度条指示器 -->
        <view class="custom-indicator">
          <view
            v-for="(item, index) in bannerList"
            :key="index"
            class="indicator-dot"
            :class="{ active: currentSwiper === index }"
          ></view>
        </view>
      </view>

      <!-- 顶部用户信息栏 -->
      <view class="user-info-wrapper">
        <view class="user-info">
          <view class="avatar-container">
            <image
              class="avatar"
              :src="userData.avatar || '/static/images/avatar.png'"
              @error="handleAvatarError"
            ></image>
          </view>
          <view class="user-greeting">
            <text>Hi~{{ userData.nickname }}</text>
          </view>
          <view class="coupon-btn" @click="navigateToCoupons">
            <text
              >优惠券
              {{
                userData.coupons
                  ? userData.coupons.filter(
                      (coupon) => coupon.status === "valid"
                    ).length
                  : 0
              }}</text
            >
          </view>
        </view>
      </view>

      <!-- 服务选择区 -->
      <view class="service-container">
        <view class="service-item" @click="navigateToOrder">
          <image
            class="service-full-image"
            src="/static/images/tostore.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="service-divider"></view>
        <view class="service-item">
          <image
            class="service-full-image"
            src="/static/images/takeout.png"
            mode="widthFix"
          ></image>
        </view>
      </view>

      <!-- 功能区 -->
      <view class="function-container">
        <view class="function-item" @click="navigateToPandaStore">
          <image
            class="function-icon"
            src="/static/images/panda-store.png"
          ></image>
          <text>熊猫币商城</text>
        </view>
        <view class="function-item">
          <image
            class="function-icon"
            src="/static/images/post.png"
            @click="navigateToPost"
          ></image>
          <text>我的文章</text>
        </view>
        <view class="function-item" @click="navigateToTogetherDrink">
          <image
            class="function-icon"
            src="/static/images/double-cups.png"
          ></image>
          <text>一起喝</text>
        </view>
        <view class="function-item" @click="navigateToAiChat">
          <image class="function-icon" src="/static/images/ai-chat.png"></image>
          <text>Panda管家</text>
        </view>
      </view>

      <!-- 优惠活动区 -->
      <view class="promo-container">
        <!-- 左侧 - 入社群享30元专属券包 -->
        <view class="promo-left">
          <view class="promo-content">
            <view class="promo-title">
              <text>入社群享30元专属券包</text>
            </view>
            <view class="promo-desc">
              <text>天天9.9元喝奶茶</text>
            </view>
            <view class="promo-btn">
              <text>点击入群</text>
            </view>
          </view>
          <view class="promo-image">
            <image
              src="/static/images/promo-image.png"
              mode="aspectFit"
            ></image>
          </view>
        </view>

        <!-- 右侧 - 上下结构 -->
        <view class="promo-right">
          <!-- 上部分 - 周一天天9.9元喝 -->
          <view class="promo-right-top">
            <view class="promo-content">
              <view class="promo-title">
                <text>周一天天9.9元喝</text>
              </view>
              <view class="promo-desc">
                <text>指定饮品9.9元券包</text>
              </view>
              <view class="promo-btn">
                <text>立即领券></text>
              </view>
            </view>
          </view>

          <!-- 下部分 - 会员邀新有礼 -->
          <view class="promo-right-bottom">
            <view class="promo-content">
              <view class="promo-title">
                <text>会员邀新有礼</text>
              </view>
              <view class="promo-desc">
                <text>邀新友得苗条保温杯</text>
              </view>
              <view class="promo-btn">
                <text>立即邀请></text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 会员新鲜事 -->
      <view class="member-news">
        <view class="member-tag">
          <text>会员新鲜事</text>
        </view>
        <!-- 替换为轮播图 -->
        <swiper
          class="member-swiper"
          circular
          autoplay
          :interval="2000"
          indicator-dots
          indicator-active-color="#fff"
          indicator-color="rgba(255, 255, 255, 0.5)"
        >
          <swiper-item v-for="(item, index) in newsImages" :key="index">
            <image
              class="member-bg-image"
              :src="item"
              mode="aspectFill"
            ></image>
          </swiper-item>
        </swiper>
      </view>

      <!-- 品牌动态 -->
      <view class="brand-news">
        <view class="brand-header">
          <view class="brand-label-box">
            <text class="brand-label">品牌动态</text>
          </view>
          <text class="brand-more">点击了解></text>
        </view>
        <view class="brand-content">
          <view class="brand-title">
            <text class="brand-name">Panda茶社诚邀</text>
            <text class="brand-highlight">加盟</text>
          </view>
          <view class="brand-desc">招商热线：投资有风险</view>
        </view>
      </view>

      <!-- 会员福利区 -->
      <!-- 已移至优惠活动区右下方 -->
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { userData, initUserData } from "../../utils/userData";
import { bannerApi } from "../../utils/api";

// 初始化用户数据
onMounted(() => {
  initUserData();
  // 从后端获取轮播图数据
  fetchBannerData();
});

// 每次显示页面时刷新数据
onShow(() => {
  initUserData();
  fetchBannerData();
});

const currentSwiper = ref(0);
const swiperChange = (e) => {
  currentSwiper.value = e.detail.current;
};

// 轮播图数据
const bannerList = ref([]);

// 会员新鲜事轮播图数据
const newsImages = ref([
  "/static/images/news1.png",
  "/static/images/news2.png",
  "/static/images/news3.gif",
  "/static/images/news4.png",
]);

// 从后端获取轮播图数据
const fetchBannerData = async () => {
  try {
    const banners = await bannerApi.fetchBanners();
    bannerList.value = banners;
  } catch (error) {
    // 请求失败时加载本地备用数据
    loadLocalBannerData();
  }
};

// 本地备用数据，当API请求失败时使用
const loadLocalBannerData = () => {
  bannerList.value = [
    {
      tag: "超级蔬食 轻畅系列焕新",
      title: ["早畅晚轻", "24h轻畅循环"],
      desc: ["鲜果每日鲜榨", "一杯轻启肠道SPA"],
      image: "/static/images/scroll01.png",
      bgColor: "#8a9a5b", // 橄榄绿色背景
    },
    {
      tag: "桑葚系列",
      title: ["三重花青素", "自然好气色"],
      desc: ["爆款回归 一年卖出一千万杯！", "三重莓果 唤醒春日好气色"],
      image: "/static/images/scroll02.jpg",
      bgColor: "#e6f7ff", // 浅蓝色背景
    },
    {
      tag: "人气推荐",
      title: ["生椰系列", "醇香浓郁"],
      desc: ["精选海南生椰乳", "口感香浓醇厚"],
      image: "/static/images/scroll03.jpg",
      bgColor: "#f9e7d2", // 浅橙色背景
    },
    {
      tag: "季节限定",
      title: ["多肉葡萄", "果肉满满"],
      desc: ["精选当季葡萄", "多重口感层次"],
      image: "/static/images/scroll04.jpg",
      bgColor: "#e6d7f2", // 浅紫色背景
    },
  ];
};

// 处理头像加载错误
const handleAvatarError = () => {
  // 如果头像加载失败，使用默认头像
  if (userData.avatar !== "/static/images/avatar.png") {
    userData.avatar = "/static/images/avatar.png";
  }
};

// 导航到优惠券页面
const navigateToCoupons = () => {
  uni.navigateTo({
    url: "/pages/coupons/coupons",
  });
};

// 跳转到点单页面
const navigateToOrder = () => {
  uni.switchTab({
    url: "/pages/order/order",
  });
};

// 跳转到熊猫币商城页面
const navigateToPandaStore = () => {
  uni.navigateTo({
    url: "/pages/panda-store/panda-store",
  });
};

// 跳转到我的文章页面
const navigateToPost = () => {
  uni.navigateTo({
    url: "/pages/post-profile/post-profile",
  });
};

// 跳转到一起喝页面
const navigateToTogetherDrink = () => {
  uni.navigateTo({
    url: "/pages/together-drink/together-drink",
  });
};

// 跳转到Panda管家页面
const navigateToAiChat = () => {
  uni.navigateTo({
    url: "/pages/ai-chat/index",
  });
};
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 100vh;
  width: 100%;
}

.container {
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
}

// 轮播图包装器
.banner-wrapper {
  position: relative;
  width: 100%;
  height: 550rpx;
  overflow: hidden;
  margin-top: 0;
}

// 轮播图背景
.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: background-color 0.5s ease;
}

.banner-bg-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease;
}

.banner-bg-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 20%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 5;
  pointer-events: none;
}

.banner-bg::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 4;
  pointer-events: none;
}

// 轮播图区域
.banner-swiper {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 3;
}

.banner-item {
  display: flex;
  height: 100%;
  padding: 30rpx;
  padding-top: 80rpx; // 减小顶部padding，因为用户信息栏已移出
}

.banner-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.banner-tag {
  display: inline-block;
  padding: 5rpx 20rpx;
  font-size: 24rpx;
  margin-bottom: 20rpx;
  color: #333;
  background-color: transparent;
  position: relative;
  width: fit-content;
}

.banner-tag::before,
.banner-tag::after {
  content: "";
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  border-color: #333;
  border-style: solid;
}

.banner-tag::before {
  top: 0;
  left: 0;
  border-width: 1px 0 0 1px;
}

.banner-tag::after {
  bottom: 0;
  right: 0;
  border-width: 0 1px 1px 0;
}

.banner-title {
  font-size: 48rpx;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 20rpx;
  color: #333;
  font-family: cursive, "PingFang SC", "Microsoft YaHei", serif;
  text-shadow: none;

  text {
    display: block;
  }
}

.banner-desc {
  font-size: 24rpx;
  margin-bottom: 30rpx;
  color: #333;
  text-shadow: none;

  text {
    display: block;
    line-height: 1.5;
  }
}

.order-btn {
  display: inline-block;
  padding: 10rpx 30rpx;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 30rpx;
  font-size: 26rpx;
  border: 1px solid rgba(255, 255, 255, 0.4);
  max-width: 160rpx;
  text-align: center;
}

// 顶部用户信息栏
.user-info-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: -50rpx;
  z-index: 10;
  padding: 0 0.85rem;
}

.user-info {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.avatar-container {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  background-color: #1296db;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-greeting {
  flex: 1;
  margin-left: 20rpx;
  font-size: 25rpx;
  font-weight: 500;
  color: #333;
}

.coupon-btn {
  padding: 18rpx 30rpx;
  background-color: #ebc93a;
  color: #7c592b;
  border-radius: 10rpx;
  font-size: 28rpx;
}

// 服务选择区
.service-container {
  display: flex;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.service-item {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.service-full-image {
  width: 100%;
  height: auto;
}

.service-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background-color: #a67c52;
  color: #fff;
  font-size: 20rpx;
  padding: 5rpx 10rpx;
  border-radius: 10rpx;
}

.service-divider {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 65%;
  background-color: #ddd;
}

// 功能区
.function-container {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 0;
  margin: 0 20rpx 20rpx 20rpx;
}

.function-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20rpx;
}

.function-icon {
  width: 65rpx;
  height: 65rpx;
  margin-bottom: 10rpx;
}

// 优惠活动区
.promo-container {
  display: flex;
  margin: 0 20rpx 0 20rpx;
  height: 11.125rem;
}

.promo-left {
  width: 50%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  margin-right: 10rpx;
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

.promo-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-left: 10rpx;
  height: 100%;
  box-sizing: border-box;
}

.promo-right-top {
  flex: 1;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.promo-right-bottom {
  flex: 1;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  position: relative;
}

.promo-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.promo-title {
  font-size: 0.875rem;
  font-weight: bolder;
  font-family: fangsong;
  margin-bottom: 0.25rem;
}

.promo-desc {
  font-size: 22rpx;
  color: #a67c52;
  margin-bottom: 16rpx;
}

.promo-btn {
  display: inline-block;
  padding: 8rpx 16rpx;
  background-color: #c4ae87;
  color: #fff;
  border-radius: 30rpx;
  font-size: 22rpx;
  width: fit-content;
}

.promo-right .promo-btn {
  background-color: transparent;
  color: #c6b28d;
  padding: 0;
  border-radius: 0;
}

.promo-image {
  position: absolute;
  bottom: 38%;
  right: 50%;
  transform: translate(50%, 50%);
  width: 160rpx;
  height: 160rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

.promo-left .promo-image {
  bottom: 30%;
  right: 30%;
  transform: translateY(50%);
}

// 自定义进度条指示器
.custom-indicator {
  position: absolute;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 160rpx;
  height: 6rpx;
  z-index: 30;
}

.indicator-dot {
  width: 30rpx;
  height: 6rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3rpx;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background-color: #ffffff;
}

// 会员新鲜事
.member-news {
  margin: 20rpx 20rpx 0 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 0;
  height: 280rpx;
  position: relative;
  overflow: hidden;
}

.member-tag {
  position: absolute;
  top: 15rpx;
  right: 15rpx;
  background-color: rgba(43, 120, 245, 0.9);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  z-index: 3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.member-swiper {
  height: 100%;
  width: 100%;
}

.member-bg-image {
  width: 100%;
  height: 100%;
}

// 品牌动态
.brand-news {
  margin: 20rpx 20rpx 0rpx 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.brand-label-box {
  display: inline-block;
  padding: 5rpx 10rpx;
  background-color: rgba(43, 120, 245, 0.9);
  border-radius: 5rpx;
}

.brand-label {
  font-size: 22rpx;
  font-weight: normal;
  color: #fff;
}

.brand-more {
  color: #c6b28d;
  font-size: 22rpx;
}

.brand-content {
  display: flex;
  flex-direction: column;
  padding: 10rpx 0;
}

.brand-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.brand-name {
  color: #333;
}

.brand-highlight {
  color: #c6b28d;
}

.brand-desc {
  font-size: 22rpx;
  color: #999;
}
</style>
