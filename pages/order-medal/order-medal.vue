<template>
    <view class="medal-container">
        <!-- 用户勋章信息 -->
        <view class="user-medal-info">
            <image
                class="bg-image"
                src="../../static/images/medal/medal-bg.png"
            ></image>
            <!-- 返回按钮 -->
            <view class="back-btn" @click="goBack">
                <uni-icons
                    type="left"
                    size="24"
                    color="#fff"
                    class="back-icon"
                ></uni-icons>
            </view>
            <view class="user-info-left">
                <view class="username">
                    <view class="avatar">
                        <image
                            class="avatar-image"
                            :src="userAvatar || '/static/images/avatar'"
                            @error="handleAvatarError"
                        ></image>
                    </view>
                    <text>{{ userNickname }}</text>
                    <view class="user-level">Lv{{ userLevel }}</view>
                </view>
                <view class="medal-count">已获得微章</view>
                <view class="medal-num"
                    >{{ totalActiveMedals }} <text class="unit">枚</text></view
                >
            </view>
            <view class="recent-medal">
                <image
                    class="medal-image"
                    :src="lastAcquiredMedal?.icon"
                ></image>
                <view class="recent-tag">最近获得</view>
            </view>
        </view>

        <!-- 勋章类型导航 -->
        <scroll-view
            class="medal-nav"
            scroll-x="true"
            :scroll-left="navScrollLeft"
            :show-scrollbar="false"
        >
            <view
                v-for="(item, index) in medalTypes"
                :key="index"
                class="nav-item"
                :class="{ active: currentType === index }"
                @click="switchType(index)"
            >
                <text>{{ item }}</text>
            </view>
        </scroll-view>

        <!-- 勋章展示区域 -->
        <swiper
            class="medal-swiper"
            :current="currentType"
            @change="swiperChange"
        >
            <!-- 二十四节气限定 -->
            <swiper-item>
                <scroll-view
                    scroll-y="true"
                    class="medal-scroll"
                    :show-scrollbar="false"
                >
                    <view class="type-title">二十四节气限定</view>
                    <view class="medal-grid">
                        <view class="medal-row">
                            <view
                                class="medal-item"
                                v-for="(item, index) in seasonalMedals"
                                :key="index"
                            >
                                <view
                                    class="medal-wrapper"
                                    :class="{
                                        'medal-wrapper-inactive': !item.isActive
                                    }"
                                >
                                    <image
                                        class="medal-pic"
                                        :src="item.icon"
                                        :class="{
                                            'inactive-medal': !item.isActive
                                        }"
                                    ></image>
                                </view>
                                <text
                                    class="medal-name"
                                    :class="{ 'inactive-text': !item.isActive }"
                                    >{{ item.name }}</text
                                >
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </swiper-item>

            <!-- 活动限定微章 -->
            <swiper-item>
                <scroll-view
                    scroll-y="true"
                    class="medal-scroll"
                    :show-scrollbar="false"
                >
                    <view class="type-title">大自然限定微章</view>
                    <view class="medal-grid">
                        <view class="medal-row">
                            <view
                                class="medal-item"
                                v-for="(item, index) in natureMedals"
                                :key="index"
                            >
                                <view
                                    class="medal-wrapper"
                                    :class="{
                                        'medal-wrapper-inactive': !item.isActive
                                    }"
                                >
                                    <image
                                        class="medal-pic"
                                        :src="item.icon"
                                        :class="{
                                            'inactive-medal': !item.isActive
                                        }"
                                    ></image>
                                </view>
                                <text
                                    class="medal-name"
                                    :class="{ 'inactive-text': !item.isActive }"
                                    >{{ item.name }}</text
                                >
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </swiper-item>

            <!-- 鲜果限定 -->
            <swiper-item>
                <scroll-view
                    scroll-y="true"
                    class="medal-scroll"
                    :show-scrollbar="false"
                >
                    <view class="type-title">鲜果限定</view>
                    <view class="medal-grid">
                        <view class="empty-tip">
                            <image
                                class="empty-icon"
                                src="../../static/images/medal/empty-icon.png"
                            ></image>
                            <text>暂无鲜果限定微章</text>
                        </view>
                    </view>
                </scroll-view>
            </swiper-item>

            <!-- 等级限定 -->
            <swiper-item>
                <scroll-view
                    scroll-y="true"
                    class="medal-scroll"
                    :show-scrollbar="false"
                >
                    <view class="type-title">等级限定</view>
                    <view class="medal-grid">
                        <view class="medal-row">
                            <view
                                class="medal-item"
                                v-for="(item, index) in levelMedals"
                                :key="index"
                            >
                                <view
                                    class="medal-wrapper"
                                    :class="{
                                        'medal-wrapper-inactive': !item.isActive
                                    }"
                                >
                                    <image
                                        class="medal-pic"
                                        :src="item.icon"
                                        :class="{
                                            'inactive-medal': !item.isActive
                                        }"
                                    ></image>
                                </view>
                                <text
                                    class="medal-name"
                                    :class="{ 'inactive-text': !item.isActive }"
                                    >{{ item.name }}</text
                                >
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </swiper-item>
        </swiper>

        <!-- 页面指示器 -->
        <view class="indicator">
            <view
                v-for="(item, index) in medalTypes"
                :key="index"
                class="indicator-dot"
                :class="{ active: currentType === index }"
            >
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { userState } from '../../utils/userState'
import { getUserMedalsByType } from '../../utils/userModel'

// 当前用户等级
const userLevel = ref(userState?.memberLevel || 1)
// 用户昵称
const userNickname = ref(userState?.nickname || '熊猫奶茶会员')
// 用户头像
const userAvatar = ref(userState?.avatar || '/static/images/avatar.png')

// 当前选中的类型索引
const currentType = ref(0)
// 导航栏滚动位置
const navScrollLeft = ref(0)

// 勋章类型
const medalTypes = reactive([
    '二十四节气限定',
    '大自然限定微章',
    '鲜果限定',
    '等级徽章'
])

// 季节勋章列表 - 所有可能的勋章
const allSeasonalMedals = reactive([
    {
        id: 'season_01',
        name: '节气 · 立春',
        icon: '../../static/images/medal/season01.png',
        isActive: false
    },
    {
        id: 'season_02',
        name: '节气 · 雨水',
        icon: '../../static/images/medal/season02.png',
        isActive: false
    },
    {
        id: 'season_03',
        name: '节气 · 惊蛰',
        icon: '../../static/images/medal/season03.png',
        isActive: false
    },
    {
        id: 'season_04',
        name: '节气 · 春分',
        icon: '../../static/images/medal/season04.png',
        isActive: false
    },
    {
        id: 'season_05',
        name: '节气 · 清明',
        icon: '../../static/images/medal/season05.png',
        isActive: false
    },
    {
        id: 'season_06',
        name: '节气 · 谷雨',
        icon: '../../static/images/medal/season06.png',
        isActive: false
    },
    {
        id: 'season_07',
        name: '节气 · 立夏',
        icon: '../../static/images/medal/season07.png',
        isActive: false
    },
    {
        id: 'season_08',
        name: '节气 · 小满',
        icon: '../../static/images/medal/season08.png',
        isActive: false
    },
    {
        id: 'season_09',
        name: '节气 · 芒种',
        icon: '../../static/images/medal/season09.png',
        isActive: false
    },
    {
        id: 'season_10',
        name: '节气 · 夏至',
        icon: '../../static/images/medal/season10.png',
        isActive: false
    },
    {
        id: 'season_11',
        name: '节气 · 小暑',
        icon: '../../static/images/medal/season11.png',
        isActive: false
    },
    {
        id: 'season_12',
        name: '节气 · 大暑',
        icon: '../../static/images/medal/season12.png',
        isActive: false
    },
    {
        id: 'season_13',
        name: '节气 · 立秋',
        icon: '../../static/images/medal/season13.png',
        isActive: false
    },
    {
        id: 'season_14',
        name: '节气 · 处暑',
        icon: '../../static/images/medal/season14.png',
        isActive: false
    },
    {
        id: 'season_15',
        name: '节气 · 白露',
        icon: '../../static/images/medal/season15.png',
        isActive: false
    },
    {
        id: 'season_16',
        name: '节气 · 秋分',
        icon: '../../static/images/medal/season16.png',
        isActive: false
    },
    {
        id: 'season_17',
        name: '节气 · 寒露',
        icon: '../../static/images/medal/season17.png',
        isActive: false
    },
    {
        id: 'season_18',
        name: '节气 · 霜降',
        icon: '../../static/images/medal/season18.png',
        isActive: false
    },
    {
        id: 'season_19',
        name: '节气 · 立冬',
        icon: '../../static/images/medal/season19.png',
        isActive: false
    },
    {
        id: 'season_20',
        name: '节气 · 小雪',
        icon: '../../static/images/medal/season20.png',
        isActive: false
    }
])

// 大自然限定微章 - 所有可能的勋章
const allNatureMedals = reactive([
    {
        id: 'nature_bee',
        name: '大自然 · 蜜蜂',
        icon: '../../static/images/medal/nature-bee.png',
        isActive: false
    },
    {
        id: 'nature_butterfly',
        name: '大自然 · 蝴蝶',
        icon: '../../static/images/medal/nature-butterfly.png',
        isActive: false
    },
    {
        id: 'nature_bird',
        name: '大自然 · 小鸟',
        icon: '../../static/images/medal/nature-bird.png',
        isActive: false
    },
    {
        id: 'nature_dragonfly',
        name: '大自然 · 蜻蜓',
        icon: '../../static/images/medal/nature-dragonfly.png',
        isActive: false
    },
    {
        id: 'nature_cactus',
        name: '大自然 · 仙人掌',
        icon: '../../static/images/medal/nature-cactus.png',
        isActive: false
    },
    {
        id: 'nature_mouse',
        name: '大自然 · 老鼠',
        icon: '../../static/images/medal/nature-mouse.png',
        isActive: false
    },
    {
        id: 'nature_duck',
        name: '大自然 · 鸭子',
        icon: '../../static/images/medal/nature-duck.png',
        isActive: false
    }
])

// 等级徽章 - 所有可能的勋章
const allLevelMedals = reactive([
    {
        id: 'rank_01',
        name: '等级 · Lv1',
        icon: '../../static/images/medal/rank01.png',
        isActive: false
    },
    {
        id: 'rank_02',
        name: '等级 · Lv2',
        icon: '../../static/images/medal/rank02.png',
        isActive: false
    },
    {
        id: 'rank_03',
        name: '等级 · Lv3',
        icon: '../../static/images/medal/rank03.png',
        isActive: false
    },
    {
        id: 'rank_04',
        name: '等级 · Lv4',
        icon: '../../static/images/medal/rank04.png',
        isActive: false
    },
    {
        id: 'rank_05',
        name: '等级 · Lv5',
        icon: '../../static/images/medal/rank05.png',
        isActive: false
    },
    {
        id: 'rank_06',
        name: '等级 · Lv6',
        icon: '../../static/images/medal/rank06.png',
        isActive: false
    }
])

// 用户的勋章数据
const seasonalMedals = ref([...allSeasonalMedals])
const natureMedals = ref([...allNatureMedals])
const levelMedals = ref([...allLevelMedals])
const lastAcquiredMedal = ref(null)

// 计算已获得的勋章总数
const totalActiveMedals = computed(() => {
    // 统计所有类型勋章中已激活的数量
    const seasonalActive = seasonalMedals.value.filter(
        (medal) => medal.isActive
    ).length
    const natureActive = natureMedals.value.filter(
        (medal) => medal.isActive
    ).length
    const levelActive = levelMedals.value.filter(
        (medal) => medal.isActive
    ).length

    // 返回总数
    return seasonalActive + natureActive + levelActive
})

// 初始化用户勋章数据
const initUserMedals = () => {
    if (!userState || !userState.medals || !Array.isArray(userState.medals)) {
        return
    }

    // 获取用户各类型勋章
    const userSeasonalMedals = getUserMedalsByType(userState.medals, 'seasonal')
    const userNatureMedals = getUserMedalsByType(userState.medals, 'nature')
    const userLevelMedals = getUserMedalsByType(userState.medals, 'level')

    // 更新季节勋章激活状态
    seasonalMedals.value.forEach((medal) => {
        const userMedal = userSeasonalMedals.find((m) => m.id === medal.id)
        medal.isActive = !!userMedal
    })

    // 更新自然勋章激活状态
    natureMedals.value.forEach((medal) => {
        const userMedal = userNatureMedals.find((m) => m.id === medal.id)
        medal.isActive = !!userMedal
    })

    // 更新等级勋章激活状态
    levelMedals.value.forEach((medal, index) => {
        medal.isActive = userLevel.value >= index + 1
    })

    // 设置最近获得的勋章（按获取时间排序）
    if (userState.medals.length > 0) {
        const sortedMedals = [...userState.medals].sort(
            (a, b) => b.acquireTime - a.acquireTime
        )
        lastAcquiredMedal.value = sortedMedals[0]
    }
}

// 页面加载时初始化用户勋章
onMounted(() => {
    initUserMedals()
})

// 切换类型方法
const switchType = (index) => {
    currentType.value = index
    // 计算导航栏滚动位置，使选中项居中
    calculateScrollLeft(index)
}

// 计算导航栏滚动位置
const calculateScrollLeft = (index) => {
    // 假设每个导航项宽度为120rpx
    const itemWidth = 120
    // 设备宽度
    const windowWidth = uni.getSystemInfoSync().windowWidth
    // 中心位置
    const center = windowWidth / 2
    // 计算滚动位置
    navScrollLeft.value = index * itemWidth - center + itemWidth / 2
    if (navScrollLeft.value < 0) {
        navScrollLeft.value = 0
    }
}

// swiper切换时触发
const swiperChange = (e) => {
    const current = e.detail.current
    currentType.value = current
    calculateScrollLeft(current)
}

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 处理头像加载错误
const handleAvatarError = () => {
    // 当头像加载失败时，将使用默认的 src 属性值（已在模板中设置）
    console.log('头像加载失败，使用默认头像')
}
</script>

<style lang="scss" scoped>
.medal-container {
    background-color: #f2f6ff;
    min-height: 100vh;
    padding-bottom: 30rpx;
}

// 头部导航
.header {
    display: none;
}

// 用户勋章信息
.user-medal-info {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 120rpx 30rpx 30rpx;
    margin-bottom: 20rpx;
    height: 300rpx;
    overflow: hidden;
}

.bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.back-btn {
    position: absolute;
    top: 100rpx;
    left: 30rpx;
    z-index: 10;
}

.user-info-left {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 40rpx;
}

.username {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    color: #333;
}

.avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: #6080e5;
    margin-right: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dot {
    display: inline-block;
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background-color: #6080e5;
}

.medal-count {
    color: #666;
    font-size: 28rpx;
    margin-bottom: 10rpx;
}

.medal-num {
    font-size: 60rpx;
    font-weight: bold;
    color: #333;
}

.unit {
    font-size: 30rpx;
    font-weight: normal;
}

.user-level {
    font-size: 24rpx;
    font-weight: bold;
    color: #fff;
    background-color: #008ef5;
    border-radius: 14rpx;
    padding: 4rpx 12rpx;
    margin-left: 16rpx;
}

// 最近获得勋章
.recent-medal {
    position: relative;
    width: 180rpx;
    height: 180rpx;
    z-index: 1;
}

.medal-hexagon {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.medal-image {
    position: absolute;
    width: 120rpx;
    height: 120rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    z-index: 2;
}

.recent-tag {
    width: 100rpx;
    position: absolute;
    bottom: 5rpx;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffcc55;
    color: #333;
    font-size: 20rpx;
    padding: 5px;
    border-radius: 10rpx;
    z-index: 3;
    text-align: center;
    font-weight: 600;
}

// 勋章类型导航
.medal-nav {
    display: flex;
    white-space: nowrap;
    background-color: #fff;
    padding: 20rpx 0;
    border-radius: 16rpx 16rpx 0 0;
    margin-top: -20rpx;
    position: relative;
    z-index: 5;
}

.nav-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 10rpx;
}

.nav-item.active {
    background-color: #008ef5;
    color: #fff;
    font-weight: 500;
}

// 勋章展示区域
.medal-swiper {
    height: calc(100vh - 500rpx);
    background-color: #fff;
}

.medal-scroll {
    height: 100%;
}

.type-title {
    font-size: 30rpx;
    font-weight: 500;
    padding: 20rpx 30rpx;
}

.medal-grid {
    padding: 20rpx;
}

.medal-row {
    display: flex;
    flex-wrap: wrap;
}

.medal-item {
    width: 33.333%;
    margin-bottom: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.medal-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10rpx;
}

.medal-wrapper-inactive {
    // 移除指针样式，因为等级徽章不可点击
    // cursor: pointer;
}

.medal-wrapper-inactive:hover .inactive-medal {
    filter: grayscale(0%) opacity(100%);
    transform: scale(1.05);
}

.medal-pic {
    width: 100%;
    height: 100%;
    transition: all 0.5s ease;
}

.inactive-medal {
    filter: grayscale(30%) opacity(30%);
}

.medal-name {
    font-size: 26rpx;
    color: #666;
}

.inactive-text {
    color: #999;
}

// 空状态
.empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
    color: #999;
    font-size: 28rpx;
}

.empty-icon {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
}

// 指示器
.indicator {
    display: flex;
    justify-content: center;
    padding: 20rpx 0;
}

.indicator-dot {
    width: 16rpx;
    height: 6rpx;
    background-color: #ddd;
    margin: 0 6rpx;
    border-radius: 3rpx;
}

.indicator-dot.active {
    width: 30rpx;
    background-color: #407bff;
}
.avatar-image {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

// 修改scroll-view元素
.medal-nav::-webkit-scrollbar {
    display: none;
}

.medal-scroll::-webkit-scrollbar {
    display: none;
}

// 兼容性处理
.medal-nav,
.medal-scroll {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}
</style>