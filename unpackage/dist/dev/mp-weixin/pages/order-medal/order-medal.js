"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_userModel = require("../../utils/userModel.js");
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
    var _a, _b, _c;
    const userLevel = common_vendor.ref(((_a = utils_userState.userState) == null ? void 0 : _a.memberLevel) || 1);
    const userNickname = common_vendor.ref(((_b = utils_userState.userState) == null ? void 0 : _b.nickname) || "熊猫奶茶会员");
    const userAvatar = common_vendor.ref(((_c = utils_userState.userState) == null ? void 0 : _c.avatar) || "/static/images/avatar.png");
    const currentType = common_vendor.ref(0);
    const navScrollLeft = common_vendor.ref(0);
    const medalTypes = common_vendor.reactive([
      "二十四节气限定",
      "大自然限定微章",
      "鲜果限定",
      "等级徽章"
    ]);
    const allSeasonalMedals = common_vendor.reactive([
      {
        id: "season_01",
        name: "节气 · 立春",
        icon: "../../static/images/medal/season01.png",
        isActive: false
      },
      {
        id: "season_02",
        name: "节气 · 雨水",
        icon: "../../static/images/medal/season02.png",
        isActive: false
      },
      {
        id: "season_03",
        name: "节气 · 惊蛰",
        icon: "../../static/images/medal/season03.png",
        isActive: false
      },
      {
        id: "season_04",
        name: "节气 · 春分",
        icon: "../../static/images/medal/season04.png",
        isActive: false
      },
      {
        id: "season_05",
        name: "节气 · 清明",
        icon: "../../static/images/medal/season05.png",
        isActive: false
      },
      {
        id: "season_06",
        name: "节气 · 谷雨",
        icon: "../../static/images/medal/season06.png",
        isActive: false
      },
      {
        id: "season_07",
        name: "节气 · 立夏",
        icon: "../../static/images/medal/season07.png",
        isActive: false
      },
      {
        id: "season_08",
        name: "节气 · 小满",
        icon: "../../static/images/medal/season08.png",
        isActive: false
      },
      {
        id: "season_09",
        name: "节气 · 芒种",
        icon: "../../static/images/medal/season09.png",
        isActive: false
      },
      {
        id: "season_10",
        name: "节气 · 夏至",
        icon: "../../static/images/medal/season10.png",
        isActive: false
      },
      {
        id: "season_11",
        name: "节气 · 小暑",
        icon: "../../static/images/medal/season11.png",
        isActive: false
      },
      {
        id: "season_12",
        name: "节气 · 大暑",
        icon: "../../static/images/medal/season12.png",
        isActive: false
      },
      {
        id: "season_13",
        name: "节气 · 立秋",
        icon: "../../static/images/medal/season13.png",
        isActive: false
      },
      {
        id: "season_14",
        name: "节气 · 处暑",
        icon: "../../static/images/medal/season14.png",
        isActive: false
      },
      {
        id: "season_15",
        name: "节气 · 白露",
        icon: "../../static/images/medal/season15.png",
        isActive: false
      },
      {
        id: "season_16",
        name: "节气 · 秋分",
        icon: "../../static/images/medal/season16.png",
        isActive: false
      },
      {
        id: "season_17",
        name: "节气 · 寒露",
        icon: "../../static/images/medal/season17.png",
        isActive: false
      },
      {
        id: "season_18",
        name: "节气 · 霜降",
        icon: "../../static/images/medal/season18.png",
        isActive: false
      },
      {
        id: "season_19",
        name: "节气 · 立冬",
        icon: "../../static/images/medal/season19.png",
        isActive: false
      },
      {
        id: "season_20",
        name: "节气 · 小雪",
        icon: "../../static/images/medal/season20.png",
        isActive: false
      }
    ]);
    const allNatureMedals = common_vendor.reactive([
      {
        id: "nature_bee",
        name: "大自然 · 蜜蜂",
        icon: "../../static/images/medal/nature-bee.png",
        isActive: false
      },
      {
        id: "nature_butterfly",
        name: "大自然 · 蝴蝶",
        icon: "../../static/images/medal/nature-butterfly.png",
        isActive: false
      },
      {
        id: "nature_bird",
        name: "大自然 · 小鸟",
        icon: "../../static/images/medal/nature-bird.png",
        isActive: false
      },
      {
        id: "nature_dragonfly",
        name: "大自然 · 蜻蜓",
        icon: "../../static/images/medal/nature-dragonfly.png",
        isActive: false
      },
      {
        id: "nature_cactus",
        name: "大自然 · 仙人掌",
        icon: "../../static/images/medal/nature-cactus.png",
        isActive: false
      },
      {
        id: "nature_mouse",
        name: "大自然 · 老鼠",
        icon: "../../static/images/medal/nature-mouse.png",
        isActive: false
      },
      {
        id: "nature_duck",
        name: "大自然 · 鸭子",
        icon: "../../static/images/medal/nature-duck.png",
        isActive: false
      }
    ]);
    const allLevelMedals = common_vendor.reactive([
      {
        id: "rank_01",
        name: "等级 · Lv1",
        icon: "../../static/images/medal/rank01.png",
        isActive: false
      },
      {
        id: "rank_02",
        name: "等级 · Lv2",
        icon: "../../static/images/medal/rank02.png",
        isActive: false
      },
      {
        id: "rank_03",
        name: "等级 · Lv3",
        icon: "../../static/images/medal/rank03.png",
        isActive: false
      },
      {
        id: "rank_04",
        name: "等级 · Lv4",
        icon: "../../static/images/medal/rank04.png",
        isActive: false
      },
      {
        id: "rank_05",
        name: "等级 · Lv5",
        icon: "../../static/images/medal/rank05.png",
        isActive: false
      },
      {
        id: "rank_06",
        name: "等级 · Lv6",
        icon: "../../static/images/medal/rank06.png",
        isActive: false
      }
    ]);
    const seasonalMedals = common_vendor.ref([...allSeasonalMedals]);
    const natureMedals = common_vendor.ref([...allNatureMedals]);
    const levelMedals = common_vendor.ref([...allLevelMedals]);
    const lastAcquiredMedal = common_vendor.ref(null);
    const totalActiveMedals = common_vendor.computed(() => {
      const seasonalActive = seasonalMedals.value.filter(
        (medal) => medal.isActive
      ).length;
      const natureActive = natureMedals.value.filter(
        (medal) => medal.isActive
      ).length;
      const levelActive = levelMedals.value.filter(
        (medal) => medal.isActive
      ).length;
      return seasonalActive + natureActive + levelActive;
    });
    const initUserMedals = () => {
      if (!utils_userState.userState || !utils_userState.userState.medals || !Array.isArray(utils_userState.userState.medals)) {
        return;
      }
      const userSeasonalMedals = utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "seasonal");
      const userNatureMedals = utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "nature");
      utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "level");
      seasonalMedals.value.forEach((medal) => {
        const userMedal = userSeasonalMedals.find((m) => m.id === medal.id);
        medal.isActive = !!userMedal;
      });
      natureMedals.value.forEach((medal) => {
        const userMedal = userNatureMedals.find((m) => m.id === medal.id);
        medal.isActive = !!userMedal;
      });
      levelMedals.value.forEach((medal, index) => {
        medal.isActive = userLevel.value >= index + 1;
      });
      if (utils_userState.userState.medals.length > 0) {
        const sortedMedals = [...utils_userState.userState.medals].sort(
          (a, b) => b.acquireTime - a.acquireTime
        );
        lastAcquiredMedal.value = sortedMedals[0];
      }
    };
    common_vendor.onMounted(() => {
      initUserMedals();
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
    const handleAvatarError = () => {
      common_vendor.index.__f__("log", "at pages/order-medal/order-medal.vue:559", "头像加载失败，使用默认头像");
    };
    return (_ctx, _cache) => {
      var _a2;
      return {
        a: common_assets._imports_0$6,
        b: common_vendor.p({
          type: "left",
          size: "24",
          color: "#fff"
        }),
        c: common_vendor.o(goBack),
        d: userAvatar.value || "/static/images/avatar",
        e: common_vendor.o(handleAvatarError),
        f: common_vendor.t(userNickname.value),
        g: common_vendor.t(userLevel.value),
        h: common_vendor.t(totalActiveMedals.value),
        i: (_a2 = lastAcquiredMedal.value) == null ? void 0 : _a2.icon,
        j: common_vendor.f(medalTypes, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: currentType.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchType(index), index)
          };
        }),
        k: navScrollLeft.value,
        l: common_vendor.f(seasonalMedals.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        m: common_vendor.f(natureMedals.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        n: common_assets._imports_0$7,
        o: common_vendor.f(levelMedals.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        p: currentType.value,
        q: common_vendor.o(swiperChange),
        r: common_vendor.f(medalTypes, (item, index, i0) => {
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
