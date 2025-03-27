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
                <view class="medalAndStar-info">
                    <view class="medal-info">
                        <view class="medal-count">已获得微章</view>
                        <view class="medal-num">
                            {{ userState.medals ? userState.medals.length : 0 }}
                            <text class="unit">枚</text>
                        </view>
                    </view>
                    <view class="star-info">
                        <view class="star-count">点亮星</view>
                        <view class="star-num">
                            {{ userState.lightningStars || 0 }}
                            <text class="unit">颗</text>
                        </view>
                    </view>
                </view>
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
                                        'medal-wrapper-inactive':
                                            !item.isActive,
                                        'medal-wrapper-selected':
                                            !item.isActive &&
                                            selectedItemId === item.id
                                    }"
                                    @click="selectMedal(item, 'seasonal')"
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
                                <view
                                    v-if="
                                        !item.isActive &&
                                        selectedItemId === item.id
                                    "
                                    class="activate-btn"
                                    @click="handleMedalClick(item, 'seasonal')"
                                >
                                    点亮徽章
                                </view>
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
                                        'medal-wrapper-inactive':
                                            !item.isActive,
                                        'medal-wrapper-selected':
                                            !item.isActive &&
                                            selectedItemId === item.id
                                    }"
                                    @click="selectMedal(item, 'nature')"
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
                                <view
                                    v-if="
                                        !item.isActive &&
                                        selectedItemId === item.id
                                    "
                                    class="activate-btn"
                                    @click="handleMedalClick(item, 'nature')"
                                >
                                    点亮徽章
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </swiper-item>

            <!-- 崩铁联动限定 -->
            <swiper-item>
                <scroll-view
                    scroll-y="true"
                    class="medal-scroll"
                    :show-scrollbar="false"
                >
                    <view class="type-title">崩铁联动限定</view>
                    <view class="medal-grid">
                        <view class="medal-row">
                            <view
                                class="medal-item"
                                v-for="(item, index) in allBtMedals"
                                :key="index"
                            >
                                <view
                                    class="medal-wrapper"
                                    :class="{
                                        'medal-wrapper-inactive':
                                            !item.isActive,
                                        'medal-wrapper-selected':
                                            !item.isActive &&
                                            selectedItemId === item.id
                                    }"
                                    @click="selectMedal(item, 'starRail')"
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
                                <view
                                    v-if="
                                        !item.isActive &&
                                        selectedItemId === item.id
                                    "
                                    class="activate-btn"
                                    @click="handleMedalClick(item, 'starRail')"
                                >
                                    点亮徽章
                                </view>
                            </view>
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

        <!-- 点亮徽章弹窗 -->
        <view
            v-if="showActivatePopup"
            class="popup-mask"
            @click="cancelActivate"
        >
            <view class="activate-popup" @click.stop>
                <view class="popup-title">点亮徽章</view>
                <view class="popup-content">
                    <view class="popup-medal-img-container">
                        <image
                            class="popup-medal-img"
                            :src="selectedMedal?.icon"
                            mode="aspectFit"
                        ></image>
                    </view>
                    <view class="popup-medal-name">{{
                        selectedMedal?.name
                    }}</view>
                    <view class="popup-desc"
                        >是否消耗1个点亮星点亮该徽章？</view
                    >
                    <view class="popup-star-info">
                        <text>剩余点亮星：</text>
                        <text class="star-count">{{
                            userState.lightningStars || 0
                        }}</text>
                    </view>
                </view>
                <view class="popup-btns">
                    <button class="btn cancel-btn" @click="cancelActivate">
                        取消
                    </button>
                    <button
                        class="btn confirm-btn"
                        @click="confirmActivate"
                        :disabled="(userState.lightningStars || 0) <= 0"
                    >
                        {{
                            (userState.lightningStars || 0) <= 0
                                ? '点亮星不足'
                                : '确认点亮'
                        }}
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { userState, updateUserState } from '../../utils/userState'
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
    '崩铁联动限定',
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

// 崩铁联动限定微章 - 所有可能的勋章
const allBtMedals = reactive([
    {
        id: 'star_medal_01',
        name: '开拓者-穹',
        icon: '../../static/images/medal/bt-star-01.png',
        isActive: false
    },
    {
        id: 'star_medal_02',
        name: '开拓者-星',
        icon: '../../static/images/medal/bt-star-02.png',
        isActive: false
    },
    {
        id: 'star_medal_03',
        name: '垃圾桶',
        icon: '../../static/images/medal/bt-star-03.png',
        isActive: false
    },
    {
        id: 'star_medal_04',
        name: '景元',
        icon: '../../static/images/medal/bt-star-04.png',
        isActive: false
    },
    {
        id: 'star_medal_05',
        name: '星核猎手-卡芙卡',
        icon: '../../static/images/medal/bt-star-05.png',
        isActive: false
    },
    {
        id: 'star_medal_06',
        name: '星核猎手-刃',
        icon: '../../static/images/medal/bt-star-06.png',
        isActive: false
    },
    {
        id: 'star_medal_07',
        name: '开拓者-三月七',
        icon: '../../static/images/medal/bt-star-07.png',
        isActive: false
    },
    {
        id: 'star_medal_08',
        name: '开拓者-姬子',
        icon: '../../static/images/medal/bt-star-08.png',
        isActive: false
    },
    {
        id: 'star_medal_09',
        name: '开拓者-瓦尔特',
        icon: '../../static/images/medal/bt-star-09.png',
        isActive: false
    },
    {
        id: 'star_medal_10',
        name: '开拓者-丹恒',
        icon: '../../static/images/medal/bt-star-10.png',
        isActive: false
    },
    {
        id: 'star_medal_11',
        name: '假面愚者-花火',
        icon: '../../static/images/medal/bt-star-11.png',
        isActive: false
    },
    {
        id: 'star_medal_12',
        name: '假面愚者-桑博',
        icon: '../../static/images/medal/bt-star-12.png',
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
const seasonalMedals = reactive([...allSeasonalMedals])
const natureMedals = reactive([...allNatureMedals])
const levelMedals = reactive([...allLevelMedals])
const lastAcquiredMedal = ref(null)

// 初始化用户勋章数据
const initUserMedals = () => {
    if (!userState || !userState.medals || !Array.isArray(userState.medals)) {
        return
    }

    // 获取用户各类型勋章
    const userSeasonalMedals = getUserMedalsByType(userState.medals, 'seasonal')
    const userNatureMedals = getUserMedalsByType(userState.medals, 'nature')
    const userLevelMedals = getUserMedalsByType(userState.medals, 'level')
    const userStarRailMedals = getUserMedalsByType(userState.medals, 'starRail')

    // 更新季节勋章激活状态
    seasonalMedals.forEach((medal) => {
        const userMedal = userSeasonalMedals.find((m) => m.id === medal.id)
        // 如果找到用户勋章，并且勋章的isActive不是显式设为false，则认为是激活的
        medal.isActive = userMedal ? userMedal.isActive !== false : false
    })

    // 更新自然勋章激活状态
    natureMedals.forEach((medal) => {
        const userMedal = userNatureMedals.find((m) => m.id === medal.id)
        // 如果找到用户勋章，并且勋章的isActive不是显式设为false，则认为是激活的
        medal.isActive = userMedal ? userMedal.isActive !== false : false
    })

    // 更新崩铁联动勋章激活状态
    allBtMedals.forEach((medal) => {
        const userMedal = userStarRailMedals.find((m) => m.id === medal.id)
        // 如果找到用户勋章，并且勋章的isActive不是显式设为false，则认为是激活的
        medal.isActive = userMedal ? userMedal.isActive !== false : false
    })

    // 更新等级勋章激活状态
    levelMedals.forEach((medal, index) => {
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

// 新增的selectedItemId，用于记录当前选中的徽章ID
const selectedItemId = ref(null)

// 选择徽章，显示点亮按钮
const selectMedal = (medal, type) => {
    // 如果徽章已激活，不做任何处理
    if (medal.isActive) {
        return
    }

    // 如果点击的是当前选中的徽章，则取消选中（切换效果）
    if (selectedItemId.value === medal.id) {
        selectedItemId.value = null
    } else {
        // 否则，选中该徽章
        selectedItemId.value = medal.id
    }

    console.log('当前选中徽章ID:', selectedItemId.value)
}

// 处理徽章点击事件 - 现在只在点击"点亮徽章"按钮时调用
const handleMedalClick = (medal, type) => {
    // 显示点亮徽章弹窗
    selectedMedal.value = medal
    selectedMedalType.value = type
    showActivatePopup.value = true
    // 隐藏点亮按钮
    selectedItemId.value = null
}

// 点亮徽章相关状态
const showActivatePopup = ref(false)
const selectedMedal = ref(null)
const selectedMedalType = ref('')

// 取消点亮
const cancelActivate = () => {
    showActivatePopup.value = false
    selectedMedal.value = null
    selectedMedalType.value = ''
}

// 确认点亮
const confirmActivate = () => {
    // 检查点亮星是否足够
    if (!userState.lightningStars || userState.lightningStars <= 0) {
        uni.showToast({
            title: '点亮星不足',
            icon: 'none'
        })
        return
    }

    if (!selectedMedal.value || !selectedMedalType.value) {
        return
    }

    // 获取徽章类型的中文描述
    let typeDescription = '限定徽章'
    switch (selectedMedalType.value) {
        case 'seasonal':
            typeDescription = '二十四节气限定徽章'
            break
        case 'nature':
            typeDescription = '大自然限定徽章'
            break
        case 'starRail':
            typeDescription = '星穹铁道限定徽章'
            break
    }

    // 创建新的勋章对象
    const newMedal = {
        id: selectedMedal.value.id,
        name: selectedMedal.value.name,
        icon: selectedMedal.value.icon,
        type: selectedMedalType.value,
        description: `${typeDescription}：${selectedMedal.value.name}`,
        acquireTime: Date.now(),
        isActive: true
    }

    // 准备当前用户的勋章列表，确保不重复添加
    const currentMedals = [...(userState.medals || [])]
    const medalExists = currentMedals.some((medal) => medal.id === newMedal.id)

    // 只有当勋章不存在时才添加到列表中
    const updatedMedals = medalExists
        ? currentMedals
        : [...currentMedals, newMedal]

    // 更新用户信息：减少点亮星，添加新勋章
    const updatedUserInfo = {
        lightningStars: userState.lightningStars - 1,
        medals: updatedMedals
    }

    // 更新用户状态
    const success = updateUserState(updatedUserInfo)

    if (success) {
        // 显示成功提示
        uni.showToast({
            title: '徽章点亮成功',
            icon: 'success'
        })

        // 重新初始化勋章数据，确保UI更新
        initUserMedals()

        // 更新本地勋章状态，确保UI立即反映变化
        if (selectedMedalType.value === 'seasonal') {
            const medalToUpdate = seasonalMedals.find(
                (m) => m.id === selectedMedal.value.id
            )
            if (medalToUpdate) medalToUpdate.isActive = true
        } else if (selectedMedalType.value === 'nature') {
            const medalToUpdate = natureMedals.find(
                (m) => m.id === selectedMedal.value.id
            )
            if (medalToUpdate) medalToUpdate.isActive = true
        } else if (selectedMedalType.value === 'starRail') {
            const medalToUpdate = allBtMedals.find(
                (m) => m.id === selectedMedal.value.id
            )
            if (medalToUpdate) medalToUpdate.isActive = true
        }
    } else {
        uni.showToast({
            title: '徽章点亮失败',
            icon: 'none'
        })
    }

    // 关闭弹窗
    showActivatePopup.value = false
    selectedMedal.value = null
    selectedMedalType.value = ''
}
</script>

<style lang="scss" scoped>
.medal-container {
    background-color: #f2f6ff;
    min-height: 100vh;
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
    z-index: 0;
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
    width: 200rpx;
    height: 200rpx;
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

// medalAndStar-info 样式
.medalAndStar-info {
    display: flex;
    width: 380rpx;
    margin-top: 10rpx;
}

.medal-info,
.star-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.medal-info {
    margin-right: 40rpx;
}

.medal-count,
.star-count {
    color: #666;
    font-size: 26rpx;
    margin-bottom: 6rpx;
}

.medal-num {
    font-size: 48rpx;
    font-weight: bold;
    color: #0fa5f5;
}

.star-num {
    font-size: 48rpx;
    font-weight: bold;
    color: #ff9500;
}

.unit {
    font-size: 24rpx;
    font-weight: normal;
}

// 点亮徽章弹窗
.popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.activate-popup {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    width: 80%;
    max-width: 600rpx;
}

.popup-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.popup-content {
    margin-bottom: 20rpx;
}

.popup-medal-img-container {
    width: 200rpx;
    height: 200rpx;
    margin: 0 auto 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
    background-color: #f5f5f5;
}

.popup-medal-img {
    width: 180rpx;
    height: 180rpx;
    object-fit: contain;
}

.popup-medal-name {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
}

.popup-desc {
    color: #666;
    margin-bottom: 20rpx;
}

.popup-star-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.star-count {
    font-size: 28rpx;
    font-weight: bold;
    margin-left: 10rpx;
}

.popup-btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
}

.btn {
    padding: 10rpx 20rpx;
    border: none;
    width: 200rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
    cursor: pointer;
}

.cancel-btn {
    background-color: #ddd;
}

.confirm-btn {
    background-color: #008ef5;
    color: #fff;
}

.confirm-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.activate-btn {
    background-color: #ff9500;
    color: #fff;
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    margin-top: 6rpx;
}

.medal-wrapper-selected {
    border: 3rpx solid #ff9500;
    box-shadow: 0 0 10rpx rgba(255, 149, 0, 0.5);
}

.medal-wrapper-selected .inactive-medal {
    filter: grayscale(0%) opacity(70%);
}

.medal-wrapper,
.medal-name,
.activate-btn {
    position: relative;
    z-index: 5;
}
</style>