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
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 热门城市
const hotCities = ref([
    { name: '北京', code: '110000' },
    { name: '上海', code: '310000' },
    { name: '广州', code: '440100' },
    { name: '深圳', code: '440300' },
    { name: '成都', code: '510100' },
    { name: '杭州', code: '330100' },
    { name: '武汉', code: '420100' },
    { name: '西安', code: '610100' },
    { name: '南京', code: '320100' },
    { name: '长沙', code: '430100' },
    { name: '重庆', code: '500000' },
    { name: '郑州', code: '410100' }
])

// 字母索引
const letters = [
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
]

// 字母对应城市映射
const cityMap = reactive({})

// 获取城市数据
const fetchCityData = async () => {
    try {
        // 这里使用静态数据，每个字母保留5-8个城市，并添加地图坐标
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
            },
            {
                name: '包头',
                pinyin: 'baotou',
                code: '150200',
                latitude: 40.6567,
                longitude: 109.8405
            },
            {
                name: '保定',
                pinyin: 'baoding',
                code: '130600',
                latitude: 38.8671,
                longitude: 115.4845
            },
            {
                name: '蚌埠',
                pinyin: 'bengbu',
                code: '340300',
                latitude: 32.9158,
                longitude: 117.389
            },
            {
                name: '北海',
                pinyin: 'beihai',
                code: '450500',
                latitude: 21.4812,
                longitude: 109.1199
            },
            {
                name: '宝鸡',
                pinyin: 'baoji',
                code: '610300',
                latitude: 34.3609,
                longitude: 107.2349
            },

            // C
            {
                name: '长春',
                pinyin: 'changchun',
                code: '220100',
                latitude: 43.8168,
                longitude: 125.3235
            },
            {
                name: '长沙',
                pinyin: 'changsha',
                code: '430100',
                latitude: 28.2282,
                longitude: 112.9388
            },
            {
                name: '成都',
                pinyin: 'chengdu',
                code: '510100',
                latitude: 30.5728,
                longitude: 104.0668
            },
            {
                name: '重庆',
                pinyin: 'chongqing',
                code: '500000',
                latitude: 29.563,
                longitude: 106.5516
            },
            {
                name: '常州',
                pinyin: 'changzhou',
                code: '320400',
                latitude: 31.8105,
                longitude: 119.974
            },
            {
                name: '沧州',
                pinyin: 'cangzhou',
                code: '130900',
                latitude: 38.3037,
                longitude: 116.8388
            },

            // D
            {
                name: '大连',
                pinyin: 'dalian',
                code: '210200',
                latitude: 38.9138,
                longitude: 121.6147
            },
            {
                name: '东莞',
                pinyin: 'dongguan',
                code: '441900',
                latitude: 23.021,
                longitude: 113.7518
            },
            {
                name: '大庆',
                pinyin: 'daqing',
                code: '230600',
                latitude: 46.5907,
                longitude: 125.1048
            },
            {
                name: '大同',
                pinyin: 'datong',
                code: '140200',
                latitude: 40.0903,
                longitude: 113.3001
            },
            {
                name: '德州',
                pinyin: 'dezhou',
                code: '371400',
                latitude: 37.4363,
                longitude: 116.3596
            },

            // E
            {
                name: '鄂尔多斯',
                pinyin: 'eerduosi',
                code: '150600',
                latitude: 39.6086,
                longitude: 109.781
            },
            {
                name: '恩施',
                pinyin: 'enshi',
                code: '422800',
                latitude: 30.272,
                longitude: 109.4882
            },
            {
                name: '鄂州',
                pinyin: 'ezhou',
                code: '420700',
                latitude: 30.395,
                longitude: 114.8951
            },

            // F
            {
                name: '佛山',
                pinyin: 'foshan',
                code: '440600',
                latitude: 23.0218,
                longitude: 113.122
            },
            {
                name: '福州',
                pinyin: 'fuzhou',
                code: '350100',
                latitude: 26.0745,
                longitude: 119.2965
            },
            {
                name: '抚顺',
                pinyin: 'fushun',
                code: '210400',
                latitude: 41.8807,
                longitude: 123.957
            },
            {
                name: '阜阳',
                pinyin: 'fuyang',
                code: '341200',
                latitude: 32.8904,
                longitude: 115.8142
            },
            {
                name: '抚州',
                pinyin: 'fuzhou',
                code: '361000',
                latitude: 27.9839,
                longitude: 116.3579
            },

            // G
            {
                name: '广州',
                pinyin: 'guangzhou',
                code: '440100',
                latitude: 23.1293,
                longitude: 113.2644
            },
            {
                name: '贵阳',
                pinyin: 'guiyang',
                code: '520100',
                latitude: 26.647,
                longitude: 106.6302
            },
            {
                name: '桂林',
                pinyin: 'guilin',
                code: '450300',
                latitude: 25.2736,
                longitude: 110.2907
            },
            {
                name: '赣州',
                pinyin: 'ganzhou',
                code: '360700',
                latitude: 25.8308,
                longitude: 114.9335
            },
            {
                name: '广元',
                pinyin: 'guangyuan',
                code: '510800',
                latitude: 32.4363,
                longitude: 105.8436
            },

            // H
            {
                name: '杭州',
                pinyin: 'hangzhou',
                code: '330100',
                latitude: 30.2741,
                longitude: 120.1551
            },
            {
                name: '哈尔滨',
                pinyin: 'haerbin',
                code: '230100',
                latitude: 45.8038,
                longitude: 126.534
            },
            {
                name: '合肥',
                pinyin: 'hefei',
                code: '340100',
                latitude: 31.8206,
                longitude: 117.2271
            },
            {
                name: '呼和浩特',
                pinyin: 'huhehaote',
                code: '150100',
                latitude: 40.8428,
                longitude: 111.7489
            },
            {
                name: '海口',
                pinyin: 'haikou',
                code: '460100',
                latitude: 20.0444,
                longitude: 110.324
            },
            {
                name: '惠州',
                pinyin: 'huizhou',
                code: '441300',
                latitude: 23.1118,
                longitude: 114.4163
            },
            {
                name: '湖州',
                pinyin: 'huzhou',
                code: '330500',
                latitude: 30.8933,
                longitude: 120.0871
            },

            // J
            {
                name: '济南',
                pinyin: 'jinan',
                code: '370100',
                latitude: 36.6512,
                longitude: 117.1201
            },
            {
                name: '九江',
                pinyin: 'jiujiang',
                code: '360400',
                latitude: 29.7051,
                longitude: 116.0017
            },
            {
                name: '嘉兴',
                pinyin: 'jiaxing',
                code: '330400',
                latitude: 30.7522,
                longitude: 120.7554
            },
            {
                name: '江门',
                pinyin: 'jiangmen',
                code: '440700',
                latitude: 22.5799,
                longitude: 113.0823
            },
            {
                name: '锦州',
                pinyin: 'jinzhou',
                code: '210700',
                latitude: 41.0932,
                longitude: 121.1278
            },
            {
                name: '荆州',
                pinyin: 'jingzhou',
                code: '421000',
                latitude: 30.3269,
                longitude: 112.2398
            },
            {
                name: '金华',
                pinyin: 'jinhua',
                code: '330700',
                latitude: 29.0784,
                longitude: 119.6478
            },

            // K
            {
                name: '昆明',
                pinyin: 'kunming',
                code: '530100',
                latitude: 24.8801,
                longitude: 102.8329
            },
            {
                name: '开封',
                pinyin: 'kaifeng',
                code: '410200',
                latitude: 34.7974,
                longitude: 114.3071
            },
            {
                name: '喀什',
                pinyin: 'kashi',
                code: '653100',
                latitude: 39.4704,
                longitude: 75.9893
            },

            // L
            {
                name: '兰州',
                pinyin: 'lanzhou',
                code: '620100',
                latitude: 36.0611,
                longitude: 103.8343
            },
            {
                name: '临沂',
                pinyin: 'linyi',
                code: '371300',
                latitude: 35.1045,
                longitude: 118.3559
            },
            {
                name: '柳州',
                pinyin: 'liuzhou',
                code: '450200',
                latitude: 24.3264,
                longitude: 109.4281
            },
            {
                name: '洛阳',
                pinyin: 'luoyang',
                code: '410300',
                latitude: 34.6198,
                longitude: 112.4541
            },
            {
                name: '连云港',
                pinyin: 'lianyungang',
                code: '320700',
                latitude: 34.596,
                longitude: 119.2217
            },
            {
                name: '泸州',
                pinyin: 'luzhou',
                code: '510500',
                latitude: 28.8891,
                longitude: 105.4428
            },

            // M
            {
                name: '绵阳',
                pinyin: 'mianyang',
                code: '510700',
                latitude: 31.468,
                longitude: 104.6796
            },
            {
                name: '马鞍山',
                pinyin: 'maanshan',
                code: '340500',
                latitude: 31.6694,
                longitude: 118.5066
            },
            {
                name: '牡丹江',
                pinyin: 'mudanjiang',
                code: '231000',
                latitude: 44.5517,
                longitude: 129.6336
            },
            {
                name: '茂名',
                pinyin: 'maoming',
                code: '440900',
                latitude: 21.6632,
                longitude: 110.9255
            },

            // N
            {
                name: '南京',
                pinyin: 'nanjing',
                code: '320100',
                latitude: 32.0603,
                longitude: 118.7969
            },
            {
                name: '宁波',
                pinyin: 'ningbo',
                code: '330200',
                latitude: 29.8683,
                longitude: 121.6244
            },
            {
                name: '南通',
                pinyin: 'nantong',
                code: '320600',
                latitude: 31.9801,
                longitude: 120.8943
            },
            {
                name: '南昌',
                pinyin: 'nanchang',
                code: '360100',
                latitude: 28.6829,
                longitude: 115.8581
            },
            {
                name: '南宁',
                pinyin: 'nanning',
                code: '450100',
                latitude: 22.817,
                longitude: 108.3665
            },

            // P
            {
                name: '莆田',
                pinyin: 'putian',
                code: '350300',
                latitude: 25.4484,
                longitude: 119.0075
            },
            {
                name: '盘锦',
                pinyin: 'panjin',
                code: '211100',
                latitude: 41.1242,
                longitude: 122.0574
            },
            {
                name: '攀枝花',
                pinyin: 'panzhihua',
                code: '510400',
                latitude: 26.5851,
                longitude: 101.7224
            },
            {
                name: '平顶山',
                pinyin: 'pingdingshan',
                code: '410400',
                latitude: 33.7659,
                longitude: 113.193
            },

            // Q
            {
                name: '青岛',
                pinyin: 'qingdao',
                code: '370200',
                latitude: 36.0671,
                longitude: 120.3826
            },
            {
                name: '泉州',
                pinyin: 'quanzhou',
                code: '350500',
                latitude: 24.8741,
                longitude: 118.6758
            },
            {
                name: '秦皇岛',
                pinyin: 'qinhuangdao',
                code: '130300',
                latitude: 39.9353,
                longitude: 119.6
            },
            {
                name: '衢州',
                pinyin: 'quzhou',
                code: '330800',
                latitude: 28.9569,
                longitude: 118.8586
            },
            {
                name: '齐齐哈尔',
                pinyin: 'qiqihaer',
                code: '230200',
                latitude: 47.3542,
                longitude: 123.9181
            },

            // R
            {
                name: '日照',
                pinyin: 'rizhao',
                code: '371100',
                latitude: 35.4164,
                longitude: 119.527
            },

            // S
            {
                name: '上海',
                pinyin: 'shanghai',
                code: '310000',
                latitude: 31.2304,
                longitude: 121.4737
            },
            {
                name: '深圳',
                pinyin: 'shenzhen',
                code: '440300',
                latitude: 22.5431,
                longitude: 114.0579
            },
            {
                name: '沈阳',
                pinyin: 'shenyang',
                code: '210100',
                latitude: 41.8057,
                longitude: 123.4315
            },
            {
                name: '石家庄',
                pinyin: 'shijiazhuang',
                code: '130100',
                latitude: 38.0428,
                longitude: 114.5149
            },
            {
                name: '苏州',
                pinyin: 'suzhou',
                code: '320500',
                latitude: 31.299,
                longitude: 120.5854
            },
            {
                name: '三亚',
                pinyin: 'sanya',
                code: '460200',
                latitude: 18.2528,
                longitude: 109.512
            },
            {
                name: '绍兴',
                pinyin: 'shaoxing',
                code: '330600',
                latitude: 30.0025,
                longitude: 120.5747
            },

            // T
            {
                name: '天津',
                pinyin: 'tianjin',
                code: '120000',
                latitude: 39.0842,
                longitude: 117.2009
            },
            {
                name: '太原',
                pinyin: 'taiyuan',
                code: '140100',
                latitude: 37.8706,
                longitude: 112.5489
            },
            {
                name: '唐山',
                pinyin: 'tangshan',
                code: '130200',
                latitude: 39.6366,
                longitude: 118.1804
            },
            {
                name: '台州',
                pinyin: 'taizhou',
                code: '331000',
                latitude: 28.6563,
                longitude: 121.4208
            },
            {
                name: '泰安',
                pinyin: 'taian',
                code: '370900',
                latitude: 36.194,
                longitude: 117.0883
            },

            // W
            {
                name: '武汉',
                pinyin: 'wuhan',
                code: '420100',
                latitude: 30.5928,
                longitude: 114.3055
            },
            {
                name: '温州',
                pinyin: 'wenzhou',
                code: '330300',
                latitude: 27.9994,
                longitude: 120.6997
            },
            {
                name: '无锡',
                pinyin: 'wuxi',
                code: '320200',
                latitude: 31.49,
                longitude: 120.3119
            },
            {
                name: '乌鲁木齐',
                pinyin: 'wulumuqi',
                code: '650100',
                latitude: 43.8256,
                longitude: 87.6168
            },
            {
                name: '威海',
                pinyin: 'weihai',
                code: '371000',
                latitude: 37.5129,
                longitude: 122.12
            },
            {
                name: '潍坊',
                pinyin: 'weifang',
                code: '370700',
                latitude: 36.7067,
                longitude: 119.1617
            },

            // X
            {
                name: '西安',
                pinyin: 'xian',
                code: '610100',
                latitude: 34.3416,
                longitude: 108.94
            },
            {
                name: '厦门',
                pinyin: 'xiamen',
                code: '350200',
                latitude: 24.4798,
                longitude: 118.0894
            },
            {
                name: '徐州',
                pinyin: 'xuzhou',
                code: '320300',
                latitude: 34.2044,
                longitude: 117.286
            },
            {
                name: '襄阳',
                pinyin: 'xiangyang',
                code: '420600',
                latitude: 32.009,
                longitude: 112.1212
            },
            {
                name: '西宁',
                pinyin: 'xining',
                code: '630100',
                latitude: 36.6177,
                longitude: 101.766
            },
            {
                name: '咸阳',
                pinyin: 'xianyang',
                code: '610400',
                latitude: 34.3293,
                longitude: 108.7053
            },

            // Y
            {
                name: '银川',
                pinyin: 'yinchuan',
                code: '640100',
                latitude: 38.4865,
                longitude: 106.2324
            },
            {
                name: '烟台',
                pinyin: 'yantai',
                code: '370600',
                latitude: 37.4636,
                longitude: 121.448
            },
            {
                name: '扬州',
                pinyin: 'yangzhou',
                code: '321000',
                latitude: 32.3939,
                longitude: 119.4127
            },
            {
                name: '宜昌',
                pinyin: 'yichang',
                code: '420500',
                latitude: 30.6925,
                longitude: 111.2864
            },
            {
                name: '岳阳',
                pinyin: 'yueyang',
                code: '430600',
                latitude: 29.3599,
                longitude: 113.1284
            },
            {
                name: '榆林',
                pinyin: 'yulin',
                code: '610800',
                latitude: 38.2855,
                longitude: 109.7348
            },

            // Z
            {
                name: '郑州',
                pinyin: 'zhengzhou',
                code: '410100',
                latitude: 34.7472,
                longitude: 113.6249
            },
            {
                name: '中山',
                pinyin: 'zhongshan',
                code: '442000',
                latitude: 22.5176,
                longitude: 113.3922
            },
            {
                name: '珠海',
                pinyin: 'zhuhai',
                code: '440400',
                latitude: 22.2769,
                longitude: 113.5767
            },
            {
                name: '张家口',
                pinyin: 'zhangjiakou',
                code: '130700',
                latitude: 40.7686,
                longitude: 114.8842
            },
            {
                name: '淄博',
                pinyin: 'zibo',
                code: '370300',
                latitude: 36.8131,
                longitude: 118.0548
            },
            {
                name: '遵义',
                pinyin: 'zunyi',
                code: '520300',
                latitude: 27.7056,
                longitude: 106.9376
            }
        ]

        // 按字母分类
        letters.forEach((letter) => {
            cityMap[letter] = cities.filter((city) => {
                const firstLetter = city.pinyin.charAt(0).toUpperCase()
                return firstLetter === letter
            })
        })

        console.log('城市数据加载完成')
    } catch (error) {
        console.error('获取城市数据失败', error)
    }
}

// 选择城市
const selectCity = (city) => {
    console.log('选择城市:', city)
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
</style>
