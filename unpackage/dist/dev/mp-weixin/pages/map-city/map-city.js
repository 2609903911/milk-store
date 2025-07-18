"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/userState.js");
const utils_api_cityApi = require("../../utils/api/cityApi.js");
const _sfc_main = {
  __name: "map-city",
  setup(__props) {
    const hotCities = common_vendor.ref([]);
    const letters = common_vendor.ref([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "W",
      "X",
      "Y",
      "Z"
    ]);
    const cityMap = common_vendor.reactive({});
    const isLoading = common_vendor.ref(false);
    const fetchCityData = async () => {
      isLoading.value = true;
      try {
        const cityData = await utils_api_cityApi.fetchAllCities();
        hotCities.value = cityData.hotCities || [];
        const citiesByLetter = cityData.cityMap || {};
        Object.keys(cityMap).forEach((key) => {
          delete cityMap[key];
        });
        Object.keys(citiesByLetter).forEach((letter) => {
          cityMap[letter] = citiesByLetter[letter];
        });
      } catch (error) {
        loadLocalCityData();
      } finally {
        isLoading.value = false;
      }
    };
    const loadLocalCityData = () => {
      hotCities.value = [
        {
          name: "北京",
          code: "110000",
          latitude: 39.9042,
          longitude: 116.4074
        },
        {
          name: "上海",
          code: "310000",
          latitude: 31.2304,
          longitude: 121.4737
        },
        {
          name: "广州",
          code: "440100",
          latitude: 23.1293,
          longitude: 113.2644
        },
        {
          name: "深圳",
          code: "440300",
          latitude: 22.5431,
          longitude: 114.0579
        },
        {
          name: "成都",
          code: "510100",
          latitude: 30.5728,
          longitude: 104.0668
        },
        {
          name: "杭州",
          code: "330100",
          latitude: 30.2741,
          longitude: 120.1551
        },
        {
          name: "武汉",
          code: "420100",
          latitude: 30.5928,
          longitude: 114.3055
        },
        { name: "西安", code: "610100", latitude: 34.3416, longitude: 108.94 },
        {
          name: "南京",
          code: "320100",
          latitude: 32.0603,
          longitude: 118.7969
        },
        {
          name: "长沙",
          code: "430100",
          latitude: 28.2282,
          longitude: 112.9388
        },
        { name: "重庆", code: "500000", latitude: 29.563, longitude: 106.5516 },
        { name: "郑州", code: "410100", latitude: 34.7472, longitude: 113.6249 }
      ];
      const cities = [
        // A
        {
          name: "阿拉善盟",
          pinyin: "alashanmeng",
          code: "152900",
          latitude: 38.843,
          longitude: 105.7284
        },
        {
          name: "安康",
          pinyin: "ankang",
          code: "610900",
          latitude: 32.6903,
          longitude: 109.0294
        },
        {
          name: "安庆",
          pinyin: "anqing",
          code: "340800",
          latitude: 30.5434,
          longitude: 117.0425
        },
        {
          name: "鞍山",
          pinyin: "anshan",
          code: "210300",
          latitude: 41.1079,
          longitude: 122.9943
        },
        {
          name: "安顺",
          pinyin: "anshun",
          code: "520400",
          latitude: 26.2455,
          longitude: 105.932
        },
        // B
        {
          name: "北京",
          pinyin: "beijing",
          code: "110000",
          latitude: 39.9042,
          longitude: 116.4074
        }
        // 省略其他城市...
      ];
      letters.forEach((letter) => {
        cityMap[letter] = cities.filter((city) => {
          const firstLetter = city.pinyin.charAt(0).toUpperCase();
          return firstLetter === letter;
        });
      });
    };
    const selectCity = (city) => {
      common_vendor.index.setStorageSync("selectedCity", city);
      common_vendor.index.$emit("citySelected", {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude
      });
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/map/map"
        });
      }
    };
    const scrollToLetter = (letter) => {
      common_vendor.index.createSelectorQuery().select(`#${letter}`).boundingClientRect(function(res) {
        if (res) {
          common_vendor.index.pageScrollTo({
            scrollTop: res.top,
            duration: 0
          });
        }
      }).exec();
    };
    common_vendor.onMounted(() => {
      fetchCityData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(hotCities.value, (city, k0, i0) => {
          return {
            a: common_vendor.t(city.name),
            b: city.name,
            c: common_vendor.o(($event) => selectCity(city), city.name)
          };
        }),
        b: common_vendor.f(cityMap, (cities, letter, i0) => {
          return {
            a: common_vendor.t(letter),
            b: common_vendor.f(cities, (city, k1, i1) => {
              return {
                a: common_vendor.t(city.name),
                b: city.name,
                c: common_vendor.o(($event) => selectCity(city), city.name)
              };
            }),
            c: letter,
            d: letter
          };
        }),
        c: common_vendor.f(letters.value, (letter, k0, i0) => {
          return {
            a: common_vendor.t(letter),
            b: letter,
            c: common_vendor.o(($event) => scrollToLetter(letter), letter)
          };
        }),
        d: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/map-city/map-city.js.map
