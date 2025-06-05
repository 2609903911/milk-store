<template>
  <scroll-view class="scroll-container" scroll-y>
    <view class="order-confirm">
      <!-- 商店信息 -->
      <view class="shop-info">
        <!-- 自取模式：显示店铺信息 -->
        <template v-if="deliveryType === 'self'">
          <view class="shop-name-container">
            <view class="tag">自取</view>
            <view class="shop-name"
              >{{ storeInfo.name }}
              <uni-icons type="arrowright" size="16" color="black"></uni-icons>
            </view>
          </view>
          <view class="shop-distance">距您 {{ storeInfo.distance }}</view>
          <view class="shop-address">{{ storeInfo.address }}</view>
          <view class="shop-phone">
            <text>客服电话</text>
            <text class="phone-number">{{
              storeInfo.phone || "13027261672"
            }}</text>
            <text class="copy-icon" @tap="copyPhoneNumber">复制</text>
          </view>
        </template>

        <!-- 外卖模式：显示收货地址和收件人信息 -->
        <template v-else>
          <view class="shop-name-container">
            <view class="tag">外卖</view>
            <view class="shop-name"
              >收货地址
              <uni-icons type="arrowright" size="16" color="black"></uni-icons>
            </view>
          </view>
          <view class="shop-address">{{
            orderUserAddress || "未设置收货地址"
          }}</view>
          <view class="recipient-info">
            <text
              >联系人
              {{
                (contactName || userInfo.nickname || "匿名用户") +
                (gender === "male"
                  ? "(先生)"
                  : gender === "female"
                  ? "(女士)"
                  : "")
              }}</text
            >
            <text class="phone-number"
              >联系电话
              {{ contactPhone || userInfo.phone || "未设置手机号" }}</text
            >
          </view>
        </template>
      </view>

      <!-- 订单商品列表 -->
      <view class="order-items">
        <view class="order-title">
          <text>订单详情</text>
          <view class="drink-category">清爽夏日饮品推荐</view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
          <view
            class="product-item"
            v-for="(item, index) in orderItems"
            :key="index"
          >
            <image
              class="product-image"
              :src="item.image"
              mode="aspectFill"
            ></image>
            <view class="product-info">
              <view class="product-name">{{ item.name }}</view>
              <view class="product-specs">{{ item.specs || "常规" }}</view>
              <view class="product-quantity">×{{ item.quantity }}</view>
            </view>
            <view class="product-price">¥{{ item.price.toFixed(2) }}</view>
          </view>
        </view>
      </view>

      <!-- 价格详情 -->
      <view class="price-detail">
        <view class="price-title">价格明细</view>

        <!-- 优惠券部分 -->
        <view class="coupon-section" @click="openCouponSelect">
          <view class="coupon-tag">
            <image
              class="coupon-icon"
              src="/static/images/coupon-icon.png"
            ></image>
            <text>优惠券</text>
          </view>
          <view class="coupon-action">
            <text v-if="selectedCoupon" class="selected-coupon">
              已选择: {{ selectedCoupon.title }}
              <text class="discount-amount">(-¥{{ discountAmount }})</text>
            </text>
            <text v-else>
              {{
                availableCoupons.length > 0
                  ? `${availableCoupons.length}张优惠券可用`
                  : "选择优惠券"
              }}
            </text>
            <uni-icons
              class="arrow"
              :style="{
                color: availableCoupons.length > 0 ? '#006de7' : '#999',
              }"
              type="right"
              size="16"
            ></uni-icons>
          </view>
        </view>

        <!-- 优惠券选择弹框 -->
        <coupon-select
          :show="showCouponSelect"
          :order-amount="totalAmount"
          :order-items="orderItems"
          @update:show="showCouponSelect = $event"
          @select="handleCouponSelect"
        />

        <view class="total-section">
          <text>合计</text>
          <text class="total-price">¥{{ totalPrice }}</text>
        </view>
      </view>

      <!-- 支付方式 -->
      <view class="payment-method">
        <view class="payment-title">支付方式</view>
        <view class="payment-options">
          <view class="payment-option selected">
            <image
              class="payment-icon"
              src="/static/images/wechat-pay.png"
            ></image>
            <text>微信支付</text>
            <view class="check-icon">✓</view>
          </view>
        </view>
      </view>

      <!-- 底部支付栏 -->
      <view class="payment-bar">
        <view class="payment-amount">
          <text>待支付：</text>
          <text class="amount">¥{{ totalPrice }}</text>
        </view>
        <view class="pay-button" @tap="handlePayment">支付</view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import CouponSelect from "../components/coupon-select.vue";
import { userState } from "../../utils/userState";
import { updateUserState } from "../../utils/userState";
import { api } from "../../utils/api";
import { updateCouponUsed, getCouponById } from "../../utils/api/orderApi";
import { userData, initUserData } from "../../utils/userData";

// 定义数据
const orderItems = ref([]);
const totalPrice = ref("0.00");
const storeInfo = ref({
  name: "九江中心店",
  distance: "0.97km",
  address: "九江市中心区繁华路88号",
  phone: "13027261672",
});
const deliveryType = ref("self"); // 'self'自取, 'delivery'外卖
const orderUserAddress = ref(""); // 用户收货地址
const contactName = ref(""); // 收件人姓名
const contactPhone = ref(""); // 收件人电话
const gender = ref(""); // 性别信息
const userInfo = ref({
  nickname: "",
  phone: "",
});

// 优惠券选择相关
const showCouponSelect = ref(false);
const selectedCoupon = ref(null);
const totalAmount = ref(0);

// 可用优惠券列表 - 从userData中获取
const availableCoupons = computed(() => {
  // 优先从userData中获取优惠券，如果没有再从userState获取
  const userCoupons =
    userData.coupons && userData.coupons.length > 0
      ? userData.coupons
      : userState.coupons || [];

  return userCoupons.filter((coupon) => {
    // 检查优惠券是否可用
    const now = Date.now();
    const isExpired = now > coupon.endTime;
    const isUsed = coupon.status === "used";
    const isDeleted = coupon.isDeleted;

    // 检查订单金额是否满足优惠券使用条件
    const meetsAmount = totalAmount.value >= coupon.minOrderAmount;

    return !isExpired && !isUsed && !isDeleted && meetsAmount;
  });
});

// 优惠券折扣金额
const discountAmount = ref("0.00");
const originalPrice = ref("0.00");

// 获取传递的数据
onMounted(() => {
  try {
    // 从本地存储中获取订单数据
    const orderData = uni.getStorageSync("orderConfirmData");

    if (orderData) {
      orderItems.value = orderData.items || [];
      totalPrice.value = orderData.totalPrice || "0.00";
      originalPrice.value = orderData.totalPrice || "0.00";

      // 计算总金额
      calculateTotalAmount();

      if (orderData.store) {
        storeInfo.value = orderData.store;
      }

      if (orderData.deliveryType) {
        deliveryType.value = orderData.deliveryType;
      }

      if (orderData.userAddress) {
        orderUserAddress.value = orderData.userAddress;
      }

      // 获取联系人信息
      if (orderData.contactName) {
        contactName.value = orderData.contactName;
      }

      if (orderData.contactPhone) {
        contactPhone.value = orderData.contactPhone;
      }

      // 获取性别信息
      if (orderData.gender) {
        gender.value = orderData.gender;
      }

      // 获取用户基本信息
      const localUserInfo = uni.getStorageSync("userInfo");
      if (localUserInfo) {
        userInfo.value = {
          nickname: localUserInfo.nickname || "匿名用户",
          phone: localUserInfo.phone || "未设置手机号",
        };
      }

      // 可以选择性地清除本地存储
      // uni.removeStorageSync('orderConfirmData')
    }
  } catch (error) {
    uni.showToast({
      title: "获取订单数据失败",
      icon: "none",
    });
  }
});

// 复制电话号码
const copyPhoneNumber = () => {
  uni.setClipboardData({
    data: storeInfo.value.phone,
    success: () => {
      uni.showToast({
        title: "电话已复制",
        icon: "success",
      });
    },
  });
};

// 处理支付
const handlePayment = async () => {
  // 创建一个获取购物车组件的引用
  const pages = getCurrentPages();
  const homePage = pages.find((page) => page.route === "pages/index/index");

  // 设置一个标志以便在回到首页后清除购物车中的已选商品
  uni.setStorageSync("clearCartAfterPayment", "true");

  // 设置标志通知my-orders页面刷新数据
  uni.setStorageSync("ordersNeedRefresh", "true");

  // 获取选中的商品ID以便删除
  const orderConfirmData = uni.getStorageSync("orderConfirmData") || {};
  const selectedItemIds = (orderConfirmData.items || []).map((item) => item.id);

  // 保存需要删除的商品ID
  uni.setStorageSync("itemsToDeleteFromCart", selectedItemIds);

  // 计算金额
  const totalAmountValue = parseFloat(originalPrice.value); // 订单总金额（原价）
  const discountAmountValue = parseFloat(discountAmount.value); // 优惠金额
  const actualAmountValue = parseFloat(totalPrice.value); // 实付金额（折后价）

  // 构建订单数据，按照API接口文档的格式
  const orderData = {
    userId: userState.userId,
    totalAmount: totalAmountValue.toFixed(2),
    discountAmount: discountAmountValue.toFixed(2),
    actualAmount: actualAmountValue.toFixed(2),
    couponId: selectedCoupon.value ? selectedCoupon.value.id : null,
    deliveryType: deliveryType.value || "self",
    storeName: orderConfirmData.store?.name || storeInfo.value.name,
    storeAddress: orderConfirmData.store?.address || storeInfo.value.address,
    contactName: contactName.value || userInfo.value.nickname || "匿名用户",
    contactPhone: contactPhone.value || userInfo.value.phone || "",
    deliveryAddress:
      deliveryType.value === "delivery" ? orderUserAddress.value : "",
    orderItems: JSON.stringify(orderItems.value),
  };

  try {
    // 使用订单API创建订单
    const newOrder = await api.order.createOrder(orderData);

    // 如果使用了优惠券，将其标记为已使用
    if (selectedCoupon.value && selectedCoupon.value.id) {
      // 首先获取最新的优惠券信息
      try {
        const couponResult = await getCouponById(selectedCoupon.value.id);

        // 获取优惠券对象（从结果中正确提取数据）
        const couponInfo = couponResult?.data || couponResult;

        // 检查优惠券是否有效且未使用
        if (couponInfo && couponInfo.status === "valid") {
          // 通过API更新优惠券状态
          if (newOrder && newOrder.orderId) {
            const result = await updateCouponUsed(
              selectedCoupon.value.id,
              newOrder.orderId
            );

            if (result && (result.success || result.code === 200)) {
            } else {
            }
          } else {
            const orderId = `ORD${new Date()
              .toISOString()
              .replace(/[-:.TZ]/g, "")
              .substring(0, 14)}${Math.floor(Math.random() * 1000)}`;
            const result = await updateCouponUsed(
              selectedCoupon.value.id,
              orderId
            );

            if (result && (result.success || result.code === 200)) {
            } else {
            }
          }
        } else {
        }
      } catch (error) {}
    }

    // 显示支付成功提示
    uni.showToast({
      title: "模拟支付成功",
      icon: "success",
      success: () => {
        setTimeout(() => {
          // 支付成功后跳转到订单列表
          uni.switchTab({
            url: "/pages/my-orders/my-orders",
          });
        }, 1500);
      },
    });
  } catch (error) {
    uni.showToast({
      title: "订单创建失败",
      icon: "none",
    });
  }
};

// 计算总金额
const calculateTotalAmount = () => {
  totalAmount.value = orderItems.value.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
};

// 监听订单项变化
watch(
  orderItems,
  () => {
    calculateTotalAmount();
  },
  { deep: true }
);

// 显示优惠券选择弹框
const openCouponSelect = () => {
  showCouponSelect.value = true;
};

// 处理优惠券选择
const handleCouponSelect = (coupon) => {
  // 重置价格为原始价格
  totalPrice.value = originalPrice.value;
  let finalPrice = parseFloat(totalPrice.value);
  let discount = 0;

  if (coupon) {
    selectedCoupon.value = coupon;

    if (coupon.type === "cash") {
      // 满减券：直接减去value值
      discount = parseFloat(coupon.value);
      finalPrice = Math.max(0, finalPrice - discount);
    } else if (coupon.type === "discount") {
      // 折扣券：按折扣比例计算
      const originalAmount = parseFloat(originalPrice.value);
      const discountedAmount = originalAmount * (parseFloat(coupon.value) / 10);
      discount = originalAmount - discountedAmount;
      finalPrice = discountedAmount;
    } else if (coupon.type === "specialPrice") {
      // 特价券：将原价替换为特价
      const matchingItems = orderItems.value.filter(
        (item) => coupon.scopeIds && coupon.scopeIds.includes(item.id)
      );

      if (matchingItems.length > 0) {
        let discountTotal = 0;

        // 计算所有符合条件商品的折扣
        matchingItems.forEach((item) => {
          // 原价总额
          const originalItemPrice = item.price;
          const originalItemsTotal = originalItemPrice * item.quantity;
          // 特价总额
          const specialItemsTotal = parseFloat(coupon.value) * item.quantity;
          // 单品折扣
          discountTotal += originalItemsTotal - specialItemsTotal;
        });

        // 计算折扣金额
        discount = discountTotal;
        // 从总价中减去折扣金额
        finalPrice = Math.max(0, finalPrice - discount);
      }
    } else if (coupon.type === "free") {
      // 免单券：直接将总价设置为0，但确保不超过券的value值
      const maxDiscount = parseFloat(coupon.value);
      discount = Math.min(parseFloat(originalPrice.value), maxDiscount);
      finalPrice = Math.max(0, parseFloat(originalPrice.value) - discount);
    }

    // 更新折扣金额和最终价格
    discountAmount.value = discount.toFixed(2);
    totalPrice.value = finalPrice.toFixed(2);
  } else {
    // 如果取消选择优惠券，恢复原价
    selectedCoupon.value = null;
    discountAmount.value = "0.00";
    totalPrice.value = originalPrice.value;
  }
};
</script>

<style scoped>
.scroll-container {
  height: 100vh;
  width: 100%;
}

.order-confirm {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 商店信息 */
.shop-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.shop-name-container {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.tag {
  background-color: #333;
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 10rpx;
  border-radius: 4rpx;
  margin-right: 10rpx;
}

.shop-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.shop-distance {
  font-size: 26rpx;
  color: #666;
  text-align: right;
  margin-bottom: 10rpx;
}

.shop-address {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.shop-phone {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;
}

.phone-number {
  margin: 0 20rpx;
  color: #333;
}

.copy-icon {
  color: #999;
}

/* 收件人信息 */
.recipient-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #666;
  margin-top: 15rpx;
}

.recipient-info .phone-number {
  color: #333;
  margin-left: 20rpx;
}

/* 订单商品列表 */
.order-items {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.order-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  font-size: 30rpx;
  color: #333;
}

.drink-category {
  font-size: 24rpx;
  color: #999;
  background-color: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.product-list {
  padding-bottom: 10rpx;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.product-specs {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.product-quantity {
  font-size: 24rpx;
  color: #666;
}

.product-price {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

/* 价格详情 */
.price-detail {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.price-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 30rpx;
}

.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
}

.coupon-tag {
  display: flex;
  align-items: center;
}

.coupon-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}

.coupon-action {
  color: #ff6a6a;
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.selected-coupon {
  color: #006de7;
}

.discount-amount {
  color: #ff6a6a;
  margin-left: 10rpx;
}

.arrow {
  margin-left: 10rpx;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0 10rpx;
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  font-weight: bold;
}

/* 集杯活动 */
.cup-collection {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.collection-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.collection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  color: #666;
}

.collection-count {
  color: #0066cc;
}

/* 支付方式 */
.payment-method {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.payment-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.payment-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
}

.check-icon {
  margin-left: auto;
  color: #0066cc;
  font-size: 32rpx;
}

/* 底部支付栏 */
.payment-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.payment-amount {
  font-size: 28rpx;
  color: #333;
}

.amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.pay-button {
  background-color: #2a88e6;
  color: #fff;
  font-size: 32rpx;
  padding: 15rpx 60rpx;
  border-radius: 20rpx;
  margin-right: 40rpx;
}
</style>
