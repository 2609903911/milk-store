"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_userState = require("../../utils/userState.js");
if (!Array) {
  const _easycom_shop_detail2 = common_vendor.resolveComponent("shop-detail");
  _easycom_shop_detail2();
}
const _easycom_shop_detail = () => "../components/shop-detail.js";
if (!Math) {
  (_easycom_shop_detail + OrderCart)();
}
const OrderDetail = () => "../components/shop-detail.js";
const OrderCart = () => "../components/order-cart.js";
const _sfc_main = /* @__PURE__ */ Object.assign({
  components: {
    OrderDetail,
    OrderCart
  }
}, {
  __name: "order",
  setup(__props) {
    const shopName = common_vendor.ref("九江学院四食堂店");
    const shopDistance = common_vendor.ref("0.41km");
    const shopAddress = common_vendor.ref("九江市中心区繁华路88号");
    const deliveryType = common_vendor.ref("self");
    common_vendor.watch(deliveryType, (newValue) => {
      common_vendor.index.setStorageSync("deliveryType", newValue);
      common_vendor.index.__f__("log", "at pages/order/order.vue:315", "配送方式已更新:", newValue);
    });
    common_vendor.onMounted(() => {
      const savedDeliveryType = common_vendor.index.getStorageSync("deliveryType");
      if (savedDeliveryType) {
        deliveryType.value = savedDeliveryType;
      }
    });
    const noticeList = common_vendor.ref([
      "周一现场下单立减5元，仅限堂食",
      "会员日消费满30元送小确幸优惠券",
      "新品上市：丝绒芝士莓莓，芝士与草莓的完美融合"
    ]);
    const promoList = common_vendor.ref([
      {
        image: "/static/images/hot01.png",
        title: "杨梅吐气"
      },
      {
        image: "/static/images/hot02.png",
        title: "手作米麻薯"
      },
      {
        image: "/static/images/hot03.png",
        title: "满杯芭乐"
      },
      {
        image: "/static/images/hot04.png",
        title: "抹茶奶绿"
      },
      {
        image: "/static/images/hot05.png",
        title: "喜凤梨"
      }
    ]);
    const scrollLeft = common_vendor.ref(0);
    const onScroll = (e) => {
      scrollLeft.value = e.detail.scrollLeft;
    };
    const activeTab = common_vendor.ref("menu");
    const activeCategoryIndex = common_vendor.ref(0);
    common_vendor.watch(activeTab, (newValue) => {
      if (newValue === "coupon") {
        loadUserCoupons();
      }
    });
    const currentCategoryId = common_vendor.ref("product-0");
    const categories = common_vendor.ref([
      {
        name: "招牌奶茶",
        products: [
          {
            image: "/static/images/hot01.png",
            name: "杨梅吐气",
            desc: "杨梅与气泡水的完美融合",
            price: 12
          },
          {
            image: "/static/images/hot02.png",
            name: "手作米麻薯",
            desc: "手工制作的米麻薯，口感Q弹",
            price: 10
          },
          {
            image: "/static/images/hot03.png",
            name: "满杯芭乐",
            desc: "新鲜芭乐与气泡水的完美结合",
            price: 15
          },
          {
            image: "/static/images/hot04.png",
            name: "抹茶奶绿",
            desc: "抹茶与奶绿的清新搭配",
            price: 10
          },
          {
            image: "/static/images/hot05.png",
            name: "喜凤梨",
            desc: "凤梨与气泡水的甜蜜组合",
            price: 12
          }
        ]
      },
      {
        name: "真鲜奶茶",
        products: [
          {
            image: "/static/images/new01.png",
            name: "经典奶茶",
            desc: "选用进口奶源，醇香浓郁",
            price: 15
          },
          {
            image: "/static/images/new02.png",
            name: "红豆奶茶",
            desc: "香甜红豆与奶茶的经典搭配",
            price: 18
          },
          {
            image: "/static/images/new03.png",
            name: "布丁奶茶",
            desc: "Q弹布丁与香浓奶茶的融合",
            price: 20
          },
          {
            image: "/static/images/new04.png",
            name: "珍珠奶茶",
            desc: "嚼劲十足的珍珠与奶茶的完美融合",
            price: 16
          },
          {
            image: "/static/images/new05.png",
            name: "芋圆奶茶",
            desc: "Q弹芋圆与丝滑奶茶的组合",
            price: 14
          }
        ]
      },
      {
        name: "新品种草",
        products: [
          {
            image: "/static/images/classic01.png",
            name: "芝芝莓莓",
            desc: "草莓与芝士的梦幻搭配",
            price: 22
          },
          {
            image: "/static/images/classic02.png",
            name: "多肉葡萄",
            desc: "多肉与葡萄的创新组合",
            price: 20
          },
          {
            image: "/static/images/classic03.png",
            name: "芒果雪冰",
            desc: "新鲜芒果加上细腻雪冰",
            price: 18
          },
          {
            image: "/static/images/classic04.png",
            name: "椰云拿铁",
            desc: "丝滑拿铁与椰云的结合",
            price: 16
          },
          {
            image: "/static/images/classic05.png",
            name: "桃桃乌龙",
            desc: "乌龙茶与水蜜桃的清新口味",
            price: 19
          }
        ]
      },
      {
        name: "清爽鲜果茶",
        products: [
          {
            image: "/static/images/fruit01.png",
            name: "满杯百香",
            desc: "新鲜百香果，酸甜可口",
            price: 16
          },
          {
            image: "/static/images/fruit02.png",
            name: "柠檬绿茶",
            desc: "清新柠檬与绿茶的搭配",
            price: 14
          },
          {
            image: "/static/images/fruit03.png",
            name: "蜜桃乌龙",
            desc: "香甜蜜桃与乌龙茶的结合",
            price: 18
          },
          {
            image: "/static/images/fruit04.png",
            name: "金桔柠檬",
            desc: "酸甜可口的金桔柠檬",
            price: 15
          },
          {
            image: "/static/images/fruit05.png",
            name: "青提乌龙",
            desc: "清爽青提与醇香乌龙茶",
            price: 17
          }
        ]
      }
    ]);
    const categoryHeights = common_vendor.ref([]);
    const calculateHeights = () => {
      let heights = [];
      let currentHeight = 0;
      categories.value.forEach((category, index) => {
        heights.push(currentHeight);
        const categoryHeight = 60 + category.products.length * 200;
        currentHeight += categoryHeight;
      });
      categoryHeights.value = heights;
    };
    common_vendor.onMounted(() => {
      calculateHeights();
      updateStoreInfo();
      common_vendor.index.$on("store-selected", handleStoreSelected);
      common_vendor.index.$on("refresh-order-page", refreshPage);
    });
    common_vendor.onShow(() => {
      updateStoreInfo();
      loadUserCoupons();
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("store-selected", handleStoreSelected);
      common_vendor.index.$off("refresh-order-page", refreshPage);
    });
    const handleStoreSelected = (data) => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:570", "收到门店选择事件:", data);
      common_vendor.index.__f__("log", "at pages/order/order.vue:571", data);
      if (data) {
        if (data.name) {
          shopName.value = data.name;
        }
        if (data.distance) {
          shopDistance.value = data.distance;
        }
        if (data.address) {
          shopAddress.value = data.address;
        }
        common_vendor.nextTick$1(() => {
          const temp = shopName.value;
          shopName.value = temp + " ";
          setTimeout(() => {
            shopName.value = temp;
          }, 10);
        });
      }
    };
    const updateStoreInfo = () => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:597", "更新门店信息");
      const selectedStore = common_vendor.index.getStorageSync("selectedStore");
      if (selectedStore) {
        common_vendor.index.__f__("log", "at pages/order/order.vue:600", "从存储中获取到的门店信息:", selectedStore);
        let updated = false;
        if (selectedStore.name && selectedStore.name !== shopName.value) {
          shopName.value = selectedStore.name;
          updated = true;
        }
        if (selectedStore.distance && selectedStore.distance !== shopDistance.value) {
          shopDistance.value = selectedStore.distance;
          updated = true;
        }
        if (selectedStore.address && selectedStore.address !== shopAddress.value) {
          shopAddress.value = selectedStore.address;
          updated = true;
        }
        if (updated) {
          common_vendor.nextTick$1(() => {
            common_vendor.index.__f__("log", "at pages/order/order.vue:626", "强制刷新UI");
          });
        }
      }
    };
    const selectCategory = (index) => {
      activeCategoryIndex.value = index;
      currentCategoryId.value = "product-" + index;
    };
    const isPromoHidden = common_vendor.ref(false);
    const onProductScroll = (e) => {
      const scrollTop = e.detail.scrollTop;
      const estimatedIndex = Math.floor(scrollTop / 600);
      if (estimatedIndex >= 0 && estimatedIndex < categories.value.length) {
        if (activeCategoryIndex.value !== estimatedIndex) {
          activeCategoryIndex.value = estimatedIndex;
        }
      }
      isPromoHidden.value = scrollTop > 50;
    };
    const coupons = common_vendor.ref([]);
    const formatDate = (timestamp) => {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const loadUserCoupons = () => {
      if (utils_userState.userState.coupons && Array.isArray(utils_userState.userState.coupons)) {
        coupons.value = utils_userState.userState.coupons.map((coupon) => {
          let discount = "";
          let unit = "";
          let color = "";
          switch (coupon.type) {
            case "discount":
              discount = coupon.value;
              unit = "折";
              color = "#007AFF";
              break;
            case "cash":
              discount = coupon.value;
              unit = "元";
              color = "#FF6B00";
              break;
            case "free":
              discount = "免单";
              unit = "";
              color = "#FF2D55";
              break;
            case "buyOneGetOne":
              discount = "买一";
              unit = "赠一";
              color = "#34C759";
              break;
            case "specialPrice":
              discount = coupon.value;
              unit = "元";
              color = "#AF52DE";
              break;
            case "shipping":
              discount = "免";
              unit = "运费";
              color = "#5856D6";
              break;
            default:
              discount = coupon.value;
              unit = "";
              color = "#007AFF";
          }
          const expireDate = formatDate(coupon.endTime);
          return {
            id: coupon.id,
            discount,
            unit,
            type: coupon.scope === "all" ? "全场通用" : "部分商品",
            title: coupon.title,
            description: coupon.description || (coupon.minOrderAmount > 0 ? `满${coupon.minOrderAmount}元可用` : ""),
            expireDate,
            scope: coupon.description,
            color,
            originalCoupon: coupon
            // 保存原始优惠券数据，便于后续使用
          };
        });
        common_vendor.index.__f__("log", "at pages/order/order.vue:750", "已加载优惠券：", coupons.value.length, "张");
      } else {
        common_vendor.index.__f__("warn", "at pages/order/order.vue:752", "未找到用户优惠券数据");
      }
    };
    const useCoupon = (coupon) => {
      activeTab.value = "menu";
      common_vendor.index.showToast({
        title: "已选择优惠券：" + coupon.title,
        icon: "none"
      });
    };
    common_vendor.ref(1);
    common_vendor.ref(0);
    const productDetailVisible = common_vendor.ref(false);
    const selectedProduct = common_vendor.ref({});
    const openProductDetail = (category, product) => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:803", "打开商品详情", category.name, product.name);
      selectedProduct.value = { ...product, category: category.name };
      setTimeout(() => {
        productDetailVisible.value = true;
      }, 50);
    };
    const updateDetailVisible = (val) => {
      if (val === false) {
        setTimeout(() => {
          productDetailVisible.value = val;
        }, 300);
      } else {
        productDetailVisible.value = val;
      }
    };
    const orderCartRef = common_vendor.ref(null);
    const handleAddToCart = (item) => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:830", "添加到购物车", item);
      if (!item) {
        common_vendor.index.__f__("error", "at pages/order/order.vue:833", "添加到购物车的商品数据为空");
        return;
      }
      common_vendor.nextTick$1(() => {
        if (orderCartRef.value) {
          orderCartRef.value.addToCart(item);
        } else {
          common_vendor.index.__f__("warn", "at pages/order/order.vue:843", "orderCartRef不存在，尝试其他方式获取组件");
          const pages = getCurrentPages();
          if (pages && pages.length > 0) {
            const currentPage = pages[pages.length - 1];
            if (currentPage.$refs && currentPage.$refs.orderCartRef) {
              currentPage.$refs.orderCartRef.addToCart(item);
            } else {
              common_vendor.index.__f__("error", "at pages/order/order.vue:851", "无法获取购物车组件引用");
            }
          } else {
            common_vendor.index.__f__("error", "at pages/order/order.vue:854", "无法获取当前页面实例");
          }
        }
      });
    };
    const openPromoDetail = (item) => {
      const product = findProductByTitle(item.title);
      if (product) {
        common_vendor.index.__f__("log", "at pages/order/order.vue:868", "打开促销商品详情", item.title);
        selectedProduct.value = { ...product };
        setTimeout(() => {
          productDetailVisible.value = true;
        }, 50);
      }
    };
    const findProductByTitle = (title) => {
      for (const category of categories.value) {
        const product = category.products.find((p) => p.name === title);
        if (product)
          return product;
      }
      return null;
    };
    const navigateToMap = () => {
      common_vendor.index.navigateTo({
        url: "/pages/map/map"
      });
    };
    const refreshPage = () => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:896", "执行页面刷新");
      updateStoreInfo();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(shopName.value),
        b: common_vendor.t(shopAddress.value),
        c: common_vendor.t(shopDistance.value),
        d: common_vendor.o(navigateToMap),
        e: deliveryType.value === "self" ? 1 : "",
        f: common_vendor.o(($event) => deliveryType.value = "self"),
        g: deliveryType.value === "delivery" ? 1 : "",
        h: common_vendor.o(($event) => deliveryType.value = "delivery"),
        i: common_vendor.f(noticeList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        j: common_vendor.f(promoList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: index,
            c: common_vendor.o(($event) => openPromoDetail(item), index)
          };
        }),
        k: common_vendor.o(onScroll),
        l: isPromoHidden.value ? 1 : "",
        m: activeTab.value === "menu" ? 1 : "",
        n: common_vendor.o(($event) => activeTab.value = "menu"),
        o: activeTab.value === "coupon" ? 1 : "",
        p: common_vendor.o(($event) => activeTab.value = "coupon"),
        q: activeTab.value === "menu"
      }, activeTab.value === "menu" ? {
        r: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: activeCategoryIndex.value === index ? 1 : "",
            c: index,
            d: "cate-" + index,
            e: common_vendor.o(($event) => selectCategory(index), index)
          };
        }),
        s: "cate-" + activeCategoryIndex.value,
        t: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: common_vendor.f(category.products, (product, pIndex, i1) => {
              return {
                a: product.image,
                b: common_vendor.t(product.name),
                c: common_vendor.t(product.desc),
                d: common_vendor.t(product.price),
                e: common_vendor.o(($event) => openProductDetail(category, product), pIndex),
                f: pIndex
              };
            }),
            c: index,
            d: "product-" + index
          };
        }),
        v: currentCategoryId.value,
        w: common_vendor.o(onProductScroll)
      } : {
        x: common_vendor.f(coupons.value, (coupon, index, i0) => {
          return {
            a: common_vendor.t(coupon.discount),
            b: common_vendor.t(coupon.unit),
            c: common_vendor.t(coupon.type),
            d: coupon.color,
            e: common_vendor.t(coupon.title),
            f: common_vendor.t(coupon.description),
            g: common_vendor.t(coupon.expireDate),
            h: common_vendor.t(coupon.scope),
            i: common_vendor.o(($event) => useCoupon(coupon), index),
            j: coupon.color,
            k: index
          };
        })
      }, {
        y: isPromoHidden.value ? 1 : "",
        z: productDetailVisible.value
      }, productDetailVisible.value ? {
        A: common_vendor.o(updateDetailVisible),
        B: common_vendor.o(handleAddToCart),
        C: common_vendor.p({
          visible: productDetailVisible.value,
          product: selectedProduct.value
        })
      } : {}, {
        D: common_vendor.sr(orderCartRef, "93207a4f-1", {
          "k": "orderCartRef"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
