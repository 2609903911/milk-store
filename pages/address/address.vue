<template>
  <view class="address-container">
    <!-- 导航栏 - 固定在顶部 -->
    <view class="nav-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="20"></uni-icons>
      </view>
      <view class="title">收货地址</view>
    </view>

    <!-- 可滚动内容区域 - 在导航栏下方，添加按钮上方 -->
    <scroll-view class="scroll-content" scroll-y>
      <!-- 默认位置 -->
      <view class="default-location" v-if="defaultAddress">
        <view class="location-icon">
          <uni-icons
            type="location-filled"
            size="24"
            color="#0066FF"
          ></uni-icons>
        </view>
        <view class="location-text">{{ defaultAddress }}</view>
      </view>

      <!-- 地址列表 -->
      <view class="address-list">
        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
          <uni-icons type="spinner-cycle" size="30" color="#999"></uni-icons>
          <text>加载中...</text>
        </view>

        <!-- 地址项 -->
        <view
          class="address-item"
          v-for="(item, index) in addressList"
          :key="index"
          v-else-if="addressList.length > 0"
        >
          <view class="address-info">
            <view class="address-title">{{ item.address }}</view>
            <view class="address-user">
              <text
                >{{ item.contactName
                }}{{
                  item.gender === "male"
                    ? "(先生)"
                    : item.gender === "female"
                    ? "(女士)"
                    : ""
                }}</text
              >
              <text>{{ item.formattedPhone }}</text>
            </view>
          </view>
          <view class="edit-btn" @click="editAddress(item)">
            <uni-icons type="compose" size="20"></uni-icons>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-else-if="!loading">
          <image
            src="/static/images/empty-address.png"
            mode="aspectFit"
          ></image>
          <text>暂无收货地址</text>
        </view>
      </view>
    </scroll-view>

    <!-- 添加地址按钮 - 固定在底部 -->
    <view class="add-address-btn" @click="addAddress"> 添加地址 </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get } from "../../utils/api/request";
import { userState } from "../../utils/userState";
import { onLoad, onShow } from "@dcloudio/uni-app";

// 地址列表数据
const addressList = ref([]);
// 加载状态
const loading = ref(false);
// 默认地址
const defaultAddress = ref("");

// 页面加载时获取地址数据
onLoad(() => {
  fetchAddresses();
});

// 页面显示时刷新地址数据（包括从其他页面返回时）
onShow(() => {
  fetchAddresses();
});

// 获取用户地址列表
const fetchAddresses = async () => {
  if (!userState.userId) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  try {
    const result = await get(`/api/user/addresses`, {
      userId: userState.userId,
    });

    if (result.code === 200 && result.data) {
      // 对数据进行处理，格式化手机号
      const formattedData = result.data.map((item) => {
        return {
          ...item,
          formattedPhone: formatPhone(item.phone),
        };
      });

      addressList.value = formattedData;

      // 查找默认地址
      const defaultAddr = result.data.find((item) => item.isDefault);
      if (defaultAddr) {
        defaultAddress.value = defaultAddr.address;
      }
    } else {
      uni.showToast({
        title: "获取地址失败",
        icon: "none",
      });
    }
  } catch (error) {
    uni.showToast({
      title: "获取地址失败，请重试",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

// 格式化手机号，4-7位用*号代替
const formatPhone = (phone) => {
  if (!phone) return "";

  if (phone.length !== 11) {
    return phone; // 非标准手机号不处理
  }

  return phone.substring(0, 3) + "****" + phone.substring(7);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 编辑地址
const editAddress = (item) => {
  // 使用原始ID，不进行数字转换
  const id = item.id;

  // 使用页面事件通道传递数据，避免URL参数编码问题
  uni.navigateTo({
    url: `/pages/address/edit-address?id=${id}`,
    events: {
      // 为目标页面定义事件，目标页面可以通过 eventChannel 触发
      addressData: function (data) {
        // data 为目标页面传递的数据，无需操作
      },
    },
    success: function (res) {
      // 通过eventChannel向目标页面传送数据
      res.eventChannel.emit("addressData", {
        id: id,
        contactName: item.contactName,
        phone: item.phone,
        gender: item.gender || "male",
        address: item.address,
        isDefault: item.isDefault ? true : false,
      });
    },
  });
};

// 添加地址
const addAddress = () => {
  uni.navigateTo({
    url: "/pages/address/edit-address",
  });
};
</script>

<style lang="scss">
.address-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  margin-top: 44px;
  position: relative; // 为了固定元素的定位
}

.nav-header {
  display: flex;
  align-items: center;
  height: 44px;
  background-color: #ffffff;
  padding: 0 15px;
  border-bottom: 1px solid #f0f0f0;
  position: fixed; // 固定在顶部
  top: 44px; // 与容器的margin-top相同
  left: 0;
  right: 0;
  z-index: 100; // 确保在最上层

  .back-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
  }

  .right-btns {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.scroll-content {
  flex: 1;
  height: calc(100vh - 140px); // 减去导航栏和添加按钮的高度
  margin-top: 44px; // 为导航栏预留空间
  padding-bottom: 20px; // 为底部按钮预留空间
}

.default-location {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  margin-bottom: 10px;

  .location-icon {
    margin-right: 10px;
  }

  .location-text {
    font-size: 14px;
    color: #333;
  }
}

.address-list {
  padding: 0 15px;
  padding-bottom: 80px; // 为底部按钮预留更多空间
}

.address-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #f2f1f1;
  border-radius: 8px;
  margin-bottom: 10px;

  .address-info {
    flex: 1;
  }

  .address-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .address-user {
    font-size: 13px;
    color: #999;

    text {
      margin-right: 10px;
    }
  }

  .edit-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;

  image {
    width: 120px;
    height: 120px;
    margin-bottom: 15px;
  }

  text {
    font-size: 14px;
    color: #999;
  }
}

.add-address-btn {
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #0066ff;
  color: #ffffff;
  border-radius: 22px;
  font-size: 16px;
  position: fixed;
  left: 15px;
  right: 15px;
  bottom: 20px;
  z-index: 10;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;

  text {
    font-size: 14px;
    color: #999;
    margin-top: 15px;
  }
}
</style>
