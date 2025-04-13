"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_api_productApi = require("../../utils/api/productApi.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + ShopDetail)();
}
const ShopDetail = () => "../components/shop-detail.js";
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const searchText = common_vendor.ref("");
    const searchHistory = common_vendor.ref([]);
    const searchResults = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const hasSearched = common_vendor.ref(false);
    const productDetailVisible = common_vendor.ref(false);
    const selectedProduct = common_vendor.ref({});
    const handleSearch = async () => {
      if (!searchText.value.trim())
        return;
      if (!searchHistory.value.includes(searchText.value)) {
        searchHistory.value.unshift(searchText.value);
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop();
        }
        common_vendor.index.setStorageSync("searchHistory", searchHistory.value);
      }
      try {
        isLoading.value = true;
        hasSearched.value = true;
        searchResults.value = [];
        const results = await utils_api_productApi.searchProductsByName(searchText.value);
        searchResults.value = results;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:148", "搜索产品失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败，请重试",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const clearHistory = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空搜索历史吗？",
        success: (res) => {
          if (res.confirm) {
            searchHistory.value = [];
            common_vendor.index.removeStorageSync("searchHistory");
          }
        }
      });
    };
    const handleHistoryClick = (keyword) => {
      searchText.value = keyword;
      handleSearch();
    };
    const viewProductDetail = (product) => {
      selectedProduct.value = {
        id: product.id,
        name: product.name,
        desc: product.description || "",
        price: product.price,
        image: product.imageUrl || "/static/images/default-product.png"
      };
      productDetailVisible.value = true;
    };
    const updateDetailVisible = (visible) => {
      productDetailVisible.value = visible;
    };
    const handleAddToCart = (orderItem) => {
      common_vendor.index.__f__("log", "at pages/search/search.vue:199", "添加到购物车:", orderItem);
      const cartItems = common_vendor.index.getStorageSync("cartItems") || [];
      cartItems.push(orderItem);
      common_vendor.index.setStorageSync("cartItems", cartItems);
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success"
      });
    };
    common_vendor.onMounted(() => {
      const history = common_vendor.index.getStorageSync("searchHistory");
      if (history) {
        searchHistory.value = history;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.o(handleSearch),
        c: searchText.value,
        d: common_vendor.o(($event) => searchText.value = $event.detail.value),
        e: common_vendor.o(handleSearch),
        f: !hasSearched.value && searchHistory.value.length > 0
      }, !hasSearched.value && searchHistory.value.length > 0 ? {
        g: common_vendor.o(clearHistory),
        h: common_vendor.f(searchHistory.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => handleHistoryClick(item), index)
          };
        })
      } : {}, {
        i: hasSearched.value
      }, hasSearched.value ? common_vendor.e({
        j: searchResults.value.length === 0 && !isLoading.value
      }, searchResults.value.length === 0 && !isLoading.value ? {
        k: common_assets._imports_0$9
      } : {}, {
        l: isLoading.value
      }, isLoading.value ? {} : {}, {
        m: searchResults.value.length > 0
      }, searchResults.value.length > 0 ? {
        n: common_vendor.f(searchResults.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.imageUrl || "/static/images/default-product.png",
            b: common_vendor.t(item.name),
            c: item.category && item.category.name
          }, item.category && item.category.name ? {
            d: common_vendor.t(item.category.name)
          } : {}, {
            e: common_vendor.t(item.description),
            f: common_vendor.t(item.price),
            g: index,
            h: common_vendor.o(($event) => viewProductDetail(item), index)
          });
        })
      } : {}) : {}, {
        o: productDetailVisible.value
      }, productDetailVisible.value ? {
        p: common_vendor.o(updateDetailVisible),
        q: common_vendor.o(handleAddToCart),
        r: common_vendor.p({
          visible: productDetailVisible.value,
          product: selectedProduct.value
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
