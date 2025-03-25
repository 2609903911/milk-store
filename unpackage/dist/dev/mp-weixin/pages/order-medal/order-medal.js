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
const _sfc_main = {
  __name: "order-medal",
  setup(__props) {
    const userLevel = common_vendor.ref(4);
    const currentType = common_vendor.ref(0);
    const navScrollLeft = common_vendor.ref(0);
    const medalTypes = common_vendor.reactive([
      "二十四节气限定",
      "大自然限定微章",
      "鲜果限定",
      "等级徽章"
    ]);
    const seasonalMedals = common_vendor.reactive([
      {
        name: "节气 · 立春",
        icon: "../../static/images/medal/season01.png",
        isActive: true
      },
      {
        name: "节气 · 雨水",
        icon: "../../static/images/medal/season02.png",
        isActive: true
      },
      {
        name: "节气 · 惊蛰",
        icon: "../../static/images/medal/season03.png",
        isActive: false
      },
      {
        name: "节气 · 春分",
        icon: "../../static/images/medal/season04.png",
        isActive: false
      },
      {
        name: "节气 · 清明",
        icon: "../../static/images/medal/season05.png",
        isActive: false
      },
      {
        name: "节气 · 谷雨",
        icon: "../../static/images/medal/season06.png",
        isActive: true
      },
      {
        name: "节气 · 立夏",
        icon: "../../static/images/medal/season07.png",
        isActive: false
      },
      {
        name: "节气 · 小满",
        icon: "../../static/images/medal/season08.png",
        isActive: true
      },
      {
        name: "节气 · 芒种",
        icon: "../../static/images/medal/season09.png",
        isActive: false
      },
      {
        name: "节气 · 夏至",
        icon: "../../static/images/medal/season10.png",
        isActive: false
      },
      {
        name: "节气 · 小暑",
        icon: "../../static/images/medal/season11.png",
        isActive: false
      },
      {
        name: "节气 · 大暑",
        icon: "../../static/images/medal/season12.png",
        isActive: false
      },
      {
        name: "节气 · 立秋",
        icon: "../../static/images/medal/season13.png",
        isActive: false
      },
      {
        name: "节气 · 处暑",
        icon: "../../static/images/medal/season14.png",
        isActive: false
      },
      {
        name: "节气 · 白露",
        icon: "../../static/images/medal/season15.png",
        isActive: false
      },
      {
        name: "节气 · 秋分",
        icon: "../../static/images/medal/season16.png",
        isActive: true
      },
      {
        name: "节气 · 寒露",
        icon: "../../static/images/medal/season17.png",
        isActive: false
      },
      {
        name: "节气 · 霜降",
        icon: "../../static/images/medal/season18.png",
        isActive: false
      },
      {
        name: "节气 · 立冬",
        icon: "../../static/images/medal/season19.png",
        isActive: true
      },
      {
        name: "节气 · 小雪",
        icon: "../../static/images/medal/season20.png",
        isActive: false
      }
    ]);
    const natureMedals = common_vendor.reactive([
      {
        name: "大自然 · 蜜蜂",
        icon: "../../static/images/medal/nature-bee.png",
        isActive: true
      },
      {
        name: "大自然 · 蝴蝶",
        icon: "../../static/images/medal/nature-butterfly.png",
        isActive: true
      },
      {
        name: "大自然 · 小鸟",
        icon: "../../static/images/medal/nature-bird.png",
        isActive: false
      },
      {
        name: "大自然 · 蜻蜓",
        icon: "../../static/images/medal/nature-dragonfly.png",
        isActive: false
      },
      {
        name: "大自然 · 仙人掌",
        icon: "../../static/images/medal/nature-cactus.png",
        isActive: true
      },
      {
        name: "大自然 · 老鼠",
        icon: "../../static/images/medal/nature-mouse.png",
        isActive: false
      },
      {
        name: "大自然 · 鸭子",
        icon: "../../static/images/medal/nature-duck.png",
        isActive: false
      }
    ]);
    const levelMedals = common_vendor.reactive([
      {
        name: "等级 · Lv1",
        icon: "../../static/images/medal/rank01.png",
        isActive: userLevel.value >= 1
      },
      {
        name: "等级 · Lv2",
        icon: "../../static/images/medal/rank02.png",
        isActive: userLevel.value >= 2
      },
      {
        name: "等级 · Lv3",
        icon: "../../static/images/medal/rank03.png",
        isActive: userLevel.value >= 3
      },
      {
        name: "等级 · Lv4",
        icon: "../../static/images/medal/rank04.png",
        isActive: userLevel.value >= 4
      },
      {
        name: "等级 · Lv5",
        icon: "../../static/images/medal/rank05.png",
        isActive: userLevel.value >= 5
      },
      {
        name: "等级 · Lv6",
        icon: "../../static/images/medal/rank06.png",
        isActive: userLevel.value >= 6
      }
    ]);
    const totalActiveMedals = common_vendor.computed(() => {
      const seasonalActive = seasonalMedals.filter(
        (medal) => medal.isActive
      ).length;
      const natureActive = natureMedals.filter((medal) => medal.isActive).length;
      const levelActive = levelMedals.filter((medal) => medal.isActive).length;
      return seasonalActive + natureActive + levelActive;
    });
    const switchType = (index) => {
      currentType.value = index;
      calculateScrollLeft(index);
    };
    const calculateScrollLeft = (index) => {
      const itemWidth = 120;
      const windowWidth = common_vendor.index.getSystemInfoSync().windowWidth;
      const center = windowWidth / 2;
      navScrollLeft.value = index * itemWidth - center + itemWidth / 2;
      if (navScrollLeft.value < 0) {
        navScrollLeft.value = 0;
      }
    };
    const swiperChange = (e) => {
      const current = e.detail.current;
      currentType.value = current;
      calculateScrollLeft(current);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$6,
        b: common_vendor.p({
          type: "left",
          size: "24",
          color: "#fff"
        }),
        c: common_vendor.o(goBack),
        d: common_assets._imports_1$4,
        e: common_vendor.t(userLevel.value),
        f: common_vendor.t(totalActiveMedals.value),
        g: common_assets._imports_2$3,
        h: common_vendor.f(medalTypes, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: currentType.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchType(index), index)
          };
        }),
        i: navScrollLeft.value,
        j: common_vendor.f(seasonalMedals, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        k: common_vendor.f(natureMedals, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        l: common_assets._imports_0$7,
        m: common_vendor.f(levelMedals, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        n: currentType.value,
        o: common_vendor.o(swiperChange),
        p: common_vendor.f(medalTypes, (item, index, i0) => {
          return {
            a: index,
            b: currentType.value === index ? 1 : ""
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d354906b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-medal/order-medal.js.map
