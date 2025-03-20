"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (OrderDetail + OrderCart)();
}
const OrderDetail = () => "../components/order-detail.js";
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
    const deliveryType = common_vendor.ref("self");
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
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("store-selected", handleStoreSelected);
      common_vendor.index.$off("refresh-order-page", refreshPage);
    });
    const handleStoreSelected = (data) => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:538", "收到门店选择事件:", data);
      if (data) {
        if (data.name) {
          shopName.value = data.name;
        }
        if (data.distance) {
          shopDistance.value = data.distance;
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
      common_vendor.index.__f__("log", "at pages/order/order.vue:561", "更新门店信息");
      const selectedStore = common_vendor.index.getStorageSync("selectedStore");
      if (selectedStore) {
        common_vendor.index.__f__("log", "at pages/order/order.vue:564", "从存储中获取到的门店信息:", selectedStore);
        let updated = false;
        if (selectedStore.name && selectedStore.name !== shopName.value) {
          shopName.value = selectedStore.name;
          updated = true;
        }
        if (selectedStore.distance && selectedStore.distance !== shopDistance.value) {
          shopDistance.value = selectedStore.distance;
          updated = true;
        }
        if (updated) {
          common_vendor.nextTick$1(() => {
            common_vendor.index.__f__("log", "at pages/order/order.vue:583", "强制刷新UI");
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
    const coupons = common_vendor.ref([
      {
        discount: "9.5",
        unit: "折",
        type: "到店、外卖",
        title: "【3月会员签到】订单95折券",
        description: "",
        expireDate: "2025-03-22 23:59:59",
        scope: "部分门店，部分商品",
        color: "#007AFF"
      },
      {
        discount: "5",
        unit: "元",
        type: "到店自取",
        title: "【新人优惠】满20减5元券",
        description: "满20元可用",
        expireDate: "2025-04-15 23:59:59",
        scope: "全部门店，部分商品",
        color: "#FF6B00"
      },
      {
        discount: "10",
        unit: "元",
        type: "外卖专享",
        title: "【周末福利】满30减10元券",
        description: "满30元可用",
        expireDate: "2025-03-30 23:59:59",
        scope: "部分门店，全部商品",
        color: "#FF2D55"
      }
    ]);
    const useCoupon = (coupon) => {
      activeTab.value = "menu";
    };
    common_vendor.ref(1);
    common_vendor.ref(0);
    const productDetailVisible = common_vendor.ref(false);
    const selectedProduct = common_vendor.ref({});
    const openProductDetail = (category, product) => {
      common_vendor.index.__f__("log", "at pages/order/order.vue:694", "打开商品详情", category.name, product.name);
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
      common_vendor.index.__f__("log", "at pages/order/order.vue:721", "添加到购物车", item);
      if (!item) {
        common_vendor.index.__f__("error", "at pages/order/order.vue:724", "添加到购物车的商品数据为空");
        return;
      }
      common_vendor.nextTick$1(() => {
        if (orderCartRef.value) {
          orderCartRef.value.addToCart(item);
        } else {
          common_vendor.index.__f__("warn", "at pages/order/order.vue:734", "orderCartRef不存在，尝试其他方式获取组件");
          const pages = getCurrentPages();
          if (pages && pages.length > 0) {
            const currentPage = pages[pages.length - 1];
            if (currentPage.$refs && currentPage.$refs.orderCartRef) {
              currentPage.$refs.orderCartRef.addToCart(item);
            } else {
              common_vendor.index.__f__("error", "at pages/order/order.vue:742", "无法获取购物车组件引用");
            }
          } else {
            common_vendor.index.__f__("error", "at pages/order/order.vue:745", "无法获取当前页面实例");
          }
        }
      });
    };
    const openPromoDetail = (item) => {
      const product = findProductByTitle(item.title);
      if (product) {
        common_vendor.index.__f__("log", "at pages/order/order.vue:759", "打开促销商品详情", item.title);
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
      common_vendor.index.__f__("log", "at pages/order/order.vue:787", "执行页面刷新");
      updateStoreInfo();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(shopName.value),
        b: common_vendor.t(shopDistance.value),
        c: common_vendor.o(navigateToMap),
        d: deliveryType.value === "self" ? 1 : "",
        e: common_vendor.o(($event) => deliveryType.value = "self"),
        f: deliveryType.value === "delivery" ? 1 : "",
        g: common_vendor.o(($event) => deliveryType.value = "delivery"),
        h: common_vendor.f(noticeList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        i: common_vendor.f(promoList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: index,
            c: common_vendor.o(($event) => openPromoDetail(item), index)
          };
        }),
        j: common_vendor.o(onScroll),
        k: isPromoHidden.value ? 1 : "",
        l: activeTab.value === "menu" ? 1 : "",
        m: common_vendor.o(($event) => activeTab.value = "menu"),
        n: activeTab.value === "coupon" ? 1 : "",
        o: common_vendor.o(($event) => activeTab.value = "coupon"),
        p: activeTab.value === "menu"
      }, activeTab.value === "menu" ? {
        q: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category.name),
            b: activeCategoryIndex.value === index ? 1 : "",
            c: index,
            d: "cate-" + index,
            e: common_vendor.o(($event) => selectCategory(index), index)
          };
        }),
        r: "cate-" + activeCategoryIndex.value,
        s: common_vendor.f(categories.value, (category, index, i0) => {
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
        t: currentCategoryId.value,
        v: common_vendor.o(onProductScroll)
      } : {
        w: common_vendor.f(coupons.value, (coupon, index, i0) => {
          return {
            a: common_vendor.t(coupon.discount),
            b: common_vendor.t(coupon.unit),
            c: common_vendor.t(coupon.type),
            d: coupon.color,
            e: common_vendor.t(coupon.title),
            f: common_vendor.t(coupon.description),
            g: common_vendor.t(coupon.expireDate),
            h: common_vendor.t(coupon.scope),
            i: common_vendor.o(($event) => useCoupon(), index),
            j: coupon.color,
            k: index
          };
        })
      }, {
        x: isPromoHidden.value ? 1 : "",
        y: productDetailVisible.value
      }, productDetailVisible.value ? {
        z: common_vendor.o(updateDetailVisible),
        A: common_vendor.o(handleAddToCart),
        B: common_vendor.p({
          visible: productDetailVisible.value,
          product: selectedProduct.value
        })
      } : {}, {
        C: common_vendor.sr(orderCartRef, "93207a4f-1", {
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
