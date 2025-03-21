"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "map",
  setup(__props) {
    const isMapShown = common_vendor.ref(true);
    const selectedCityName = common_vendor.ref("九江市");
    const selectedCityLocation = common_vendor.ref({
      latitude: 29.7051,
      longitude: 116.0017
    });
    const mapHeight = common_vendor.computed(() => {
      return isMapShown.value ? "400rpx" : "0";
    });
    const storeList = common_vendor.ref([
      {
        id: "store1",
        name: "九江中心店",
        status: "营业中",
        isOperating: true,
        address: "九江市中心区繁华路88号",
        hours: "10:00-22:00",
        distance: "0.97km",
        phone: "13027261672",
        location: {
          latitude: 29.7151,
          longitude: 115.9917
        }
      },
      {
        id: "store2",
        name: "九江北区店",
        status: "休息中",
        isOperating: false,
        address: "九江市北区商业街B区12号",
        hours: "10:00-21:20",
        distance: "2.27km",
        phone: "13027261673",
        location: {
          latitude: 29.6951,
          longitude: 116.0117
        }
      },
      {
        id: "store3",
        name: "九江大学城店",
        status: "营业中",
        isOperating: true,
        address: "九江市大学城A区168号",
        hours: "10:00-22:00",
        distance: "2.34km",
        phone: "13027261674",
        location: {
          latitude: 29.7051,
          longitude: 116.0217
        }
      }
    ]);
    const storeMarkers = common_vendor.computed(() => {
      return storeList.value.map((store, index) => {
        return {
          id: index,
          latitude: store.location.latitude,
          longitude: store.location.longitude,
          title: store.name,
          iconPath: store.id === selectedStoreId.value ? "/static/marker-active.png" : "/static/marker.png",
          width: 32,
          height: 32
        };
      });
    });
    const selectedStoreId = common_vendor.ref(null);
    const selectedStoreName = common_vendor.ref("");
    const toggleMap = () => {
      isMapShown.value = !isMapShown.value;
    };
    const selectStore = (store) => {
      selectedStoreId.value = store.id;
      selectedStoreName.value = store.name;
      if (store.location) {
        selectedCityLocation.value = {
          latitude: store.location.latitude,
          longitude: store.location.longitude
        };
      }
    };
    const confirmSelection = () => {
      if (selectedStoreId.value) {
        const selectedStoreInfo = storeList.value.find(
          (store) => store.id === selectedStoreId.value
        );
        const distance = selectedStoreInfo ? selectedStoreInfo.distance : "0.41km";
        const address = selectedStoreInfo ? selectedStoreInfo.address : "九江市中心区繁华路88号";
        common_vendor.index.setStorageSync("selectedStore", {
          id: selectedStoreId.value,
          name: selectedStoreName.value,
          distance,
          address
        });
        common_vendor.index.$emit("store-selected", {
          id: selectedStoreId.value,
          name: selectedStoreName.value,
          distance,
          address
        });
        const pages = getCurrentPages();
        if (pages.length > 1 && pages[pages.length - 2].route.includes("order")) {
          common_vendor.index.navigateBack({
            delta: 1,
            success: function() {
              setTimeout(() => {
                common_vendor.index.$emit("refresh-order-page");
              }, 100);
            }
          });
        } else {
          common_vendor.index.navigateTo({
            url: "/pages/order/order"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "请选择一个门店",
          icon: "none"
        });
      }
    };
    const callStore = (phone) => {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打电话失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToStore = (latitude, longitude) => {
      common_vendor.index.openLocation({
        latitude,
        longitude,
        scale: 18,
        fail: () => {
          common_vendor.index.showToast({
            title: "打开位置失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToCitySelect = () => {
      common_vendor.index.navigateTo({
        url: "/pages/map-city/map-city"
      });
    };
    common_vendor.onMounted(() => {
      const city = common_vendor.index.getStorageSync("selectedCity");
      if (city && city.name) {
        selectedCityName.value = city.name;
        if (city.latitude && city.longitude) {
          selectedCityLocation.value = {
            latitude: city.latitude,
            longitude: city.longitude
          };
          loadStoresByCity(city.name, city.latitude, city.longitude);
        }
      }
      common_vendor.index.$on("citySelected", function(data) {
        if (data && data.name) {
          selectedCityName.value = data.name;
          if (data.latitude && data.longitude) {
            selectedCityLocation.value = {
              latitude: data.latitude,
              longitude: data.longitude
            };
            loadStoresByCity(data.name, data.latitude, data.longitude);
          }
        }
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("citySelected");
    });
    const loadStoresByCity = (cityName, latitude, longitude) => {
      if (cityName === "北京") {
        storeList.value = [
          {
            id: "bj-store1",
            name: "北京朝阳店",
            status: "营业中",
            isOperating: true,
            address: "北京市朝阳区建国路88号",
            hours: "10:00-22:00",
            distance: "1.2km",
            phone: "13800138000",
            location: {
              latitude: latitude + 0.01,
              longitude: longitude - 0.01
            }
          },
          {
            id: "bj-store2",
            name: "北京海淀店",
            status: "营业中",
            isOperating: true,
            address: "北京市海淀区中关村大街1号",
            hours: "09:00-21:00",
            distance: "2.5km",
            phone: "13800138001",
            location: {
              latitude: latitude - 0.01,
              longitude: longitude + 0.02
            }
          },
          {
            id: "bj-store3",
            name: "北京西城店",
            status: "休息中",
            isOperating: false,
            address: "北京市西城区西单北大街120号",
            hours: "10:00-21:00",
            distance: "3.2km",
            phone: "13800138002",
            location: {
              latitude: latitude + 0.02,
              longitude: longitude + 0.01
            }
          }
        ];
      } else if (cityName === "上海") {
        storeList.value = [
          {
            id: "sh-store1",
            name: "上海徐汇店",
            status: "营业中",
            isOperating: true,
            address: "上海市徐汇区肇嘉浜路1111号",
            hours: "10:00-22:00",
            distance: "0.8km",
            phone: "13900139000",
            location: {
              latitude: latitude + 0.01,
              longitude: longitude - 0.01
            }
          },
          {
            id: "sh-store2",
            name: "上海静安店",
            status: "营业中",
            isOperating: true,
            address: "上海市静安区南京西路1266号",
            hours: "09:30-21:30",
            distance: "1.9km",
            phone: "13900139001",
            location: {
              latitude: latitude - 0.01,
              longitude: longitude + 0.01
            }
          }
        ];
      } else {
        storeList.value = [
          {
            id: "store1",
            name: `${cityName}中心店`,
            status: "营业中",
            isOperating: true,
            address: `${cityName}市中心区繁华路88号`,
            hours: "10:00-22:00",
            distance: "0.97km",
            phone: "13027261672",
            location: {
              latitude: latitude + 0.01,
              longitude: longitude - 0.01
            }
          },
          {
            id: "store2",
            name: `${cityName}北区店`,
            status: "休息中",
            isOperating: false,
            address: `${cityName}市北区商业街B区12号`,
            hours: "10:00-21:20",
            distance: "2.27km",
            phone: "13027261673",
            location: {
              latitude: latitude - 0.01,
              longitude: longitude + 0.01
            }
          },
          {
            id: "store3",
            name: `${cityName}大学城店`,
            status: "营业中",
            isOperating: true,
            address: `${cityName}市大学城A区168号`,
            hours: "10:00-22:00",
            distance: "2.34km",
            phone: "13027261674",
            location: {
              latitude,
              longitude: longitude + 0.02
            }
          }
        ];
      }
      selectedStoreId.value = null;
      selectedStoreName.value = "";
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(selectedCityName.value),
        b: common_vendor.o(navigateToCitySelect),
        c: selectedCityLocation.value.latitude,
        d: selectedCityLocation.value.longitude,
        e: storeMarkers.value,
        f: mapHeight.value,
        g: common_vendor.t(isMapShown.value ? "收起地图" : "展开地图"),
        h: common_vendor.p({
          type: isMapShown.value ? "top" : "bottom",
          size: "14",
          color: "#666"
        }),
        i: common_vendor.o(toggleMap),
        j: common_vendor.f(storeList.value, (store, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(store.name),
            b: common_vendor.t(store.status),
            c: store.isOperating ? 1 : "",
            d: common_vendor.t(store.address),
            e: common_vendor.t(store.hours),
            f: common_vendor.t(store.distance),
            g: common_vendor.o(($event) => callStore(store.phone), store.id),
            h: common_vendor.o(($event) => navigateToStore(store.location.latitude, store.location.longitude), store.id),
            i: selectedStoreId.value === store.id
          }, selectedStoreId.value === store.id ? {} : {}, {
            j: selectedStoreId.value === store.id ? 1 : "",
            k: store.id,
            l: common_vendor.o(($event) => selectStore(store), store.id)
          });
        }),
        k: selectedStoreId.value
      }, selectedStoreId.value ? {
        l: common_vendor.o(confirmSelection)
      } : {}, {
        m: mapHeight.value
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/map/map.js.map
