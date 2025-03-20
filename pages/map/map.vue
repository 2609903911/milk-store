<template>
    <view class="store-selector" :style="{ '--map-height': mapHeight }">
        <!-- 搜索区域 -->
        <view class="search-area">
            <view class="location-selector" @tap="navigateToCitySelect">
                <text>{{ selectedCityName }}</text>
                <text class="dropdown-icon">▼</text>
            </view>
            <view class="search-box">
                <text class="search-icon">🔍</text>
                <input class="search-input" placeholder="搜索门店/地点" />
            </view>
        </view>

        <!-- 地图区域 -->
        <view class="map-container" :style="{ height: mapHeight }">
            <map
                class="map"
                :latitude="selectedCityLocation.latitude"
                :longitude="selectedCityLocation.longitude"
                scale="14"
                show-location
                :markers="storeMarkers"
            ></map>
        </view>

        <!-- 收起/展开地图控制栏 -->
        <view class="map-toggle" @tap="toggleMap">
            <view class="map-toggle-text">{{
                isMapShown ? '收起地图' : '展开地图'
            }}</view>
            <uni-icons
                :type="isMapShown ? 'top' : 'bottom'"
                size="14"
                color="#666"
            >
            </uni-icons>
        </view>

        <!-- 附近门店列表 -->
        <view class="store-list-container">
            <view class="list-header">
                <text>附近门店</text>
            </view>

            <!-- 门店列表带滚动 -->
            <scroll-view class="store-list" scroll-y>
                <view
                    class="store-item"
                    :class="{ selected: selectedStoreId === store.id }"
                    v-for="store in storeList"
                    :key="store.id"
                    @tap="selectStore(store)"
                >
                    <view class="store-item-left">
                        <view class="store-star">☆</view>
                        <view class="store-info">
                            <view class="store-name">{{ store.name }}</view>
                            <view
                                class="store-status"
                                :class="{ operating: store.isOperating }"
                            >
                                {{ store.status }}
                            </view>
                            <view class="store-address">{{
                                store.address
                            }}</view>
                            <view class="store-hours"
                                >营业时间 {{ store.hours }}</view
                            >
                        </view>
                    </view>
                    <view class="store-item-right">
                        <view class="store-distance">{{ store.distance }}</view>
                        <view class="store-actions">
                            <text
                                class="action-icon phone"
                                @tap.stop="callStore(store.phone)"
                                >📞</text
                            >
                            <text
                                class="action-icon locate"
                                @tap.stop="
                                    navigateToStore(
                                        store.location.latitude,
                                        store.location.longitude
                                    )
                                "
                                >📍</text
                            >
                        </view>
                    </view>
                    <view
                        class="selected-icon"
                        v-if="selectedStoreId === store.id"
                        >✓</view
                    >
                </view>
            </scroll-view>
        </view>

        <!-- 底部确认按钮 -->
        <view class="confirm-bar" v-if="selectedStoreId">
            <view class="confirm-btn" @tap="confirmSelection">确认选择</view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 地图显示状态
const isMapShown = ref(true)

// 选中的城市
const selectedCityName = ref('九江市')
const selectedCityLocation = ref({
    latitude: 29.7051,
    longitude: 116.0017
})

// 计算地图高度
const mapHeight = computed(() => {
    return isMapShown.value ? '400rpx' : '0'
})

// 门店列表
const storeList = ref([
    {
        id: 'store1',
        name: '九江中心店',
        status: '营业中',
        isOperating: true,
        address: '九江市中心区繁华路88号',
        hours: '10:00-22:00',
        distance: '0.97km',
        phone: '13027261672',
        location: {
            latitude: 29.7151,
            longitude: 115.9917
        }
    },
    {
        id: 'store2',
        name: '九江北区店',
        status: '休息中',
        isOperating: false,
        address: '九江市北区商业街B区12号',
        hours: '10:00-21:20',
        distance: '2.27km',
        phone: '13027261673',
        location: {
            latitude: 29.6951,
            longitude: 116.0117
        }
    },
    {
        id: 'store3',
        name: '九江大学城店',
        status: '营业中',
        isOperating: true,
        address: '九江市大学城A区168号',
        hours: '10:00-22:00',
        distance: '2.34km',
        phone: '13027261674',
        location: {
            latitude: 29.7051,
            longitude: 116.0217
        }
    }
])

// 计算店铺位置标记
const storeMarkers = computed(() => {
    return storeList.value.map((store, index) => {
        return {
            id: index,
            latitude: store.location.latitude,
            longitude: store.location.longitude,
            title: store.name,
            iconPath:
                store.id === selectedStoreId.value
                    ? '/static/marker-active.png'
                    : '/static/marker.png',
            width: 32,
            height: 32
        }
    })
})

// 选中的门店ID
const selectedStoreId = ref(null)
const selectedStoreName = ref('')

// 切换地图显示/隐藏
const toggleMap = () => {
    isMapShown.value = !isMapShown.value
}

// 选择门店
const selectStore = (store) => {
    selectedStoreId.value = store.id
    selectedStoreName.value = store.name

    // 更新地图位置到选中的店铺位置
    if (store.location) {
        selectedCityLocation.value = {
            latitude: store.location.latitude,
            longitude: store.location.longitude
        }
    }
}

// 确认选择
const confirmSelection = () => {
    if (selectedStoreId.value) {
        // 获取全局数据
        const app = getApp()

        // 计算距离，这里简化为固定值，实际应用中应该根据用户位置计算
        const distance = '0.41km'

        // 可以将选择的门店信息保存到全局数据或本地存储
        uni.setStorageSync('selectedStore', {
            id: selectedStoreId.value,
            name: selectedStoreName.value,
            distance: distance
        })

        // 判断是否有上一页
        const pages = getCurrentPages()
        if (
            pages.length > 1 &&
            pages[pages.length - 2].route.includes('order')
        ) {
            // 如果上一页是订单页面，则返回
            uni.navigateBack()
        } else {
            // 否则跳转到订单页面
            uni.navigateTo({
                url: '/pages/order/order'
            })
        }
    } else {
        uni.showToast({
            title: '请选择一个门店',
            icon: 'none'
        })
    }
}

// 拨打电话
const callStore = (phone) => {
    uni.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
            uni.showToast({
                title: '拨打电话失败',
                icon: 'none'
            })
        }
    })
}

// 导航到门店
const navigateToStore = (latitude, longitude) => {
    uni.openLocation({
        latitude,
        longitude,
        scale: 18,
        fail: () => {
            uni.showToast({
                title: '打开位置失败',
                icon: 'none'
            })
        }
    })
}

// 导航到城市选择页面
const navigateToCitySelect = () => {
    uni.navigateTo({
        url: '/pages/map-city/map-city'
    })
}

// 监听城市选择事件
onMounted(() => {
    const city = uni.getStorageSync('selectedCity')
    if (city && city.name) {
        selectedCityName.value = city.name
        if (city.latitude && city.longitude) {
            selectedCityLocation.value = {
                latitude: city.latitude,
                longitude: city.longitude
            }
            // 根据城市加载相应的门店数据
            loadStoresByCity(city.name, city.latitude, city.longitude)
        }
    }

    // 监听自定义事件
    uni.$on('citySelected', function (data) {
        console.log('选择城市:', data)
        if (data && data.name) {
            selectedCityName.value = data.name
            // 更新地图位置
            if (data.latitude && data.longitude) {
                selectedCityLocation.value = {
                    latitude: data.latitude,
                    longitude: data.longitude
                }
                // 根据城市加载相应的门店数据
                loadStoresByCity(data.name, data.latitude, data.longitude)
            }
        }
    })
})

// 组件销毁时移除事件监听
onUnmounted(() => {
    uni.$off('citySelected')
})

// 根据城市加载门店数据
const loadStoresByCity = (cityName, latitude, longitude) => {
    // 这里可以调用API获取特定城市的门店数据
    // 目前使用模拟数据
    console.log(`加载${cityName}的门店数据, 坐标: ${latitude}, ${longitude}`)

    // 模拟不同城市的门店数据
    if (cityName === '北京') {
        storeList.value = [
            {
                id: 'bj-store1',
                name: '北京朝阳店',
                status: '营业中',
                isOperating: true,
                address: '北京市朝阳区建国路88号',
                hours: '10:00-22:00',
                distance: '1.2km',
                phone: '13800138000',
                location: {
                    latitude: latitude + 0.01,
                    longitude: longitude - 0.01
                }
            },
            {
                id: 'bj-store2',
                name: '北京海淀店',
                status: '营业中',
                isOperating: true,
                address: '北京市海淀区中关村大街1号',
                hours: '09:00-21:00',
                distance: '2.5km',
                phone: '13800138001',
                location: {
                    latitude: latitude - 0.01,
                    longitude: longitude + 0.02
                }
            },
            {
                id: 'bj-store3',
                name: '北京西城店',
                status: '休息中',
                isOperating: false,
                address: '北京市西城区西单北大街120号',
                hours: '10:00-21:00',
                distance: '3.2km',
                phone: '13800138002',
                location: {
                    latitude: latitude + 0.02,
                    longitude: longitude + 0.01
                }
            }
        ]
    } else if (cityName === '上海') {
        storeList.value = [
            {
                id: 'sh-store1',
                name: '上海徐汇店',
                status: '营业中',
                isOperating: true,
                address: '上海市徐汇区肇嘉浜路1111号',
                hours: '10:00-22:00',
                distance: '0.8km',
                phone: '13900139000',
                location: {
                    latitude: latitude + 0.01,
                    longitude: longitude - 0.01
                }
            },
            {
                id: 'sh-store2',
                name: '上海静安店',
                status: '营业中',
                isOperating: true,
                address: '上海市静安区南京西路1266号',
                hours: '09:30-21:30',
                distance: '1.9km',
                phone: '13900139001',
                location: {
                    latitude: latitude - 0.01,
                    longitude: longitude + 0.01
                }
            }
        ]
    } else {
        // 其他城市显示默认数据，只修改地址和名称前缀
        storeList.value = [
            {
                id: 'store1',
                name: `${cityName}中心店`,
                status: '营业中',
                isOperating: true,
                address: `${cityName}市中心区繁华路88号`,
                hours: '10:00-22:00',
                distance: '0.97km',
                phone: '13027261672',
                location: {
                    latitude: latitude + 0.01,
                    longitude: longitude - 0.01
                }
            },
            {
                id: 'store2',
                name: `${cityName}北区店`,
                status: '休息中',
                isOperating: false,
                address: `${cityName}市北区商业街B区12号`,
                hours: '10:00-21:20',
                distance: '2.27km',
                phone: '13027261673',
                location: {
                    latitude: latitude - 0.01,
                    longitude: longitude + 0.01
                }
            },
            {
                id: 'store3',
                name: `${cityName}大学城店`,
                status: '营业中',
                isOperating: true,
                address: `${cityName}市大学城A区168号`,
                hours: '10:00-22:00',
                distance: '2.34km',
                phone: '13027261674',
                location: {
                    latitude: latitude,
                    longitude: longitude + 0.02
                }
            }
        ]
    }

    // 重置选中状态
    selectedStoreId.value = null
    selectedStoreName.value = ''
}
</script>

<style>
.store-selector {
    background-color: #f8f8f8;
    min-height: 100vh;
    position: relative;
}

/* 页面标题 */
.header {
    height: 90rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #eee;
}

.title {
    font-size: 34rpx;
    font-weight: 500;
    color: #333;
}

/* 搜索区域 */
.search-area {
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    border-bottom: 1px solid #eee;
}

.location-selector {
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
}

.dropdown-icon {
    font-size: 24rpx;
    margin-left: 10rpx;
    color: #999;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    padding: 10rpx 20rpx;
}

.search-icon {
    font-size: 28rpx;
    color: #999;
    margin-right: 10rpx;
}

.search-input {
    flex: 1;
    height: 60rpx;
    font-size: 28rpx;
    background-color: transparent;
}

/* 地图区域 */
.map-container {
    position: relative;
    transition: height 0.3s ease;
    overflow: hidden;
}

.map {
    width: 100%;
    height: 100%;
}

/* 收起/展开地图控制栏 */
.map-toggle {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15rpx 0;
    border-bottom: 1px solid #eee;
}

.map-toggle-text {
    font-size: 26rpx;
    color: #666;
}

.selected-icon {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: #07c160;
    color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
}

/* 门店列表容器 */
.store-list-container {
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.list-header {
    padding: 20rpx 30rpx;
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    border-bottom: 1px solid #f5f5f5;
    flex-shrink: 0;
}

/* 带滚动的门店列表 */
.store-list {
    flex: 1;
    height: calc(100vh - 200rpx - var(--map-height, 400rpx));
}

.store-item {
    display: flex;
    padding: 30rpx;
    border-bottom: 1px solid #f5f5f5;
    position: relative;
}

.store-item.selected {
    background-color: #f2f7f2;
}

.store-item-left {
    flex: 1;
    display: flex;
}

.store-star {
    margin-right: 20rpx;
    color: #ffc107;
    font-size: 40rpx;
    line-height: 1;
}

.store-info {
    flex: 1;
}

.store-name {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 10rpx;
    font-weight: 500;
}

.store-status {
    display: inline-block;
    font-size: 24rpx;
    color: #999;
    padding: 6rpx 12rpx;
    background-color: #f5f5f5;
    border-radius: 6rpx;
    margin-bottom: 10rpx;
}

.store-status.operating {
    color: #07c160;
    background-color: #eaf8ef;
}

.store-address {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    line-height: 1.4;
}

.store-hours {
    font-size: 26rpx;
    color: #999;
}

.store-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: 20rpx;
    padding-right: 50rpx;
}

.store-distance {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.store-actions {
    display: flex;
    margin-top: auto;
}

.action-icon {
    width: 50rpx;
    height: 50rpx;
    margin-left: 20rpx;
    font-size: 40rpx;
    color: #666;
}

.panda-image {
    position: absolute;
    right: 60rpx;
    bottom: 20rpx;
    width: 100rpx;
    height: 100rpx;
}

/* 底部确认按钮 */
.confirm-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 20rpx;
    border-top: 1px solid #eee;
}

.confirm-btn {
    background-color: #07c160;
    color: #fff;
    font-size: 30rpx;
    font-weight: 500;
    padding: 20rpx 40rpx;
    border-radius: 30rpx;
    text-align: center;
}
</style>
