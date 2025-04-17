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
                                v-for="(item, index) in btMedals"
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
import { userData, initUserData } from '../../utils/userData'
import { get, post } from '../../utils/request'

// 当前用户等级+
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
const medalTypes = reactive([])

// 季节勋章列表 - 所有可能的勋章
const allSeasonalMedals = reactive([])

// 大自然限定微章 - 所有可能的勋章
const allNatureMedals = reactive([])

// 崩铁联动限定微章 - 所有可能的勋章
const allBtMedals = reactive([])

// 等级徽章 - 所有可能的勋章
const allLevelMedals = reactive([])

// 用户的勋章数据
const seasonalMedals = reactive([])
const natureMedals = reactive([])
const btMedals = reactive([])
const levelMedals = reactive([])
const lastAcquiredMedal = ref(null)

// 从后端获取勋章类型
const fetchMedalTypes = async () => {
    try {
        const apiUrl = '/api/medals/types'

        const response = await get(
            apiUrl,
            {},
            {
                showError: true,
                loading: true,
                loadingText: '加载勋章类型中...'
            }
        )

        // 处理嵌套的响应结构
        const responseData =
            response.data && response.data.data
                ? response.data.data
                : response.data && response.data.code === 200
                ? response.data.data
                : null

        if (responseData) {
            // 清空原数组
            medalTypes.splice(0, medalTypes.length)
            // 添加新数据 - 正确解析返回的数据结构
            responseData.forEach((type) => {
                medalTypes.push(type.typeName)
            })
        } else {
            // 设置默认类型，防止页面空白
            medalTypes.splice(
                0,
                medalTypes.length,
                '二十四节气限定',
                '大自然限定微章',
                '崩铁联动限定',
                '等级徽章'
            )
        }
    } catch (error) {
        // 设置默认类型，防止页面空白
        medalTypes.splice(
            0,
            medalTypes.length,
            '二十四节气限定',
            '大自然限定微章',
            '崩铁联动限定',
            '等级徽章'
        )
    }
}

// 从后端获取所有勋章
const fetchAllMedals = async () => {
    try {
        const apiUrl = '/api/medals'

        const response = await get(
            apiUrl,
            {},
            {
                showError: true,
                loading: true,
                loadingText: '加载勋章数据中...'
            }
        )

        // 处理嵌套的响应结构
        const responseData =
            response.data && response.data.data
                ? response.data.data
                : response.data && response.data.code === 200
                ? response.data.data
                : null

        if (responseData) {
            // 根据类型分类勋章
            const medals = responseData

            // 清空原数组
            allSeasonalMedals.splice(0, allSeasonalMedals.length)
            allNatureMedals.splice(0, allNatureMedals.length)
            allBtMedals.splice(0, allBtMedals.length)
            allLevelMedals.splice(0, allLevelMedals.length)

            // 分类添加
            medals.forEach((medal) => {
                const medalData = {
                    id: medal.medalId,
                    name: medal.medalName,
                    icon:
                        medal.iconPath ||
                        medal.icon ||
                        `../../static/images/medal/${medal.medalId}.png`,
                    isActive: false,
                    description: medal.description
                }

                // 根据类型分类
                if (medal.type && medal.type.typeId) {
                    const typeId = medal.type.typeId
                    if (typeId === 'seasonal') {
                        allSeasonalMedals.push(medalData)
                    } else if (typeId === 'nature') {
                        allNatureMedals.push(medalData)
                    } else if (typeId === 'starrail') {
                        allBtMedals.push(medalData)
                    } else if (typeId === 'rank') {
                        allLevelMedals.push(medalData)
                    }
                }
            })
        } else {
            // 加载默认数据，以防请求失败
            loadDefaultMedalData()
        }
    } catch (error) {
        // 加载默认数据，以防请求失败
        loadDefaultMedalData()
    }
}

// 加载默认勋章数据，当API请求失败时使用
const loadDefaultMedalData = () => {
    // 清空原数组
    allSeasonalMedals.splice(0, allSeasonalMedals.length)
    allNatureMedals.splice(0, allNatureMedals.length)
    allBtMedals.splice(0, allBtMedals.length)
    allLevelMedals.splice(0, allLevelMedals.length)

    // 添加一些默认勋章数据
    // 节气勋章
    allSeasonalMedals.push(
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
        }
    )

    // 大自然勋章
    allNatureMedals.push(
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
        }
    )

    // 崩铁勋章
    allBtMedals.push(
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
        }
    )

    // 等级勋章
    allLevelMedals.push(
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
        }
    )
}

// 获取用户信息
const fetchUserProfile = async () => {
    try {
        // 从本地存储获取用户ID
        const userInfo = uni.getStorageSync('userInfo')
        if (!userInfo || !userInfo.userId) {
            return
        }

        const userId = userInfo.userId
        const apiUrl = `/api/user/profile-info?userId=${userId}`

        const response = await get(
            apiUrl,
            {},
            {
                showError: true,
                loading: true,
                loadingText: '加载用户信息中...'
            }
        )

        // 处理嵌套的响应结构
        const responseData =
            response.data && response.data.data
                ? response.data.data
                : response.data && response.data.code === 200
                ? response.data.data
                : null

        if (responseData) {
            const userData = responseData

            // 更新用户头像
            userAvatar.value = userData.avatar || '/static/images/avatar.png'

            // 更新用户昵称
            userNickname.value = userData.nickname || '熊猫奶茶会员'

            // 更新用户等级
            userLevel.value = userData.memberLevel || 1

            // 更新点亮星数量
            userState.lightningStars = userData.lightningStars || 0

            // 更新勋章信息
            userState.medals = userData.medals || []
        }
    } catch (error) {
        // 错误处理但不输出到控制台
    }
}

// 从后端获取用户拥有的勋章
const getUserMedals = async () => {
    try {
        // 确保用户数据已初始化
        await initUserData()

        // 从本地存储获取用户ID
        const userInfo = uni.getStorageSync('userInfo')
        if (!userInfo || !userInfo.userId) {
            return
        }

        const userId = userInfo.userId
        const apiUrl = `/api/medals/user/${userId}`

        const response = await get(
            apiUrl,
            {},
            {
                showError: true,
                loading: true,
                loadingText: '加载用户勋章中...'
            }
        )

        // 处理嵌套的响应结构
        const responseData =
            response.data && response.data.data
                ? response.data.data
                : response.data && response.data.code === 200
                ? response.data.data
                : null

        if (responseData) {
            // 清空原数组
            seasonalMedals.splice(0, seasonalMedals.length)
            natureMedals.splice(0, natureMedals.length)
            btMedals.splice(0, btMedals.length)
            levelMedals.splice(0, levelMedals.length)

            // 获取用户拥有的勋章信息
            const userMedalsData = responseData.medals || responseData || []

            // 创建一个映射来快速查找用户拥有的勋章
            const userMedalMap = new Map()
            userMedalsData.forEach((item) => {
                // 适配不同的数据结构
                if (item.medal && item.medal.medalId) {
                    userMedalMap.set(item.medal.medalId, {
                        isActive: item.isActive,
                        obtainTime: item.obtainTime,
                        medal: item.medal
                    })
                } else if (item.medalId) {
                    // 直接包含medalId的情况
                    userMedalMap.set(item.medalId, {
                        isActive: item.isActive || true,
                        obtainTime:
                            item.obtainTime || item.claimTime || new Date(),
                        medal: item
                    })
                }
            })

            // 复制所有勋章并标记激活状态
            allSeasonalMedals.forEach((medal) => {
                const clonedMedal = { ...medal }
                const userMedal = userMedalMap.get(medal.id)
                clonedMedal.isActive = userMedal ? userMedal.isActive : false
                clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null
                seasonalMedals.push(clonedMedal)
            })

            allNatureMedals.forEach((medal) => {
                const clonedMedal = { ...medal }
                const userMedal = userMedalMap.get(medal.id)
                clonedMedal.isActive = userMedal ? userMedal.isActive : false
                clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null
                natureMedals.push(clonedMedal)
            })

            allBtMedals.forEach((medal) => {
                const clonedMedal = { ...medal }
                const userMedal = userMedalMap.get(medal.id)
                clonedMedal.isActive = userMedal ? userMedal.isActive : false
                clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null
                btMedals.push(clonedMedal)
            })

            allLevelMedals.forEach((medal) => {
                const clonedMedal = { ...medal }
                const userMedal = userMedalMap.get(medal.id)
                clonedMedal.isActive = userMedal ? userMedal.isActive : false
                clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null
                levelMedals.push(clonedMedal)
            })

            // 设置最近获得的勋章（根据获取时间排序）
            if (userMedalsData.length > 0) {
                // 根据obtainTime排序
                const sortedMedals = [...userMedalsData].sort((a, b) => {
                    const timeA =
                        a.obtainTime || a.claimTime
                            ? new Date(a.obtainTime || a.claimTime).getTime()
                            : 0
                    const timeB =
                        b.obtainTime || b.claimTime
                            ? new Date(b.obtainTime || b.claimTime).getTime()
                            : 0
                    return timeB - timeA // 降序，最新获得的排在前面
                })

                // 获取最近获得勋章的ID
                const lastMedal = sortedMedals[0]
                if (lastMedal) {
                    const lastMedalId = lastMedal.medal
                        ? lastMedal.medal.medalId
                        : lastMedal.medalId || null

                    if (lastMedalId) {
                        // 在所有勋章中查找完整信息
                        const allMedals = [
                            ...allSeasonalMedals,
                            ...allNatureMedals,
                            ...allBtMedals,
                            ...allLevelMedals
                        ]
                        lastAcquiredMedal.value =
                            allMedals.find(
                                (medal) => medal.id === lastMedalId
                            ) || null
                    }
                }
            }

            // 更新用户状态中的勋章数量显示
            userState.medals = userMedalsData
        } else {
            // Fallback: 将所有勋章复制为未激活状态
            setAllMedalsInactive()
        }
    } catch (error) {
        // Fallback: 将所有勋章复制为未激活状态
        setAllMedalsInactive()
    }
}

// 辅助函数：将所有勋章设置为未激活状态
const setAllMedalsInactive = () => {
    seasonalMedals.splice(0, seasonalMedals.length)
    natureMedals.splice(0, natureMedals.length)
    btMedals.splice(0, btMedals.length)
    levelMedals.splice(0, levelMedals.length)

    seasonalMedals.push(
        ...allSeasonalMedals.map((medal) => ({ ...medal, isActive: false }))
    )
    natureMedals.push(
        ...allNatureMedals.map((medal) => ({ ...medal, isActive: false }))
    )
    btMedals.push(
        ...allBtMedals.map((medal) => ({ ...medal, isActive: false }))
    )
    levelMedals.push(
        ...allLevelMedals.map((medal) => ({ ...medal, isActive: false }))
    )
}

// 初始化
onMounted(async () => {
    try {
        // 先获取用户信息
        await fetchUserProfile()

        // 再获取勋章类型和所有勋章
        await fetchMedalTypes()

        await fetchAllMedals()

        // 然后获取用户勋章
        await getUserMedals()
    } catch (error) {
        // 确保即使发生错误，页面也不会空白
        if (medalTypes.length === 0) {
            medalTypes.splice(
                0,
                medalTypes.length,
                '二十四节气限定',
                '大自然限定微章',
                '崩铁联动限定',
                '等级徽章'
            )
        }

        // 加载默认数据
        if (
            allSeasonalMedals.length === 0 &&
            allNatureMedals.length === 0 &&
            allBtMedals.length === 0 &&
            allLevelMedals.length === 0
        ) {
            loadDefaultMedalData()
            setAllMedalsInactive()
        }
    }
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
const confirmActivate = async () => {
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

    try {
        // 显示加载提示
        uni.showLoading({
            title: '点亮中...'
        })

        // 获取用户ID
        const userInfo = uni.getStorageSync('userInfo')
        if (!userInfo || !userInfo.userId) {
            uni.hideLoading()
            uni.showToast({
                title: '用户信息不存在',
                icon: 'none'
            })
            return
        }

        // 调用后端接口进行勋章点亮
        const userId = userInfo.userId
        const medalId = selectedMedal.value.id
        const apiUrl = `/api/medals/activate?userId=${userId}&medalId=${medalId}`
        const response = await post(
            apiUrl,
            {}, // 参数放在URL中，请求体为空
            {
                showError: true
            }
        )

        uni.hideLoading()

        console.log('点亮勋章响应:', response)

        if (response && response.data.code === 200) {
            // 显示成功提示
            uni.showToast({
                title: '徽章点亮成功',
                icon: 'success'
            })

            // 更新用户点亮星数量
            if (response.data && response.data.user) {
                userState.lightningStars = response.data.user.lightning_stars
            }

            // 重新获取用户信息和勋章信息
            await fetchUserProfile()
            await getUserMedals()

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
                const medalToUpdate = btMedals.find(
                    (m) => m.id === selectedMedal.value.id
                )
                if (medalToUpdate) medalToUpdate.isActive = true
            }
        } else {
            // 显示错误提示
            uni.showToast({
                title: response?.message || '徽章点亮失败',
                icon: 'none'
            })
        }
    } catch (error) {
        uni.hideLoading()
        console.error('点亮徽章失败:', error)
        uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
        })
    } finally {
        // 关闭弹窗
        showActivatePopup.value = false
        selectedMedal.value = null
        selectedMedalType.value = ''
    }
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