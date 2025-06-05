<template>
  <view class="coupons-container">
    <!-- 顶部标签页 -->
    <view class="tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
      >
        <text>{{ tab }}</text>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <swiper class="coupon-swiper" :current="currentTab" @change="swiperChange">
      <!-- 可用优惠券 -->
      <swiper-item>
        <scroll-view scroll-y class="coupon-scroll">
          <view class="coupon-list">
            <view
              v-for="coupon in validCoupons"
              :key="coupon.id"
              class="coupon-card"
              :class="[getCouponColorClass(coupon)]"
            >
              <!-- 优惠券左侧 -->
              <view class="coupon-left">
                <view class="coupon-value">
                  <template
                    v-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'discount'
                    "
                  >
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                    <text class="unit">折</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'cash'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'free'
                    "
                  >
                    <text class="value">免单</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'specialPrice'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'shipping'
                    "
                  >
                    <text class="value">免运费</text>
                  </template>
                </view>
                <view
                  class="coupon-limit"
                  v-if="
                    (coupon.couponTemplate?.minOrderAmount ||
                      coupon.minOrderAmount) > 0
                  "
                >
                  满{{
                    coupon.couponTemplate?.minOrderAmount ||
                    coupon.minOrderAmount
                  }}元可用
                </view>
              </view>

              <!-- 中间分割线 -->
              <view class="coupon-divider">
                <view class="circle top"></view>
                <view class="dashed-line"></view>
                <view class="circle bottom"></view>
              </view>

              <!-- 优惠券右侧 -->
              <view class="coupon-right">
                <view class="coupon-title">{{
                  coupon.couponTemplate?.title || coupon.title
                }}</view>
                <view class="coupon-desc">{{
                  coupon.couponTemplate?.description || coupon.description
                }}</view>
                <view class="coupon-time">
                  {{
                    formatDate(
                      coupon.couponTemplate?.startTime || coupon.startTime
                    )
                  }}
                  -
                  {{
                    formatDate(coupon.couponTemplate?.endTime || coupon.endTime)
                  }}
                </view>
                <view class="coupon-btn">
                  <button @click="useCouponClick(coupon)">立即使用</button>
                </view>
              </view>
            </view>

            <view v-if="validCoupons.length === 0" class="empty-tip">
              <image
                src="/static/images/empty-coupon.png"
                mode="aspectFit"
              ></image>
              <text>暂无可用优惠券</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 已使用优惠券 -->
      <swiper-item>
        <scroll-view scroll-y class="coupon-scroll">
          <view class="coupon-list">
            <view
              v-for="coupon in usedCoupons"
              :key="coupon.id"
              class="coupon-card used"
            >
              <!-- 与可用券结构相同，但添加已使用标记 -->
              <view class="coupon-left">
                <view class="coupon-value">
                  <template
                    v-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'discount'
                    "
                  >
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                    <text class="unit">折</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'cash'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'free'
                    "
                  >
                    <text class="value">免单</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'specialPrice'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'shipping'
                    "
                  >
                    <text class="value">免运费</text>
                  </template>
                </view>
                <view
                  class="coupon-limit"
                  v-if="
                    (coupon.couponTemplate?.minOrderAmount ||
                      coupon.minOrderAmount) > 0
                  "
                >
                  满{{
                    coupon.couponTemplate?.minOrderAmount ||
                    coupon.minOrderAmount
                  }}元可用
                </view>
              </view>

              <view class="coupon-divider">
                <view class="circle top"></view>
                <view class="dashed-line"></view>
                <view class="circle bottom"></view>
              </view>

              <view class="coupon-right">
                <view class="coupon-title">{{
                  coupon.couponTemplate?.title || coupon.title
                }}</view>
                <view class="coupon-desc">{{
                  coupon.couponTemplate?.description || coupon.description
                }}</view>
                <view class="coupon-time">
                  使用时间: {{ formatDate(coupon.usedTime) }}
                </view>
                <view class="coupon-used-mark">
                  <text>已使用</text>
                </view>
              </view>
            </view>

            <view v-if="usedCoupons.length === 0" class="empty-tip">
              <image
                src="/static/images/empty-coupon.png"
                mode="aspectFit"
              ></image>
              <text>暂无已使用优惠券</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 已过期优惠券 -->
      <swiper-item>
        <scroll-view scroll-y class="coupon-scroll">
          <view class="coupon-list">
            <view
              v-for="coupon in expiredCoupons"
              :key="coupon.id"
              class="coupon-card expired"
            >
              <!-- 与可用券结构相同，但添加已过期标记 -->
              <view class="coupon-left">
                <view class="coupon-value">
                  <template
                    v-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'discount'
                    "
                  >
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                    <text class="unit">折</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'cash'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) === 'free'
                    "
                  >
                    <text class="value">免单</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'specialPrice'
                    "
                  >
                    <text class="symbol">¥</text>
                    <text class="value">{{
                      coupon.couponTemplate?.value || coupon.value
                    }}</text>
                  </template>
                  <template
                    v-else-if="
                      (coupon.couponTemplate?.type || coupon.type) ===
                      'shipping'
                    "
                  >
                    <text class="value">免运费</text>
                  </template>
                </view>
                <view
                  class="coupon-limit"
                  v-if="
                    (coupon.couponTemplate?.minOrderAmount ||
                      coupon.minOrderAmount) > 0
                  "
                >
                  满{{
                    coupon.couponTemplate?.minOrderAmount ||
                    coupon.minOrderAmount
                  }}元可用
                </view>
              </view>

              <view class="coupon-divider">
                <view class="circle top"></view>
                <view class="dashed-line"></view>
                <view class="circle bottom"></view>
              </view>

              <view class="coupon-right">
                <view class="coupon-title">{{
                  coupon.couponTemplate?.title || coupon.title
                }}</view>
                <view class="coupon-desc">{{
                  coupon.couponTemplate?.description || coupon.description
                }}</view>
                <view class="coupon-time">
                  过期时间: {{ formatDate(coupon.endTime) }}
                </view>
                <view class="coupon-expired-mark">
                  <text>已过期</text>
                </view>
              </view>
            </view>

            <view v-if="expiredCoupons.length === 0" class="empty-tip">
              <image
                src="/static/images/empty-coupon.png"
                mode="aspectFit"
              ></image>
              <text>暂无已过期优惠券</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { COUPON_TYPES, COUPON_STATUS } from "../../utils/couponModel";
import { userData } from "../../utils/userData";

// 标签页
const tabs = ref(["可用优惠券", "已使用", "已过期"]);
const currentTab = ref(0);

// 优惠券列表
const validCoupons = ref([]);
const usedCoupons = ref([]);
const expiredCoupons = ref([]);

// 可领取的优惠券
const availableCoupons = ref([]);

// 弹窗状态
const isCouponCenterVisible = ref(false);

// 格式化日期函数
const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 初始化数据
onMounted(() => {
  loadCoupons();
});

// 加载优惠券数据
const loadCoupons = () => {
  // 如果userData.coupons不存在，使用空数组
  const userCoupons = userData.coupons || [];

  // 按状态过滤优惠券
  validCoupons.value = userCoupons.filter(
    (coupon) =>
      (coupon.status === "valid" ||
        coupon.status === "active" ||
        coupon.status === "notStarted") &&
      !coupon.usedTime
  );

  usedCoupons.value = userCoupons.filter(
    (coupon) => coupon.status === "used" || coupon.usedTime
  );

  expiredCoupons.value = userCoupons.filter(
    (coupon) =>
      coupon.status === "expired" ||
      (coupon.endTime && new Date(coupon.endTime) < new Date())
  );
};

// 切换标签页
const switchTab = (index) => {
  currentTab.value = index;
};

// 轮播图改变事件
const swiperChange = (e) => {
  currentTab.value = e.detail.current;
};

// 关闭优惠券中心
const closeCouponCenter = () => {
  isCouponCenterVisible.value = false;
};

// 使用优惠券
const useCouponClick = (coupon) => {
  // 这里应该跳转到订单页面，但由于我们还没有完整的订单流程，
  // 所以只是提示用户并跳转到点单页面
  uni.showModal({
    title: "使用优惠券",
    content: "确定要使用此优惠券吗？请先前往点单页面选择商品",
    confirmText: "去点单",
    success: (res) => {
      if (res.confirm) {
        uni.switchTab({
          url: "/pages/order/order",
        });
      }
    },
  });
};

// 获取优惠券颜色类名
const getCouponColorClass = (type) => {
  // 支持直接传入优惠券对象
  if (typeof type === "object") {
    // 如果是完整的优惠券对象
    if (type.couponTemplate) {
      type = type.couponTemplate.type;
    } else {
      // 直接使用优惠券对象自身的type
      type = type.type;
    }
  }

  switch (type) {
    case COUPON_TYPES.DISCOUNT:
    case "discount":
      return "discount-coupon";

    case COUPON_TYPES.CASH:
    case "cash":
      return "cash-coupon";

    case COUPON_TYPES.FREE:
    case "free":
      return "free-coupon";

    case COUPON_TYPES.SPECIAL_PRICE:
    case "specialPrice":
      return "special-coupon";

    case COUPON_TYPES.SHIPPING:
    case "shipping":
      return "shipping-coupon";

    default:
      return "";
  }
};
</script>

<style lang="scss" scoped>
.coupons-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
}

// 标签页样式
.tabs {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  height: 80rpx;
  border-bottom: 1rpx solid #eee;
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
  color: #007aff;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #007aff;
}

// 优惠券轮播区域
.coupon-swiper {
  flex: 1;
  height: 0;
}

.coupon-scroll {
  height: 100%;
  box-sizing: border-box;
  padding: 20rpx;
}

// 优惠券列表
.coupon-list {
  padding-bottom: 120rpx;
}

// 优惠券卡片
.coupon-card {
  display: flex;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

// 优惠券左侧
.coupon-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx 30rpx;
  width: 200rpx;
  background-color: #007aff;
  color: #fff;
}

.coupon-value {
  display: flex;
  align-items: baseline;
}

.coupon-value .symbol {
  font-size: 36rpx;
  margin-right: 4rpx;
}

.coupon-value .value {
  font-size: 45rpx;
  font-weight: bold;
}

.coupon-value .unit {
  font-size: 32rpx;
  margin-left: 4rpx;
}

.coupon-limit {
  font-size: 24rpx;
  margin-top: 10rpx;
}

// 优惠券中间分割线
.coupon-divider {
  position: relative;
  width: 0;
}

.dashed-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 2rpx dashed #e6e6e6;
  height: 100%;
}

.circle {
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  background-color: #f7f8fa;
  border-radius: 50%;
  left: -10rpx;
}

.circle.top {
  top: -10rpx;
}

.circle.bottom {
  bottom: -10rpx;
}

// 优惠券右侧
.coupon-right {
  flex: 1;
  padding: 20rpx 30rpx;
  position: relative;
}

.coupon-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #333;
}

.coupon-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.coupon-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.coupon-btn {
  button {
    background-color: #007aff;
    color: #fff;
    border-radius: 10rpx;
    font-size: 26rpx;
    padding: 10rpx 30rpx;
    line-height: 1.4;
    margin: 0;
    width: auto;
    display: inline-block;
  }
}

// 已使用和已过期样式
.coupon-card.used .coupon-left,
.coupon-card.expired .coupon-left {
  background-color: #999;
}

.coupon-used-mark,
.coupon-expired-mark {
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  padding: 10rpx 20rpx;
  background-color: rgba(153, 153, 153, 0.2);
  border-radius: 8rpx;
}

.coupon-used-mark text,
.coupon-expired-mark text {
  font-size: 24rpx;
  color: #999;
}

// 空状态提示
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-tip image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-tip text {
  font-size: 28rpx;
  color: #999;
}

// 底部领券入口
.claim-coupon-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.claim-btn {
  width: 100%;
  background-color: #007aff;
  color: #fff;
  border-radius: 12rpx;
  font-size: 30rpx;
}

// 领券中心自定义弹窗
.coupon-center {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding-bottom: 40rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1001;
}

.popup-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #eee;
}

.popup-header .title {
  font-size: 32rpx;
  font-weight: bold;
}

.popup-header .close {
  font-size: 44rpx;
  color: #999;
  line-height: 1;
}

.center-scroll {
  max-height: 70vh;
  padding: 20rpx;
}

.coupon-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.center-coupon-item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.center-coupon-top {
  padding: 30rpx 20rpx;
  background-color: #007aff;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.center-coupon-value {
  display: flex;
  align-items: baseline;
}

.center-coupon-value .symbol {
  font-size: 28rpx;
}

.center-coupon-value .value {
  font-size: 48rpx;
  font-weight: bold;
}

.center-coupon-value .unit {
  font-size: 28rpx;
  margin-left: 4rpx;
}

.center-coupon-limit {
  font-size: 22rpx;
  margin-top: 8rpx;
}

.center-coupon-bottom {
  padding: 20rpx;
}

.center-coupon-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.claim-coupon-btn {
  background-color: #fff;
  color: #007aff;
  border: 1rpx solid #007aff;
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  line-height: 1.4;
  margin: 0;
  width: 100%;
}

// 不同类型优惠券颜色
.discount-coupon .coupon-left,
.discount-coupon .center-coupon-top {
  background-color: #ff9500;
}

.cash-coupon .coupon-left,
.cash-coupon .center-coupon-top {
  background-color: #ff3b30;
}

.free-coupon .coupon-left,
.free-coupon .center-coupon-top {
  background-color: #5856d6;
}

.special-coupon .coupon-left,
.special-coupon .center-coupon-top {
  background-color: #af52de;
}

.shipping-coupon .coupon-left,
.shipping-coupon .center-coupon-top {
  background-color: #007aff;
}

// 自定义弹窗遮罩层样式
.custom-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
