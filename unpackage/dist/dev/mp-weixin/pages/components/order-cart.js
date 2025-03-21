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
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:145", "当前运行在微信小程序环境中");
    });
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
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:184", "购物车组件收到商品:", item);
      if (!item) {
        common_vendor.index.__f__("error", "at pages/components/order-cart.vue:188", "商品数据为空");
        return;
      }
      let productData = {
        name: "",
        price: 0,
        count: 1
      };
      if (item.product) {
        const itemPrice = item.totalPrice !== void 0 ? item.totalPrice / item.quantity : item.product.price;
        productData = {
          id: item.product.id || Date.now().toString(),
          name: item.product.name,
          // 使用每件商品的单价，而不是原始价格
          price: itemPrice,
          size: item.cupType || "中杯",
          sugar: item.sugar || "无糖",
          ice: item.temperature || "正常冰",
          image: item.product.image,
          category: item.product.category,
          count: item.quantity || 1,
          toppings: item.toppings || [],
          // 存储原始商品信息，方便后续使用
          originalProduct: item.product
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
        common_vendor.index.__f__("error", "at pages/components/order-cart.vue:239", "处理后的商品数据不完整:", productData);
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
        "at pages/components/order-cart.vue:292",
        "查找结果:",
        existingItemIndex,
        existingItemIndex !== -1 ? "找到相同商品" : "未找到相同商品"
      );
      if (existingItemIndex !== -1) {
        cartItems.value[existingItemIndex].count += productData.count;
        common_vendor.index.__f__("log", "at pages/components/order-cart.vue:301", "更新后的商品:", cartItems.value[existingItemIndex]);
      } else {
        cartItems.value.push(productData);
        selectedItems.value.add(productData.id);
        common_vendor.index.__f__("log", "at pages/components/order-cart.vue:307", "添加新商品:", productData);
      }
      common_vendor.index.__f__("log", "at pages/components/order-cart.vue:310", "当前购物车商品:", cartItems.value);
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
      const selectedCartItems = cartItems.value.filter(
        (item) => selectedItems.value.has(item.id) || selectedItems.value.size === 0
      ).map((item) => {
        return {
          ...item,
          quantity: item.count,
          specs: `${item.size}, ${item.sugar}, ${item.ice}`
          // 添加规格信息，方便在订单详情页显示
        };
      });
      if (selectedCartItems.length === 0) {
        common_vendor.index.showToast({
          title: "请选择商品",
          icon: "none"
        });
        return;
      }
      const totalPrice2 = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
      const storeInfo = common_vendor.index.getStorageSync("selectedStore") || {
        name: "九江中心店",
        distance: "0.97km",
        address: "九江市中心区繁华路88号",
        phone: "13027261672"
      };
      const deliveryType = common_vendor.index.getStorageSync("deliveryType") || "self";
      const selectedIds = /* @__PURE__ */ new Set([...selectedItems.value]);
      cartItems.value = cartItems.value.filter(
        (item) => !selectedIds.has(item.id)
      );
      selectedItems.value.clear();
      if (cartItems.value.length === 0) {
        hideCartDetail();
      }
      const orderDetailData = {
        id: "ORD" + Date.now().toString().slice(-8),
        // 生成订单编号
        items: selectedCartItems,
        totalPrice: totalPrice2,
        storeName: storeInfo.name,
        storeAddress: storeInfo.address,
        storePhone: storeInfo.phone,
        deliveryType,
        status: "pending",
        // 初始状态为进行中
        time: Date.now(),
        // 下单时间戳
        remark: common_vendor.index.getStorageSync("orderRemark") || ""
        // 订单备注
      };
      common_vendor.index.setStorageSync("orderConfirmData", {
        items: selectedCartItems,
        totalPrice: totalPrice2,
        store: storeInfo,
        deliveryType
      });
      common_vendor.index.setStorageSync("currentOrderDetail", orderDetailData);
      common_vendor.index.navigateTo({
        url: "/pages/order-confirm/order-confirm"
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
