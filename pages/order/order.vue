<template>
    <view class="container">
        <!-- 自定义导航栏 -->
        <view class="custom-nav">
            <!-- #ifdef MP-WEIXIN -->
            <view class="nav-placeholder"></view>
            <!-- #endif -->

            <!-- 搜索栏 -->
            <view class="search-bar">
                <view class="search-input">
                    <!-- #ifdef H5 -->
                    <uni-icons type="search" size="18" color="#999"></uni-icons>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN -->
                    <text
                        class="uni-icons iconfont icon-search"
                        style="font-size: 36rpx; color: #999"
                    ></text>
                    <!-- #endif -->
                    <input type="text" placeholder="搜索商品" />
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
                <view class="shop-name">九江学院四食堂店 ></view>
                <view class="shop-distance">距离您0.41km</view>
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
                                    :style="{ backgroundColor: coupon.color }"
                                    >去选购</view
                                >
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 商品详情弹框 -->
        <order-detail
            v-if="productDetailVisible"
            :visible="productDetailVisible"
            :product="selectedProduct"
            @update:visible="updateDetailVisible"
            @add-to-cart="handleAddToCart"
        />

        <!-- 购物车组件 -->
        <order-cart ref="orderCartRef" />
    </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
// 使用easycom自动注册组件，不需要手动导入
// 组件名称已在pages.json中注册

// 显式导入order-detail组件以确保微信小程序能正确加载
import OrderDetail from '../components/order-detail.vue'
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

// 配送方式
const deliveryType = ref('self') // 'self' 自取, 'delivery' 外卖

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

// 我们改成使用scroll-into-view而不是scroll-top
const currentCategoryId = ref('product-0')

// 分类数据
const categories = ref([
    {
        name: '招牌奶茶',
        products: [
            {
                image: '/static/images/hot01.png',
                name: '杨梅吐气',
                desc: '杨梅与气泡水的完美融合',
                price: 12.0
            },
            {
                image: '/static/images/hot02.png',
                name: '手作米麻薯',
                desc: '手工制作的米麻薯，口感Q弹',
                price: 10.0
            },
            {
                image: '/static/images/hot03.png',
                name: '满杯芭乐',
                desc: '新鲜芭乐与气泡水的完美结合',
                price: 15.0
            },
            {
                image: '/static/images/hot04.png',
                name: '抹茶奶绿',
                desc: '抹茶与奶绿的清新搭配',
                price: 10.0
            },
            {
                image: '/static/images/hot05.png',
                name: '喜凤梨',
                desc: '凤梨与气泡水的甜蜜组合',
                price: 12.0
            }
        ]
    },
    {
        name: '真鲜奶茶',
        products: [
            {
                image: '/static/images/new01.png',
                name: '经典奶茶',
                desc: '选用进口奶源，醇香浓郁',
                price: 15.0
            },
            {
                image: '/static/images/new02.png',
                name: '红豆奶茶',
                desc: '香甜红豆与奶茶的经典搭配',
                price: 18.0
            },
            {
                image: '/static/images/new03.png',
                name: '布丁奶茶',
                desc: 'Q弹布丁与香浓奶茶的融合',
                price: 20.0
            },
            {
                image: '/static/images/new04.png',
                name: '珍珠奶茶',
                desc: '嚼劲十足的珍珠与奶茶的完美融合',
                price: 16.0
            },
            {
                image: '/static/images/new05.png',
                name: '芋圆奶茶',
                desc: 'Q弹芋圆与丝滑奶茶的组合',
                price: 14.0
            }
        ]
    },
    {
        name: '新品种草',
        products: [
            {
                image: '/static/images/classic01.png',
                name: '芝芝莓莓',
                desc: '草莓与芝士的梦幻搭配',
                price: 22.0
            },
            {
                image: '/static/images/classic02.png',
                name: '多肉葡萄',
                desc: '多肉与葡萄的创新组合',
                price: 20.0
            },
            {
                image: '/static/images/classic03.png',
                name: '芒果雪冰',
                desc: '新鲜芒果加上细腻雪冰',
                price: 18.0
            },
            {
                image: '/static/images/classic04.png',
                name: '椰云拿铁',
                desc: '丝滑拿铁与椰云的结合',
                price: 16.0
            },
            {
                image: '/static/images/classic05.png',
                name: '桃桃乌龙',
                desc: '乌龙茶与水蜜桃的清新口味',
                price: 19.0
            }
        ]
    },
    {
        name: '清爽鲜果茶',
        products: [
            {
                image: '/static/images/fruit01.png',
                name: '满杯百香',
                desc: '新鲜百香果，酸甜可口',
                price: 16.0
            },
            {
                image: '/static/images/fruit02.png',
                name: '柠檬绿茶',
                desc: '清新柠檬与绿茶的搭配',
                price: 14.0
            },
            {
                image: '/static/images/fruit03.png',
                name: '蜜桃乌龙',
                desc: '香甜蜜桃与乌龙茶的结合',
                price: 18.0
            },
            {
                image: '/static/images/fruit04.png',
                name: '金桔柠檬',
                desc: '酸甜可口的金桔柠檬',
                price: 15.0
            },
            {
                image: '/static/images/fruit05.png',
                name: '青提乌龙',
                desc: '清爽青提与醇香乌龙茶',
                price: 17.0
            }
        ]
    }
])

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

onMounted(() => {
    calculateHeights()
})

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
const coupons = ref([
    {
        discount: '9.5',
        unit: '折',
        type: '到店、外卖',
        title: '【3月会员签到】订单95折券',
        description: '',
        expireDate: '2025-03-22 23:59:59',
        scope: '部分门店，部分商品',
        color: '#007AFF'
    },
    {
        discount: '5',
        unit: '元',
        type: '到店自取',
        title: '【新人优惠】满20减5元券',
        description: '满20元可用',
        expireDate: '2025-04-15 23:59:59',
        scope: '全部门店，部分商品',
        color: '#FF6B00'
    },
    {
        discount: '10',
        unit: '元',
        type: '外卖专享',
        title: '【周末福利】满30减10元券',
        description: '满30元可用',
        expireDate: '2025-03-30 23:59:59',
        scope: '部分门店，全部商品',
        color: '#FF2D55'
    }
])

// 使用优惠券
const useCoupon = (coupon) => {
    // 切换到菜单
    activeTab.value = 'menu'
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
    console.log('打开商品详情', category.name, product.name)
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
    console.log('添加到购物车', item)
    // 确保item包含必要的属性
    if (!item) {
        console.error('添加到购物车的商品数据为空')
        return
    }

    // 使用nextTick确保DOM更新完成
    nextTick(() => {
        // 首先尝试使用ref
        if (orderCartRef.value) {
            orderCartRef.value.addToCart(item)
        } else {
            console.warn('orderCartRef不存在，尝试其他方式获取组件')
            // 尝试从当前页面获取组件
            const pages = getCurrentPages()
            if (pages && pages.length > 0) {
                const currentPage = pages[pages.length - 1]
                if (currentPage.$refs && currentPage.$refs.orderCartRef) {
                    currentPage.$refs.orderCartRef.addToCart(item)
                } else {
                    console.error('无法获取购物车组件引用')
                }
            } else {
                console.error('无法获取当前页面实例')
            }
        }
    })
}

// 在uni-app中，onPageScroll是页面生命周期函数，不需要显式调用
// uni-app会自动调用页面的onPageScroll方法

// 在 script setup 部分添加新的方法
const openPromoDetail = (item) => {
    // 根据促销图片的标题找到对应的商品
    const product = findProductByTitle(item.title)
    if (product) {
        console.log('打开促销商品详情', item.title)
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
    padding: 20rpx 30rpx;
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
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}

.shop-location {
    flex: 1;
}

.shop-name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 6rpx;
}

.shop-distance {
    font-size: 24rpx;
    color: #999;
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
    background-color: #f5f5f5;
    border-bottom: 1rpx solid #f0f0f0;
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
    font-size: 28rpx;
    font-weight: bold;
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
    padding: 30rpx;
}

.coupon-list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.coupon-item {
    display: flex;
    height: 220rpx;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    position: relative;
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
    font-size: 80rpx;
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
    border-radius: 100rpx;
}
</style> 