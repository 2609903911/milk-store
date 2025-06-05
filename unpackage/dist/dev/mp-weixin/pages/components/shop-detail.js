"use strict";
const common_vendor = require("../../common/vendor.js");
const __default__ = {
  name: "OrderDetail",
  options: {
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({
        id: "",
        name: "",
        desc: "",
        price: 0,
        image: ""
      })
    }
  },
  emits: ["update:visible", "add-to-cart"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const onBackgroundTap = (e) => {
      if (e && e.target && e.currentTarget && e.target.id === e.currentTarget.id) {
        closePopup();
      }
    };
    const closePopup = () => {
      emit("update:visible", false);
    };
    const contentTap = (e) => {
      e.stopPropagation();
    };
    const temperatures = common_vendor.ref(["正常冰", "少冰", "去冰", "温", "热"]);
    const selectedTemp = common_vendor.ref("正常冰");
    const sugarLevels = common_vendor.ref(["全糖", "7分糖", "5分糖", "3分糖", "无糖"]);
    const selectedSugar = common_vendor.ref("全糖");
    const toppings = common_vendor.ref([
      { name: "珍珠", price: 2 },
      { name: "椰果", price: 2 },
      { name: "芋圆", price: 3 },
      { name: "仙草", price: 3 },
      { name: "布丁", price: 3 }
    ]);
    const selectedToppings = common_vendor.ref([]);
    const cupTypes = common_vendor.ref([
      { type: "中杯", price: 0 },
      { type: "大杯", price: 2 }
    ]);
    const selectedCup = common_vendor.ref("中杯");
    const quantity = common_vendor.ref(1);
    const increaseQuantity = () => {
      quantity.value += 1;
    };
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value -= 1;
      }
    };
    const toggleTopping = (toppingName) => {
      if (selectedToppings.value.includes(toppingName)) {
        selectedToppings.value = selectedToppings.value.filter(
          (item) => item !== toppingName
        );
      } else {
        selectedToppings.value.push(toppingName);
      }
    };
    const totalPrice = common_vendor.computed(() => {
      var _a;
      let price = props.product.price * quantity.value;
      selectedToppings.value.forEach((selected) => {
        const topping = toppings.value.find((t) => t.name === selected);
        if (topping) {
          price += topping.price * quantity.value;
        }
      });
      const cupPrice = ((_a = cupTypes.value.find((c) => c.type === selectedCup.value)) == null ? void 0 : _a.price) || 0;
      price += cupPrice * quantity.value;
      return price.toFixed(2);
    });
    const addToCart = () => {
      var _a;
      const itemQuantity = quantity.value || 1;
      let toppingTotalPrice = 0;
      selectedToppings.value.forEach((selected) => {
        const topping = toppings.value.find((t) => t.name === selected);
        if (topping) {
          toppingTotalPrice += topping.price;
        }
      });
      const cupExtraPrice = ((_a = cupTypes.value.find((c) => c.type === selectedCup.value)) == null ? void 0 : _a.price) || 0;
      const singleItemPrice = props.product.price + toppingTotalPrice + cupExtraPrice;
      const orderItem = {
        product: {
          ...props.product,
          // 确保原始商品信息中包含价格相关数据
          price: props.product.price
        },
        quantity: itemQuantity,
        temperature: selectedTemp.value,
        sugar: selectedSugar.value,
        toppings: selectedToppings.value,
        cupType: selectedCup.value,
        // 单件商品总价（含加料和杯型）
        price: singleItemPrice,
        // 总价 = 单件商品总价 × 数量
        totalPrice: singleItemPrice * itemQuantity
      };
      orderItem.id = props.product.id;
      orderItem.name = props.product.name;
      orderItem.image = props.product.image;
      orderItem.desc = props.product.desc || props.product.description;
      const cartItems = common_vendor.index.getStorageSync("cartItems") || [];
      const existingItemIndex = cartItems.findIndex((item) => {
        const basicMatch = item.id === orderItem.id && item.cupType === orderItem.cupType && item.sugar === orderItem.sugar && item.temperature === orderItem.temperature;
        let toppingsMatch = true;
        if ((item.toppings || []).length !== (orderItem.toppings || []).length) {
          toppingsMatch = false;
        } else {
          const sortedCartToppings = [...item.toppings || []].sort();
          const sortedNewToppings = [...orderItem.toppings || []].sort();
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
        cartItems[existingItemIndex].quantity += itemQuantity;
        cartItems[existingItemIndex].totalPrice = cartItems[existingItemIndex].price * cartItems[existingItemIndex].quantity;
      } else {
        cartItems.push(orderItem);
      }
      common_vendor.index.setStorageSync("cartItems", cartItems);
      common_vendor.index.showToast({
        title: "已加入购物车",
        icon: "success",
        duration: 1500
      });
      emit("add-to-cart", orderItem);
      closePopup();
    };
    common_vendor.watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          selectedTemp.value = "正常冰";
          selectedSugar.value = "全糖";
          selectedToppings.value = [];
          selectedCup.value = "中杯";
          quantity.value = 1;
          common_vendor.nextTick$1(() => {
            setTimeout(() => {
            }, 50);
          });
        }
      },
      { immediate: true }
    );
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: __props.product.image || "/static/images/hot01.png",
        b: common_vendor.t(__props.product.name || "商品名称"),
        c: common_vendor.t(__props.product.desc || "商品描述"),
        d: common_vendor.t(__props.product.price || "0.00"),
        e: common_vendor.o(closePopup),
        f: common_vendor.f(temperatures.value, (temp, index, i0) => {
          return {
            a: common_vendor.t(temp),
            b: "temp-" + index,
            c: selectedTemp.value === temp ? 1 : "",
            d: common_vendor.o(($event) => selectedTemp.value = temp, "temp-" + index)
          };
        }),
        g: common_vendor.f(sugarLevels.value, (sugar, index, i0) => {
          return {
            a: common_vendor.t(sugar),
            b: "sugar-" + index,
            c: selectedSugar.value === sugar ? 1 : "",
            d: common_vendor.o(($event) => selectedSugar.value = sugar, "sugar-" + index)
          };
        }),
        h: common_vendor.f(toppings.value, (topping, index, i0) => {
          return {
            a: common_vendor.t(topping.name),
            b: common_vendor.t(topping.price),
            c: "topping-" + index,
            d: selectedToppings.value.includes(topping.name) ? 1 : "",
            e: common_vendor.o(($event) => toggleTopping(topping.name), "topping-" + index)
          };
        }),
        i: common_vendor.f(cupTypes.value, (cup, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(cup.type),
            b: cup.price > 0
          }, cup.price > 0 ? {
            c: common_vendor.t(cup.price)
          } : {}, {
            d: "cup-" + index,
            e: selectedCup.value === cup.type ? 1 : "",
            f: common_vendor.o(($event) => selectedCup.value = cup.type, "cup-" + index)
          });
        }),
        j: common_vendor.o(decreaseQuantity),
        k: common_vendor.t(quantity.value),
        l: common_vendor.o(increaseQuantity),
        m: common_vendor.t(totalPrice.value),
        n: common_vendor.o(addToCart),
        o: common_vendor.o(contentTap),
        p: __props.visible ? 1 : "",
        q: common_vendor.o(onBackgroundTap)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8be75a7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/shop-detail.js.map
