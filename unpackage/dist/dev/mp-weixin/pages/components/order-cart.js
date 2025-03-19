"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const __default__ = {
  name: "OrderCart",
  options: {
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  setup(__props, { expose: __expose }) {
    const showDetail = common_vendor.ref(false);
    const cartItems = common_vendor.ref([]);
    const selectedItems = common_vendor.ref(/* @__PURE__ */ new Set());
    const totalCount = common_vendor.computed(() => {
      return cartItems.value.reduce((total, item) => total + item.count, 0);
    });
    const totalPrice = common_vendor.computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + (selectedItems.value.has(item.id) ? item.price * item.count : 0);
      }, 0).toFixed(2);
    });
    const isAllSelected = common_vendor.computed(() => {
      return cartItems.value.length > 0 && cartItems.value.every((item) => selectedItems.value.has(item.id));
    });
    const showCartDetail = () => {
      if (cartItems.value.length > 0) {
        showDetail.value = true;
      }
    };
    const hideCartDetail = () => {
      showDetail.value = false;
    };
    const addToCart = (item) => {
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:170", "购物车组件收到商品:", item);
      if (!item) {
        common_vendor.index.__f__("error", "at pages/components/order-cart.vue:174", "商品数据为空");
        return;
      }
      let productData = {
        name: "",
        price: 0,
        count: 1
      };
      if (item.product) {
        productData = {
          id: item.product.id || Date.now().toString(),
          name: item.product.name,
          price: item.product.price,
          size: item.cupType || "中杯",
          sugar: item.sugar || "无糖",
          ice: item.temperature || "正常冰",
          image: item.product.image,
          category: item.product.category,
          count: item.quantity || 1,
          toppings: item.toppings || []
        };
      } else {
        productData = {
          id: item.id || Date.now().toString(),
          name: item.name,
          price: item.price,
          size: item.size || "中杯",
          sugar: item.sugar || "无糖",
          ice: item.ice || "正常冰",
          image: item.image,
          count: item.count || 1,
          toppings: item.toppings || []
        };
      }
      if (!productData.name || !productData.price) {
        common_vendor.index.__f__("error", "at pages/components/order-cart.vue:216", "处理后的商品数据不完整:", productData);
        return;
      }
      const areArraysEqual = (arr1 = [], arr2 = []) => {
        if (arr1.length !== arr2.length)
          return false;
        const sorted1 = [...arr1].sort(
          (a, b) => (a.id || a.name).localeCompare(b.id || b.name)
        );
        const sorted2 = [...arr2].sort(
          (a, b) => (a.id || a.name).localeCompare(b.id || b.name)
        );
        for (let i = 0; i < sorted1.length; i++) {
          const item1 = sorted1[i];
          const item2 = sorted2[i];
          if (item1.id !== item2.id || item1.name !== item2.name || item1.count !== item2.count) {
            return false;
          }
        }
        return true;
      };
      const existingItemIndex = cartItems.value.findIndex((cartItem) => {
        const basicMatch = cartItem.name === productData.name && cartItem.size === productData.size && cartItem.sugar === productData.sugar && cartItem.ice === productData.ice;
        const toppingsMatch = areArraysEqual(
          cartItem.toppings,
          productData.toppings
        );
        return basicMatch && toppingsMatch;
      });
      common_vendor.index.__f__(
        "log",
        "at pages/components/order-cart.vue:269",
        "查找结果:",
        existingItemIndex,
        existingItemIndex !== -1 ? "找到相同商品" : "未找到相同商品"
      );
      if (existingItemIndex !== -1) {
        cartItems.value[existingItemIndex].count += productData.count;
        common_vendor.index.__f__("log", "at pages/components/order-cart.vue:278", "更新后的商品:", cartItems.value[existingItemIndex]);
      } else {
        cartItems.value.push(productData);
        selectedItems.value.add(productData.id);
        common_vendor.index.__f__("log", "at pages/components/order-cart.vue:284", "添加新商品:", productData);
      }
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:287", "当前购物车商品:", cartItems.value);
    };
    const increaseItem = (index) => {
      cartItems.value[index].count += 1;
    };
    const decreaseItem = (index) => {
      if (cartItems.value[index].count > 1) {
        cartItems.value[index].count -= 1;
      } else {
        cartItems.value.splice(index, 1);
        if (cartItems.value.length === 0) {
          hideCartDetail();
        }
      }
    };
    const clearCart = () => {
      cartItems.value = [];
      hideCartDetail();
    };
    const goCheckout = () => {
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:312", "去结算，商品列表:", cartItems.value);
      common_vendor.index.showToast({
        title: "正在开发中...",
        icon: "none"
      });
    };
    const toggleItemSelection = (itemId) => {
      if (selectedItems.value.has(itemId)) {
        selectedItems.value.delete(itemId);
      } else {
        selectedItems.value.add(itemId);
      }
    };
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedItems.value.clear();
      } else {
        cartItems.value.forEach((item) => selectedItems.value.add(item.id));
      }
    };
    __expose({
      addToCart,
      showCartDetail,
      hideCartDetail,
      clearCart,
      goCheckout,
      toggleItemSelection,
      toggleSelectAll
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: cartItems.value.length > 0
      }, cartItems.value.length > 0 ? {
        b: common_vendor.t(totalCount.value),
        c: common_assets._imports_0,
        d: common_vendor.t(totalPrice.value),
        e: common_vendor.o(goCheckout),
        f: common_vendor.o(showCartDetail)
      } : {}, {
        g: common_vendor.t(totalCount.value),
        h: common_vendor.o(clearCart),
        i: isAllSelected.value,
        j: common_vendor.o(toggleSelectAll),
        k: common_vendor.t(totalCount.value),
        l: common_vendor.p({
          type: "trash",
          size: "20",
          color: "#999"
        }),
        m: common_vendor.o(clearCart),
        n: common_vendor.f(cartItems.value, (item, index, i0) => {
          return {
            a: selectedItems.value.has(item.id),
            b: common_vendor.o(($event) => toggleItemSelection(item.id), index),
            c: item.image,
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.price),
            f: common_vendor.t(item.size),
            g: common_vendor.t(item.sugar),
            h: common_vendor.t(item.ice),
            i: common_vendor.o(($event) => decreaseItem(index), index),
            j: common_vendor.t(item.count),
            k: common_vendor.o(($event) => increaseItem(index), index),
            l: index
          };
        }),
        o: common_vendor.t(totalCount.value),
        p: common_assets._imports_0,
        q: common_vendor.t(totalPrice.value),
        r: common_vendor.o(() => {
        }),
        s: showDetail.value ? 1 : "",
        t: common_vendor.o(hideCartDetail)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/order-cart.js.map
