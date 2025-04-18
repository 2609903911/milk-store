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
    const validateCartItems = () => {
      const items = common_vendor.index.getStorageSync("cartItems") || [];
      const filteredItems = items.filter(
        (item) => item !== null && item !== void 0
      );
      const validatedItems = filteredItems.map((item) => {
        try {
          const validItem = {
            id: item.id || (item.product ? item.product.id : Date.now()),
            cupType: item.cupType || "中杯",
            name: item.name || (item.product ? item.product.name : ""),
            price: Number(item.price) || (item.product ? Number(item.product.price) : 0),
            quantity: Number(item.quantity) || 1,
            sugar: item.sugar || "全糖",
            temperature: item.temperature || "正常冰",
            toppings: Array.isArray(item.toppings) ? item.toppings : [],
            image: item.image || (item.product ? item.product.image : ""),
            desc: item.desc || (item.product ? item.product.desc || item.product.description || "" : "")
          };
          const itemPrice = Number(validItem.price) || 0;
          const itemQuantity = Number(validItem.quantity) || 1;
          validItem.totalPrice = item.totalPrice || itemPrice * itemQuantity;
          if (!item.product) {
            validItem.product = {
              id: validItem.id,
              name: validItem.name,
              desc: validItem.desc || "",
              price: validItem.price,
              image: validItem.image
            };
          } else {
            validItem.product = { ...item.product };
          }
          return validItem;
        } catch (error) {
          return {
            id: Date.now() + Math.random(),
            cupType: "中杯",
            name: "商品数据错误",
            price: 0,
            quantity: 1,
            sugar: "全糖",
            temperature: "正常冰",
            toppings: [],
            image: "/static/images/hot01.png",
            desc: "",
            totalPrice: 0,
            product: {
              id: Date.now() + Math.random(),
              name: "商品数据错误",
              desc: "",
              price: 0,
              image: "/static/images/hot01.png"
            }
          };
        }
      });
      return validatedItems;
    };
    const loadCartItems = () => {
      const validatedItems = validateCartItems();
      cartItems.value = validatedItems;
      selectedItems.value.clear();
      cartItems.value.forEach((item) => {
        if (item.id) {
          selectedItems.value.add(item.id);
        }
      });
      saveCartItems();
    };
    const saveCartItems = () => {
      common_vendor.index.setStorageSync("cartItems", cartItems.value);
    };
    common_vendor.onMounted(() => {
      loadCartItems();
    });
    common_vendor.onShow(() => {
      loadCartItems();
    });
    common_vendor.watch(
      cartItems,
      () => {
        saveCartItems();
      },
      { deep: true }
    );
    const totalCount = common_vendor.computed(() => {
      return cartItems.value.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
    });
    const totalPrice = common_vendor.computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + (selectedItems.value.has(item.id) ? item.totalPrice : 0);
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
      if (!item) {
        return;
      }
      let productData = {
        id: item.id || (item.product ? item.product.id : Date.now()),
        cupType: item.cupType || "中杯",
        name: item.name || (item.product ? item.product.name : ""),
        price: item.price || (item.product ? item.product.price : 0),
        quantity: item.quantity || 1,
        sugar: item.sugar || "全糖",
        temperature: item.temperature || "正常冰",
        toppings: item.toppings || [],
        image: item.image || (item.product ? item.product.image : ""),
        desc: item.desc || (item.product ? item.product.desc || item.product.description || "" : ""),
        totalPrice: item.totalPrice || item.price * (item.quantity || 1) || (item.product ? item.product.price : 0) * (item.quantity || 1)
      };
      if (!item.product) {
        productData.product = {
          id: productData.id,
          name: productData.name,
          desc: productData.desc,
          price: productData.price,
          image: productData.image
        };
      } else {
        productData.product = { ...item.product };
      }
      const currentCartItems = validateCartItems();
      const existingItemIndex = currentCartItems.findIndex((cartItem) => {
        const basicMatch = cartItem.id === productData.id && cartItem.cupType === productData.cupType && cartItem.sugar === productData.sugar && cartItem.temperature === productData.temperature;
        let toppingsMatch = true;
        if (cartItem.toppings.length !== productData.toppings.length) {
          toppingsMatch = false;
        } else {
          const sortedCartToppings = [...cartItem.toppings].sort();
          const sortedNewToppings = [...productData.toppings].sort();
          for (let i = 0; i < sortedCartToppings.length; i++) {
            if (sortedCartToppings[i] !== sortedNewToppings[i]) {
              toppingsMatch = false;
              break;
            }
          }
        }
        return basicMatch && toppingsMatch;
      });
      if (existingItemIndex !== -1) {
        currentCartItems[existingItemIndex].quantity += productData.quantity;
        currentCartItems[existingItemIndex].totalPrice = currentCartItems[existingItemIndex].price * currentCartItems[existingItemIndex].quantity;
      } else {
        currentCartItems.push(productData);
      }
      cartItems.value = currentCartItems;
      if (existingItemIndex === -1) {
        selectedItems.value.add(productData.id);
      }
      saveCartItems();
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success",
        duration: 1500
      });
    };
    const increaseItem = (index) => {
      cartItems.value[index].quantity += 1;
      updateItemTotalPrice(index);
      saveCartItems();
    };
    const decreaseItem = (index) => {
      if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity -= 1;
        updateItemTotalPrice(index);
      } else {
        cartItems.value.splice(index, 1);
        if (cartItems.value.length === 0) {
          hideCartDetail();
        }
      }
      saveCartItems();
    };
    const updateItemTotalPrice = (index) => {
      const item = cartItems.value[index];
      item.totalPrice = item.price * item.quantity;
    };
    const clearCart = () => {
      cartItems.value = [];
      common_vendor.index.setStorageSync("cartItems", []);
      hideCartDetail();
    };
    const goCheckout = () => {
      const selectedCartItems = cartItems.value.filter((item) => selectedItems.value.has(item.id)).map((item) => {
        return {
          ...item,
          // 订单确认页面需要的额外字段
          specs: `${item.cupType}, ${item.sugar}, ${item.temperature}`
        };
      });
      if (selectedCartItems.length === 0) {
        common_vendor.index.showToast({
          title: "请选择商品",
          icon: "none"
        });
        return;
      }
      const totalPrice2 = selectedCartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
      if (parseFloat(totalPrice2) == 0) {
        common_vendor.index.showToast({
          title: "请选择商品",
          icon: "none"
        });
        return;
      }
      const storeInfo = common_vendor.index.getStorageSync("selectedStore") || {
        name: "九江中心店",
        distance: "0.97km",
        address: "九江市中心区繁华路88号",
        phone: "13027261672"
      };
      const deliveryType = common_vendor.index.getStorageSync("deliveryType") || "self";
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
      toggleSelectAll,
      loadCartItems
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
            f: common_vendor.t(item.cupType),
            g: common_vendor.t(item.sugar),
            h: common_vendor.t(item.temperature),
            i: common_vendor.o(($event) => decreaseItem(index), index),
            j: common_vendor.t(item.quantity),
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
