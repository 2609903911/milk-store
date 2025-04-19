<template>
    <view class="container">
        <!-- 自定义导航栏 -->
        <view class="custom-nav">
            <!-- #ifdef MP-WEIXIN -->
            <view class="nav-placeholder"></view>
            <!-- #endif -->

            <!-- 搜索栏 -->
            <view class="search-bar">
                <view class="search-input" @tap="goToSearch">
                    <!-- #ifdef H5 -->
                    <uni-icons type="search" size="18" color="#999"></uni-icons>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN -->
                    <text
                        class="uni-icons iconfont icon-search"
                        style="font-size: 36rpx; color: #999"
                    ></text>
                    <!-- #endif -->
                    <input type="text" placeholder="搜索商品" disabled />
                </view>
                <view class="menu-btn">
                    <!-- #ifdef H5 -->
                    <uni-icons type="bars" size="22" color="#333"></uni-icons>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN -->
                    <text
                        class="uni-icons iconfont icon-bars"
                        style="font-size: 40rpx; color: #333"
                    ></text>
                    <!-- #endif -->
                </view>
            </view>
        </view>

        <!-- 店铺信息和配送方式 -->
        <view class="shop-info">
            <view class="shop-location">
                <view class="shop-name" @click="navigateToMap"
                    >{{ shopName }}
                    <uni-icons type="right" size="16" color="#333"></uni-icons>
                </view>
                <!-- 自取模式下只显示距离 -->
                <view v-if="deliveryType === 'self'" class="shop-distance"
                    >距离您{{ shopDistance }}</view
                >
                <!-- 外卖模式下显示用户地址和门店距离 -->
                <view
                    v-if="deliveryType === 'delivery'"
                    class="user-address"
                    @click="openAddressSelection"
                    >{{ userAddress }}
                    <uni-icons
                        type="arrowright"
                        size="16"
                        color="#333"
                    ></uni-icons>
                </view>
                <view v-if="deliveryType === 'delivery'" class="shop-distance"
                    >距离您{{ shopDistance }}</view
                >
            </view>
            <view class="delivery-options">
                <view
                    class="delivery-option"
                    :class="{ active: deliveryType === 'self' }"
                    @click="deliveryType = 'self'"
                >
                    自取
                </view>
                <view
                    class="delivery-option"
                    :class="{ active: deliveryType === 'delivery' }"
                    @click="deliveryType = 'delivery'"
                >
                    外卖
                </view>
            </view>
        </view>

        <!-- 轮播播报 -->
        <view class="notice-bar">
            <!-- #ifdef H5 -->
            <uni-icons
                type="notification"
                size="18"
                color="#ff9500"
            ></uni-icons>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <text
                class="uni-icons iconfont icon-notification"
                style="font-size: 36rpx; color: #ff9500; margin-right: 10rpx"
            ></text>
            <!-- #endif -->
            <swiper
                class="notice-swiper"
                vertical
                autoplay
                interval="3000"
                circular
            >
                <swiper-item v-for="(item, index) in noticeList" :key="index">
                    <text class="notice-text">{{ item }}</text>
                </swiper-item>
            </swiper>
        </view>

        <!-- 滚动内容区域包装器 -->
        <view class="scrollable-wrapper">
            <!-- 横向滚动图片区域 -->
            <view
                class="promo-scroll-container"
                :class="{ 'promo-scroll-hidden': isPromoHidden }"
            >
                <scroll-view
                    class="promo-scroll"
                    scroll-x
                    show-scrollbar="true"
                    @scroll="onScroll"
                    :scroll-with-animation="true"
                >
                    <view
                        class="promo-item"
                        v-for="(item, index) in promoList"
                        :key="index"
                        @click="openPromoDetail(item)"
                    >
                        <image
                            class="promo-image"
                            :src="item.image"
                            mode="aspectFill"
                        ></image>
                        <view class="enter-btn">
                            <text>查看详情</text>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 分类和菜单区域 -->
            <view
                class="menu-container"
                :class="{ 'menu-container-scrolled': isPromoHidden }"
            >
                <view class="menu-tabs">
                    <text
                        class="tab"
                        :class="{ active: activeTab === 'menu' }"
                        @click="activeTab = 'menu'"
                        >门店菜单</text
                    >
                    <text
                        class="tab"
                        :class="{ active: activeTab === 'coupon' }"
                        @click="activeTab = 'coupon'"
                        >用券下单</text
                    >
                </view>

                <!-- 菜单内容 -->
                <view class="menu-content" v-if="activeTab === 'menu'">
                    <scroll-view
                        class="category-scroll"
                        scroll-y
                        :scroll-into-view="'cate-' + activeCategoryIndex"
                        :scroll-with-animation="true"
                    >
                        <view
                            class="category-item"
                            :class="{ active: activeCategoryIndex === index }"
                            v-for="(category, index) in categories"
                            :key="index"
                            :id="'cate-' + index"
                            @click="selectCategory(index)"
                        >
                            <text class="category-name">{{
                                category.name
                            }}</text>
                        </view>
                    </scroll-view>

                    <scroll-view
                        class="products-scroll"
                        scroll-y
                        :scroll-into-view="currentCategoryId"
                        @scroll="onProductScroll"
                        :scroll-with-animation="true"
                    >
                        <view
                            class="category-products"
                            v-for="(category, index) in categories"
                            :key="index"
                            :id="'product-' + index"
                        >
                            <view class="category-title">{{
                                category.name
                            }}</view>
                            <view
                                class="product-item"
                                v-for="(product, pIndex) in category.products"
                                :key="pIndex"
                            >
                                <image
                                    class="product-image"
                                    :src="product.image"
                                    mode="aspectFill"
                                ></image>
                                <view class="product-info">
                                    <view class="product-name">{{
                                        product.name
                                    }}</view>
                                    <view class="product-desc">{{
                                        product.desc
                                    }}</view>
                                    <view class="product-price-container">
                                        <text class="product-price"
                                            >¥{{ product.price }}</text
                                        >
                                        <view
                                            class="add-to-cart"
                                            @click.stop="
                                                openProductDetail(
                                                    category,
                                                    product
                                                )
                                            "
                                            >+</view
                                        >
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <!-- 用券下单内容 -->
                <view class="coupon-content" v-else>
                    <scroll-view scroll-y class="coupon-scroll-view">
                        <view class="coupon-list">
                            <view
                                class="coupon-item"
                                v-for="(coupon, index) in coupons"
                                :key="index"
                            >
                                <view
                                    class="coupon-left"
                                    :style="{ backgroundColor: coupon.color }"
                                >
                                    <view class="discount-value"
                                        >{{ coupon.discount
                                        }}<text class="discount-unit">{{
                                            coupon.unit
                                        }}</text></view
                                    >
                                    <view class="coupon-type">{{
                                        coupon.type
                                    }}</view>
                                </view>
                                <view class="coupon-right">
                                    <view class="coupon-title">{{
                                        coupon.title
                                    }}</view>
                                    <view class="coupon-desc">{{
                                        coupon.description
                                    }}</view>
                                    <view class="coupon-period"
                                        >有效期至{{ coupon.expireDate }}</view
                                    >
                                    <view class="coupon-scope">{{
                                        coupon.scope
                                    }}</view>
                                    <view
                                        class="use-btn"
                                        @click="useCoupon(coupon)"
                                        :style="{
                                            backgroundColor: coupon.color
                                        }"
                                        >去选购</view
                                    >
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
            <!-- 商品详情弹框 -->
            <shop-detail
                v-if="productDetailVisible"
                :visible="productDetailVisible"
                :product="selectedProduct"
                @update:visible="updateDetailVisible"
                @add-to-cart="handleAddToCart"
            />

            <!-- 购物车组件 -->
            <order-cart ref="orderCartRef" />
        </view>
    </view>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getProductData, initProductData } from '../../utils/productData'
// 使用easycom自动注册组件，不需要手动导入
// 组件名称已在pages.json中注册
import { BASE_URL, API_PATHS } from '../../utils/api/config'

// 显式导入shop-detail组件以确保微信小程序能正确加载
import OrderDetail from '../components/shop-detail.vue'
import OrderCart from '../components/order-cart.vue'
// 引入 uni-icons 组件
// import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

// 组件注册
defineOptions({
    components: {
        OrderDetail,
        OrderCart
    }
})

// 门店相关信息
const shopName = ref('九江学院四食堂店')
const shopDistance = ref('0.41km')
const shopAddress = ref('九江学院校内·四食堂')
// 用户地址
const userAddress = ref('请选择收货地址')

// 配送方式
const deliveryType = ref('self') // 'self' 自取, 'delivery' 外卖

// 监听deliveryType变化并保存到localStorage
watch(deliveryType, (newValue) => {
    // 将配送方式保存到本地存储
    uni.setStorageSync('deliveryType', newValue)

    // 在外卖模式下，获取用户默认地址
    if (newValue === 'delivery') {
        getUserDefaultAddress()
    }
})

// 获取用户默认地址
const getUserDefaultAddress = () => {
    // 获取用户ID
    const userInfo = uni.getStorageSync('userInfo')
    const userId = userInfo.userId
    if (!userId) {
        userAddress.value = '请先登录并设置收货地址'
        return
    }

    // 直接从后端获取用户默认地址
    uni.request({
        url: `${BASE_URL}${API_PATHS.USER_DEFAULT_ADDRESS}?userId=${userId}`,
        method: 'GET',
        success: (res) => {
            if (
                res.data &&
                res.data.code === 200 &&
                res.data.data &&
                res.data.data.address
            ) {
                userAddress.value = res.data.data.address.address
            } else {
                userAddress.value = '请设置默认收货地址'
            }
        },
        fail: (err) => {
            userAddress.value = '获取地址失败，请重试'
        }
    })
}

// 页面加载时初始化数据
onMounted(() => {
    // 初始化数据
    initData()

    // 获取存储的门店信息
    updateStoreInfo()

    // 监听门店选择事件
    uni.$on('store-selected', handleStoreSelected)

    // 监听页面刷新事件
    uni.$on('refresh-order-page', refreshPage)

    // 监听地址选择事件
    uni.$on('address-selected', handleAddressSelected)

    // 尝试从本地存储中获取配送方式
    const savedDeliveryType = uni.getStorageSync('deliveryType')
    if (savedDeliveryType) {
        deliveryType.value = savedDeliveryType
        // 如果是外卖模式，获取用户地址
        if (savedDeliveryType === 'delivery') {
            getUserDefaultAddress()
        }
    }
})

// 轮播播报数据
const noticeList = ref([
    '周一现场下单立减5元，仅限堂食',
    '会员日消费满30元送小确幸优惠券',
    '新品上市：丝绒芝士莓莓，芝士与草莓的完美融合'
])

// 促销图片数据
const promoList = ref([
    {
        image: '/static/images/hot01.png',
        title: '杨梅吐气'
    },
    {
        image: '/static/images/hot02.png',
        title: '手作米麻薯'
    },
    {
        image: '/static/images/hot03.png',
        title: '满杯芭乐'
    },
    {
        image: '/static/images/hot04.png',
        title: '抹茶奶绿'
    },
    {
        image: '/static/images/hot05.png',
        title: '喜凤梨'
    }
])

// 滚动相关
const scrollLeft = ref(0)

const onScroll = (e) => {
    scrollLeft.value = e.detail.scrollLeft
}

// 分类相关
const activeTab = ref('menu')
const activeCategoryIndex = ref(0)

// 监听activeTab变化
watch(activeTab, (newValue) => {
    if (newValue === 'coupon') {
        // 当切换到优惠券标签时，确保加载最新的优惠券数据
        loadUserCoupons()
    }
})

// 我们改成使用scroll-into-view而不是scroll-top
const currentCategoryId = ref('product-0')

// 分类数据
const categories = ref([])

// 是否正在加载产品数据
const isLoading = ref(false)

// 加载产品数据
const loadProductData = async () => {
    isLoading.value = true
    try {
        const productData = await getProductData()
        categories.value = productData

        // 计算分类高度
        calculateHeights()
    } catch (error) {
        uni.showToast({
            title: '加载产品失败，请重试',
            icon: 'none'
        })
    } finally {
        isLoading.value = false
    }
}

// 为每个分类及其产品计算高度，便于后续滚动计算
const categoryHeights = ref([])
const calculateHeights = () => {
    let heights = []
    let currentHeight = 0

    categories.value.forEach((category, index) => {
        heights.push(currentHeight)
        // 类别标题高度 + 商品高度（每个商品按200px计算）
        const categoryHeight = 60 + category.products.length * 200
        currentHeight += categoryHeight
    })

    categoryHeights.value = heights
}

// 初始化数据
const initData = async () => {
    // 初始化产品数据
    await initProductData()
    // 加载产品数据
    await loadProductData()
}

// 添加onShow生命周期钩子，确保页面每次显示时都更新数据
onShow(() => {
    // 更新门店信息
    updateStoreInfo()

    // 加载用户优惠券
    loadUserCoupons()
})

// 在组件卸载时取消监听事件
onUnmounted(() => {
    uni.$off('store-selected', handleStoreSelected)
    uni.$off('refresh-order-page', refreshPage)
    uni.$off('address-selected', handleAddressSelected)
})

// 处理门店选择事件
const handleStoreSelected = (data) => {
    if (data) {
        if (data.name) {
            shopName.value = data.name
        }
        if (data.distance) {
            shopDistance.value = data.distance
        }
        if (data.address) {
            shopAddress.value = data.address
        }

        // 强制更新界面
        nextTick(() => {
            // 触发UI更新
            const temp = shopName.value
            shopName.value = temp + ' '
            setTimeout(() => {
                shopName.value = temp
            }, 10)
        })
    }
}

// 提取更新门店信息的函数
const updateStoreInfo = () => {
    const selectedStore = uni.getStorageSync('selectedStore')
    if (selectedStore) {
        let updated = false

        if (selectedStore.name && selectedStore.name !== shopName.value) {
            shopName.value = selectedStore.name
            updated = true
        }
        if (
            selectedStore.distance &&
            selectedStore.distance !== shopDistance.value
        ) {
            shopDistance.value = selectedStore.distance
            updated = true
        }
        if (
            selectedStore.address &&
            selectedStore.address !== shopAddress.value
        ) {
            shopAddress.value = selectedStore.address
            updated = true
        }

        // 如果数据有更新，强制刷新UI
        if (updated) {
            // 使用nextTick确保数据更新后再触发UI更新
            nextTick(() => {
                // UI更新代码
            })
        }
    }
}

// 选择分类
const selectCategory = (index) => {
    activeCategoryIndex.value = index
    // 使用scroll-into-view实现滚动
    currentCategoryId.value = 'product-' + index
}

// 横幅隐藏状态
const isPromoHidden = ref(false)

// 产品滚动事件处理
const onProductScroll = (e) => {
    // 根据滚动位置估算当前分类
    const scrollTop = e.detail.scrollTop

    // 通过简单的固定高度来估算当前分类
    // 这种方法比较粗略但在uni-app中更可靠
    const estimatedIndex = Math.floor(scrollTop / 600)

    // 防止越界
    if (estimatedIndex >= 0 && estimatedIndex < categories.value.length) {
        // 仅在分类变化时更新
        if (activeCategoryIndex.value !== estimatedIndex) {
            activeCategoryIndex.value = estimatedIndex
        }
    }

    // 控制横幅的隐藏和显示
    isPromoHidden.value = scrollTop > 50
}

// 优惠券数据
const coupons = ref([])

// 引入userState
import { userState } from '../../utils/userState'

// 格式化日期的函数
const formatDate = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
// 获取用户信息中的优惠券
const loadUserCoupons = () => {
    // 直接从全局状态获取优惠券数据，而不是从localStorage
    if (userState.coupons && Array.isArray(userState.coupons)) {
        // 将用户信息中的优惠券转换为订单页面需要的格式
        coupons.value = userState.coupons.map((coupon) => {
            // 根据优惠券类型生成不同的显示内容
            let discount = ''
            let unit = ''
            let color = ''

            switch (coupon.type) {
                case 'discount': // 折扣券
                    discount = coupon.value
                    unit = '折'
                    color = '#007AFF'
                    break
                case 'cash': // 现金券
                    discount = coupon.value
                    unit = '元'
                    color = '#FF6B00'
                    break
                case 'free': // 免单券
                    discount = '免单'
                    unit = ''
                    color = '#FF2D55'
                    break
                case 'specialPrice': // 特价券
                    discount = coupon.value
                    unit = '元'
                    color = '#AF52DE'
                    break
                case 'shipping': // 免运费券
                    discount = '免'
                    unit = '运费'
                    color = '#5856D6'
                    break
                default:
                    discount = coupon.value
                    unit = ''
                    color = '#007AFF'
            }

            // 格式化过期时间
            const expireDate = formatDate(coupon.endTime)

            return {
                id: coupon.id,
                discount,
                unit,
                type: coupon.scope === 'all' ? '全场通用' : '部分商品',
                title: coupon.title,
                description:
                    coupon.description ||
                    (coupon.minOrderAmount > 0
                        ? `满${coupon.minOrderAmount}元可用`
                        : ''),
                expireDate,
                scope: coupon.description,
                color,
                originalCoupon: coupon // 保存原始优惠券数据，便于后续使用
            }
        })
    } else {
        // 未找到优惠券数据
    }
}

// 使用优惠券
const useCoupon = (coupon) => {
    // 切换到菜单
    activeTab.value = 'menu'

    // 可以在这里添加优惠券使用逻辑
    uni.showToast({
        title: '已选择优惠券：' + coupon.title,
        icon: 'none'
    })

    // 这里可以添加其他逻辑，如标记当前使用的优惠券等
}

// 滚动动画相关
const promoScrollOpacity = ref(1)
const promoScrollTranslate = ref(0)

// 页面滚动处理函数
function onPageScroll(e) {
    const scrollTop = e.scrollTop

    // 滚动临界值，根据实际布局调整
    const threshold = 150

    if (scrollTop > 0 && scrollTop <= threshold) {
        // 计算渐变过程中的透明度和位移
        const progress = scrollTop / threshold
        promoScrollOpacity.value = 1 - progress
        promoScrollTranslate.value = -50 * progress
    } else if (scrollTop > threshold) {
        // 完全隐藏
        promoScrollOpacity.value = 0
        promoScrollTranslate.value = -50
    } else {
        // 完全显示
        promoScrollOpacity.value = 1
        promoScrollTranslate.value = 0
    }
}

// 商品详情弹框相关
const productDetailVisible = ref(false)
const selectedProduct = ref({})

// 打开商品详情弹框
const openProductDetail = (category, product) => {
    selectedProduct.value = { ...product, category: category.name }

    // 延迟设置弹框显示，确保数据已更新
    setTimeout(() => {
        productDetailVisible.value = true
    }, 50)
}

// 更新弹框可见状态
const updateDetailVisible = (val) => {
    // 如果要隐藏弹框，先改变状态，然后等动画结束后再真正卸载组件
    if (val === false) {
        // 延迟卸载组件，等待动画完成
        setTimeout(() => {
            productDetailVisible.value = val
        }, 300) // 动画时长为300ms
    } else {
        productDetailVisible.value = val
    }
}

// 购物车引用
const orderCartRef = ref(null)

// 处理添加到购物车
const handleAddToCart = (item) => {
    // 添加调试日志
    console.log('订单页面接收到的购物车项：', item)

    // 由于shop-detail组件已经将商品添加到了本地存储
    // 我们只需要刷新购物车组件显示
    nextTick(() => {
        if (orderCartRef.value) {
            orderCartRef.value.loadCartItems()
        }
    })

    // 提示用户（虽然shop-detail组件已经显示了提示，但这里可以再次确认）
    uni.showToast({
        title: '已加入购物车',
        icon: 'success'
    })
}

// 在uni-app中，onPageScroll是页面生命周期函数，不需要显式调用
// uni-app会自动调用页面的onPageScroll方法

// 在 script setup 部分添加新的方法
const openPromoDetail = (item) => {
    // 根据促销图片的标题找到对应的商品
    const product = findProductByTitle(item.title)
    if (product) {
        selectedProduct.value = { ...product }

        // 延迟设置弹框显示，确保数据已更新
        setTimeout(() => {
            productDetailVisible.value = true
        }, 50)
    }
}

const findProductByTitle = (title) => {
    for (const category of categories.value) {
        const product = category.products.find((p) => p.name === title)
        if (product) return product
    }
    return null
}

// 新增的导航到地图的逻辑
const navigateToMap = () => {
    // 导航到地图页面
    uni.navigateTo({
        url: '/pages/map/map'
    })
}

// 刷新页面数据
const refreshPage = () => {
    updateStoreInfo()
    // 这里可以添加其他需要刷新的数据
}

// 跳转到搜索页面
const goToSearch = () => {
    uni.navigateTo({
        url: '/pages/search/search'
    })
}

// 新增的打开地址选择界面的逻辑
const openAddressSelection = () => {
    // 打开地址选择界面
    uni.navigateTo({
        url: '/pages/address/address'
    })
}

// 新增的地址选择事件处理逻辑
const handleAddressSelected = (data) => {
    if (data) {
        if (data.address) {
            userAddress.value = data.address
            // 保存到本地存储
            uni.setStorageSync('userDefaultAddress', data.address)
        }
        // 强制更新界面
        nextTick(() => {
            // 触发UI更新
            const temp = userAddress.value
            userAddress.value = temp + ' '
            setTimeout(() => {
                userAddress.value = temp
            }, 10)
        })
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f5f5f5;
}

// 自定义导航栏
.custom-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background-color: #fff;
}

// 为微信小程序导航栏预留空间
.nav-placeholder {
    height: var(--status-bar-height);
    width: 100%;
}

// 顶部搜索栏
.search-bar {
    display: flex;
    align-items: center;
    padding: 40rpx 30rpx 20rpx 30rpx;
    background-color: #fff;
    position: relative;
    z-index: 100;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

// 为固定导航栏预留空间
.container {
    padding-top: calc(var(--status-bar-height) + 90rpx);
}

.search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 100rpx;
    padding: 15rpx 30rpx;
    margin-right: 20rpx;
}

input {
    flex: 1;
    font-size: 28rpx;
    margin-left: 10rpx;
}

.menu-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

// 店铺信息和配送方式
.shop-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    margin-top: 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}

.shop-location {
    flex: 1;
}

.shop-name {
    font-size: 30rpx;
    font-weight: 500;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 6rpx;
}

.shop-distance {
    font-size: 24rpx;
    color: #666666;
}

.shop-address {
    font-size: 24rpx;
    color: #999;
    margin-top: 4rpx;
}

.user-address {
    font-size: 24rpx;
    color: #333;
    margin-top: 4rpx;
    display: flex;
    align-items: center;
    cursor: pointer;
    // 控制一行
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-address::after {
    font-size: 20rpx;
    color: #999;
    margin-left: 6rpx;
}

.delivery-options {
    display: flex;
    overflow: hidden;
    border-radius: 8rpx;
    box-shadow: 0 0 1px black;
}

.delivery-option {
    width: 90rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    background-color: #f5f5f5;
    color: #666;
}

.delivery-option.active {
    background-color: #006de7;
    color: #fff;
}

// 会员信息
.member-info {
    padding: 16rpx 30rpx;
    background-color: #f9f9f9;
    font-size: 26rpx;
    color: #666;
}

// 轮播播报
.notice-bar {
    display: flex;
    align-items: center;
    padding: 16rpx 30rpx;
    background-color: #fff;
    margin-top: 0;
}

.notice-swiper {
    flex: 1;
    height: 50rpx;
    margin-left: 15rpx;
}

.notice-text {
    font-size: 26rpx;
    color: #666;
    line-height: 50rpx;
}

// 滚动区域
.scrollable-wrapper {
    position: relative;
    z-index: 1;
}

// 横向滚动图片区域
.promo-scroll-container {
    background-color: #fff;
    position: relative;
    margin-top: 0;
    border-bottom: 1rpx solid #f0f0f0;
    transition: all 0.3s ease;
    max-height: 440rpx;
    overflow: hidden;
    transform: translateY(0);
    z-index: 1;
}

.promo-scroll-hidden {
    max-height: 0;
    opacity: 0;
    transform: translateY(-20rpx);
}

.promo-scroll {
    white-space: nowrap;
    padding: 20rpx 0;
    position: relative;
}

.promo-item {
    display: inline-block;
    width: 300rpx;
    height: 400rpx;
    margin-right: 20rpx;
    position: relative;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.promo-item:first-child {
    margin-left: 30rpx;
}

.promo-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
}

.enter-btn {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    padding: 8rpx 20rpx;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 22rpx;
    border-radius: 30rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
}

.enter-btn text {
    margin-right: 4rpx;
}

// 菜单区域
.menu-container {
    background-color: #fff;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;
}

.menu-container-scrolled {
    transform: translateY(0rpx);
}

.menu-tabs {
    display: flex;
    border-bottom: 1rpx solid #f0f0f0;
    padding-left: 30rpx;
}

.tab {
    padding: 25rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s;
    margin-right: 20rpx;
}

.tab.active {
    color: #006de7;
    font-weight: bold;
    position: relative;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60rpx;
    height: 4rpx;
    background-color: #006de7;
    border-radius: 2rpx;
}

// 分类相关
.menu-content {
    display: flex;
    height: calc(100vh - 400rpx); /* 调整高度以适应内容 */
}

.category-scroll {
    width: 180rpx;
    height: 100%;
    background-color: #f5f5f5;
}

.category-item {
    padding: 30rpx 20rpx;
    font-size: 28rpx;
    color: #666;
    text-align: center;
    position: relative;
    transition: all 0.3s;
}

.category-item.active {
    color: #006de7;
    font-weight: bold;
    background-color: #fff;
}

.category-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 36rpx;
    background-color: #006de7;
    border-radius: 3rpx;
}

.products-scroll {
    flex: 1;
    height: 100%;
    background-color: #fff;
}

.category-products {
    padding: 20rpx;
}

.category-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 10rpx;
    border-left: 6rpx solid #006de7;
}

.product-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-name {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 6rpx;
}

.product-desc {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 15rpx;
}

.product-price-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.product-price {
    font-size: 30rpx;
    font-weight: bold;
    color: #ff5722;
}

.add-to-cart {
    width: 50rpx;
    height: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #006de7;
    color: #fff;
    font-size: 40rpx;
    border-radius: 40%;
    margin-right: 20rpx;
}
.category-name {
    font-size: 25rpx;
}

// 优惠券列表样式
.coupon-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.coupon-scroll-view {
    height: calc(
        100vh - 400rpx
    ); /* 调整高度确保在不同设备上都有足够的滚动空间 */
    width: 100%;
}

.coupon-list {
    padding: 20rpx;
}

.coupon-item {
    display: flex;
    background-color: #fff;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.coupon-item::before {
    content: '';
    position: absolute;
    left: -10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 20rpx;
    height: 20rpx;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.coupon-item::after {
    content: '';
    position: absolute;
    right: -10rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 20rpx;
    height: 20rpx;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.coupon-left {
    width: 220rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: relative;
}

.coupon-left::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20rpx;
    bottom: 20rpx;
    width: 2rpx;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 5%,
        #fff 5%,
        #fff 9%,
        transparent 9%,
        transparent 14%,
        #fff 14%,
        #fff 18%,
        transparent 18%,
        transparent 23%,
        #fff 23%,
        #fff 27%,
        transparent 27%,
        transparent 32%,
        #fff 32%,
        #fff 36%,
        transparent 36%,
        transparent 41%,
        #fff 41%,
        #fff 45%,
        transparent 45%,
        transparent 50%,
        #fff 50%,
        #fff 54%,
        transparent 54%,
        transparent 59%,
        #fff 59%,
        #fff 63%,
        transparent 63%,
        transparent 68%,
        #fff 68%,
        #fff 72%,
        transparent 72%,
        transparent 77%,
        #fff 77%,
        #fff 81%,
        transparent 81%,
        transparent 86%,
        #fff 86%,
        #fff 90%,
        transparent 90%,
        transparent 95%,
        #fff 95%,
        #fff 100%
    );
}

.discount-value {
    font-size: 40rpx;
    font-weight: bold;
    line-height: 1;
}

.discount-unit {
    font-size: 40rpx;
    font-weight: normal;
}

.coupon-type {
    font-size: 24rpx;
    margin-top: 10rpx;
}

.coupon-right {
    flex: 1;
    padding: 30rpx;
    position: relative;
}

.coupon-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.coupon-desc {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 10rpx;
}

.coupon-period {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 6rpx;
}

.coupon-scope {
    font-size: 22rpx;
    color: #999;
}

.use-btn {
    position: absolute;
    right: 30rpx;
    bottom: 30rpx;
    padding: 10rpx 30rpx;
    color: #fff;
    font-size: 26rpx;
    border-radius: 10rpx;
    background-color: #ff5f16;
}
</style>