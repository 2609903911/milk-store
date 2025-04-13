<template>
    <view class="city-selector">
        <!-- 热门城市区域 -->
        <view class="section hot-cities">
            <view class="section-title">热门城市</view>
            <view class="city-grid">
                <view
                    class="city-item"
                    v-for="city in hotCities"
                    :key="city.name"
                    @tap="selectCity(city)"
                >
                    {{ city.name }}
                </view>
            </view>
        </view>

        <!-- 按字母排序的城市列表 -->
        <scroll-view class="city-list" scroll-y>
            <view
                class="letter-section"
                v-for="(cities, letter) in cityMap"
                :key="letter"
                :id="letter"
            >
                <view class="letter-title">{{ letter }}</view>
                <view class="letter-cities">
                    <view
                        class="city-item-full"
                        v-for="city in cities"
                        :key="city.name"
                        @tap="selectCity(city)"
                    >
                        {{ city.name }}
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 字母索引 -->
        <view class="letter-index">
            <view
                class="letter-index-item"
                v-for="letter in letters"
                :key="letter"
                @tap="scrollToLetter(letter)"
            >
                {{ letter }}
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-container" v-if="isLoading">
            <view class="loading-text">加载中...</view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 城市数据
const hotCities = ref([])
const letters = ref([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'W',
    'X',
    'Y',
    'Z'
])
const cityMap = reactive({})
const isLoading = ref(false)

// 从后端获取城市数据
const fetchCityData = async () => {
    isLoading.value = true
    try {
        console.log('开始获取城市数据...')
        const response = await uni.request({
            url: 'http://localhost:8082/api/cities',
            method: 'GET'
        })

        if (response.statusCode === 200 && response.data.code === 200) {
            console.log('城市数据获取成功')

            // 获取热门城市
            hotCities.value = response.data.data.hotCities || []

            // 获取按字母分组的城市映射
            const citiesByLetter = response.data.data.cityMap || {}

            // 清空旧数据
            Object.keys(cityMap).forEach((key) => {
                delete cityMap[key]
            })

            // 添加新数据
            Object.keys(citiesByLetter).forEach((letter) => {
                cityMap[letter] = citiesByLetter[letter]
            })

            console.log(
                '城市数据处理完成，共有热门城市：',
                hotCities.value.length,
                '个'
            )
        } else {
            console.error('获取城市数据失败:', response.data.message)
            // 加载本地备用数据
            loadLocalCityData()
        }
    } catch (error) {
        console.error('城市数据请求异常:', error)
        // 请求失败时加载本地备用数据
        loadLocalCityData()
    } finally {
        isLoading.value = false
    }
}

// 本地备用数据，当API请求失败时使用
const loadLocalCityData = () => {
    console.log('加载本地备用城市数据')

    // 热门城市备用数据
    hotCities.value = [
        {
            name: '北京',
            code: '110000',
            latitude: 39.9042,
            longitude: 116.4074
        },
        {
            name: '上海',
            code: '310000',
            latitude: 31.2304,
            longitude: 121.4737
        },
        {
            name: '广州',
            code: '440100',
            latitude: 23.1293,
            longitude: 113.2644
        },
        {
            name: '深圳',
            code: '440300',
            latitude: 22.5431,
            longitude: 114.0579
        },
        {
            name: '成都',
            code: '510100',
            latitude: 30.5728,
            longitude: 104.0668
        },
        {
            name: '杭州',
            code: '330100',
            latitude: 30.2741,
            longitude: 120.1551
        },
        {
            name: '武汉',
            code: '420100',
            latitude: 30.5928,
            longitude: 114.3055
        },
        { name: '西安', code: '610100', latitude: 34.3416, longitude: 108.94 },
        {
            name: '南京',
            code: '320100',
            latitude: 32.0603,
            longitude: 118.7969
        },
        {
            name: '长沙',
            code: '430100',
            latitude: 28.2282,
            longitude: 112.9388
        },
        { name: '重庆', code: '500000', latitude: 29.563, longitude: 106.5516 },
        { name: '郑州', code: '410100', latitude: 34.7472, longitude: 113.6249 }
    ]

    // 获取城市数据
    const cities = [
        // A
        {
            name: '阿拉善盟',
            pinyin: 'alashanmeng',
            code: '152900',
            latitude: 38.843,
            longitude: 105.7284
        },
        {
            name: '安康',
            pinyin: 'ankang',
            code: '610900',
            latitude: 32.6903,
            longitude: 109.0294
        },
        {
            name: '安庆',
            pinyin: 'anqing',
            code: '340800',
            latitude: 30.5434,
            longitude: 117.0425
        },
        {
            name: '鞍山',
            pinyin: 'anshan',
            code: '210300',
            latitude: 41.1079,
            longitude: 122.9943
        },
        {
            name: '安顺',
            pinyin: 'anshun',
            code: '520400',
            latitude: 26.2455,
            longitude: 105.932
        },

        // B
        {
            name: '北京',
            pinyin: 'beijing',
            code: '110000',
            latitude: 39.9042,
            longitude: 116.4074
        }
        // 省略其他城市...
    ]

    // 按字母分类
    letters.forEach((letter) => {
        cityMap[letter] = cities.filter((city) => {
            const firstLetter = city.pinyin.charAt(0).toUpperCase()
            return firstLetter === letter
        })
    })
}

// 选择城市
const selectCity = (city) => {
    uni.setStorageSync('selectedCity', city)

    // 使用全局事件总线
    uni.$emit('citySelected', {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude
    })

    // 检查页面栈，如果有上一页则返回，否则重定向到地图页
    const pages = getCurrentPages()
    if (pages.length > 1) {
        uni.navigateBack()
    } else {
        uni.redirectTo({
            url: '/pages/map/map'
        })
    }
}

// 滚动到指定字母区域
const scrollToLetter = (letter) => {
    uni.createSelectorQuery()
        .select(`#${letter}`)
        .boundingClientRect(function (res) {
            if (res) {
                uni.pageScrollTo({
                    scrollTop: res.top,
                    duration: 0
                })
            }
        })
        .exec()
}

// 页面加载时获取城市数据
onMounted(() => {
    fetchCityData()
})
</script>

<style>
.city-selector {
    background-color: #f8f8f8;
    min-height: 100vh;
    position: relative;
    padding-bottom: 30rpx;
}

.section {
    margin-bottom: 20rpx;
    background-color: #fff;
    padding: 20rpx 30rpx;
}

.section-title {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 20rpx;
}

/* 热门城市网格 */
.city-grid {
    display: flex;
    flex-wrap: wrap;
}

.city-item {
    width: calc(25% - 20rpx);
    height: 70rpx;
    background-color: #f5f5f5;
    margin: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
}

/* 字母分类的城市列表 */
.city-list {
    height: calc(100vh - 250rpx);
    background-color: #fff;
    padding: 0 30rpx;
}

.letter-section {
    padding: 10rpx 0;
}

.letter-title {
    font-size: 28rpx;
    color: #666;
    padding: 15rpx 0;
    background-color: #f8f8f8;
    position: sticky;
    top: 0;
    z-index: 10;
}

.letter-cities {
    padding: 0;
}

.city-item-full {
    padding: 20rpx 0;
    font-size: 30rpx;
    color: #333;
    border-bottom: 1px solid #eee;
}

/* 字母索引 */
.letter-index {
    position: fixed;
    right: 10rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    padding: 10rpx 5rpx;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 30rpx;
    z-index: 100;
}

.letter-index-item {
    font-size: 24rpx;
    color: #333;
    padding: 4rpx;
    text-align: center;
}

/* 加载状态 */
.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-text {
    font-size: 32rpx;
    color: #333;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20rpx 40rpx;
    border-radius: 10rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
</style>
