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
      "崩铁联动限定",
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
    const allBtMedals = common_vendor.reactive([
      {
        id: "star_medal_01",
        name: "开拓者-穹",
        icon: "../../static/images/medal/bt-star-01.png",
        isActive: false
      },
      {
        id: "star_medal_02",
        name: "开拓者-星",
        icon: "../../static/images/medal/bt-star-02.png",
        isActive: false
      },
      {
        id: "star_medal_03",
        name: "垃圾桶",
        icon: "../../static/images/medal/bt-star-03.png",
        isActive: false
      },
      {
        id: "star_medal_04",
        name: "景元",
        icon: "../../static/images/medal/bt-star-04.png",
        isActive: false
      },
      {
        id: "star_medal_05",
        name: "星核猎手-卡芙卡",
        icon: "../../static/images/medal/bt-star-05.png",
        isActive: false
      },
      {
        id: "star_medal_06",
        name: "星核猎手-刃",
        icon: "../../static/images/medal/bt-star-06.png",
        isActive: false
      },
      {
        id: "star_medal_07",
        name: "开拓者-三月七",
        icon: "../../static/images/medal/bt-star-07.png",
        isActive: false
      },
      {
        id: "star_medal_08",
        name: "开拓者-姬子",
        icon: "../../static/images/medal/bt-star-08.png",
        isActive: false
      },
      {
        id: "star_medal_09",
        name: "开拓者-瓦尔特",
        icon: "../../static/images/medal/bt-star-09.png",
        isActive: false
      },
      {
        id: "star_medal_10",
        name: "开拓者-丹恒",
        icon: "../../static/images/medal/bt-star-10.png",
        isActive: false
      },
      {
        id: "star_medal_11",
        name: "假面愚者-花火",
        icon: "../../static/images/medal/bt-star-11.png",
        isActive: false
      },
      {
        id: "star_medal_12",
        name: "假面愚者-桑博",
        icon: "../../static/images/medal/bt-star-12.png",
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
    const seasonalMedals = common_vendor.reactive([...allSeasonalMedals]);
    const natureMedals = common_vendor.reactive([...allNatureMedals]);
    const levelMedals = common_vendor.reactive([...allLevelMedals]);
    const lastAcquiredMedal = common_vendor.ref(null);
    const initUserMedals = () => {
      if (!utils_userState.userState || !utils_userState.userState.medals || !Array.isArray(utils_userState.userState.medals)) {
        return;
      }
      const userSeasonalMedals = utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "seasonal");
      const userNatureMedals = utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "nature");
      utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "level");
      const userStarRailMedals = utils_userModel.getUserMedalsByType(utils_userState.userState.medals, "starRail");
      seasonalMedals.forEach((medal) => {
        const userMedal = userSeasonalMedals.find((m) => m.id === medal.id);
        medal.isActive = userMedal ? userMedal.isActive !== false : false;
      });
      natureMedals.forEach((medal) => {
        const userMedal = userNatureMedals.find((m) => m.id === medal.id);
        medal.isActive = userMedal ? userMedal.isActive !== false : false;
      });
      allBtMedals.forEach((medal) => {
        const userMedal = userStarRailMedals.find((m) => m.id === medal.id);
        medal.isActive = userMedal ? userMedal.isActive !== false : false;
      });
      levelMedals.forEach((medal, index) => {
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
      common_vendor.index.__f__("log", "at pages/order-medal/order-medal.vue:741", "头像加载失败，使用默认头像");
    };
    const selectedItemId = common_vendor.ref(null);
    const selectMedal = (medal, type) => {
      if (medal.isActive) {
        return;
      }
      if (selectedItemId.value === medal.id) {
        selectedItemId.value = null;
      } else {
        selectedItemId.value = medal.id;
      }
      common_vendor.index.__f__("log", "at pages/order-medal/order-medal.vue:762", "当前选中徽章ID:", selectedItemId.value);
    };
    const handleMedalClick = (medal, type) => {
      selectedMedal.value = medal;
      selectedMedalType.value = type;
      showActivatePopup.value = true;
      selectedItemId.value = null;
    };
    const showActivatePopup = common_vendor.ref(false);
    const selectedMedal = common_vendor.ref(null);
    const selectedMedalType = common_vendor.ref("");
    const cancelActivate = () => {
      showActivatePopup.value = false;
      selectedMedal.value = null;
      selectedMedalType.value = "";
    };
    const confirmActivate = () => {
      if (!utils_userState.userState.lightningStars || utils_userState.userState.lightningStars <= 0) {
        common_vendor.index.showToast({
          title: "点亮星不足",
          icon: "none"
        });
        return;
      }
      if (!selectedMedal.value || !selectedMedalType.value) {
        return;
      }
      let typeDescription = "限定徽章";
      switch (selectedMedalType.value) {
        case "seasonal":
          typeDescription = "二十四节气限定徽章";
          break;
        case "nature":
          typeDescription = "大自然限定徽章";
          break;
        case "starRail":
          typeDescription = "星穹铁道限定徽章";
          break;
      }
      const newMedal = {
        id: selectedMedal.value.id,
        name: selectedMedal.value.name,
        icon: selectedMedal.value.icon,
        type: selectedMedalType.value,
        description: `${typeDescription}：${selectedMedal.value.name}`,
        acquireTime: Date.now(),
        isActive: true
      };
      const currentMedals = [...utils_userState.userState.medals || []];
      const medalExists = currentMedals.some((medal) => medal.id === newMedal.id);
      const updatedMedals = medalExists ? currentMedals : [...currentMedals, newMedal];
      const updatedUserInfo = {
        lightningStars: utils_userState.userState.lightningStars - 1,
        medals: updatedMedals
      };
      const success = utils_userState.updateUserState(updatedUserInfo);
      if (success) {
        common_vendor.index.showToast({
          title: "徽章点亮成功",
          icon: "success"
        });
        initUserMedals();
        if (selectedMedalType.value === "seasonal") {
          const medalToUpdate = seasonalMedals.find(
            (m) => m.id === selectedMedal.value.id
          );
          if (medalToUpdate)
            medalToUpdate.isActive = true;
        } else if (selectedMedalType.value === "nature") {
          const medalToUpdate = natureMedals.find(
            (m) => m.id === selectedMedal.value.id
          );
          if (medalToUpdate)
            medalToUpdate.isActive = true;
        } else if (selectedMedalType.value === "starRail") {
          const medalToUpdate = allBtMedals.find(
            (m) => m.id === selectedMedal.value.id
          );
          if (medalToUpdate)
            medalToUpdate.isActive = true;
        }
      } else {
        common_vendor.index.showToast({
          title: "徽章点亮失败",
          icon: "none"
        });
      }
      showActivatePopup.value = false;
      selectedMedal.value = null;
      selectedMedalType.value = "";
    };
    return (_ctx, _cache) => {
      var _a2, _b2, _c2;
      return common_vendor.e({
        a: common_assets._imports_0$7,
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
        h: common_vendor.t(common_vendor.unref(utils_userState.userState).medals ? common_vendor.unref(utils_userState.userState).medals.length : 0),
        i: common_vendor.t(common_vendor.unref(utils_userState.userState).lightningStars || 0),
        j: (_a2 = lastAcquiredMedal.value) == null ? void 0 : _a2.icon,
        k: common_vendor.f(medalTypes, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: currentType.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchType(index), index)
          };
        }),
        l: navScrollLeft.value,
        m: common_vendor.f(seasonalMedals, (item, index, i0) => {
          return common_vendor.e({
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: !item.isActive && selectedItemId.value === item.id ? 1 : "",
            e: common_vendor.o(($event) => selectMedal(item), index),
            f: common_vendor.t(item.name),
            g: !item.isActive ? 1 : "",
            h: !item.isActive && selectedItemId.value === item.id
          }, !item.isActive && selectedItemId.value === item.id ? {
            i: common_vendor.o(($event) => handleMedalClick(item, "seasonal"), index)
          } : {}, {
            j: index
          });
        }),
        n: common_vendor.f(natureMedals, (item, index, i0) => {
          return common_vendor.e({
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: !item.isActive && selectedItemId.value === item.id ? 1 : "",
            e: common_vendor.o(($event) => selectMedal(item), index),
            f: common_vendor.t(item.name),
            g: !item.isActive ? 1 : "",
            h: !item.isActive && selectedItemId.value === item.id
          }, !item.isActive && selectedItemId.value === item.id ? {
            i: common_vendor.o(($event) => handleMedalClick(item, "nature"), index)
          } : {}, {
            j: index
          });
        }),
        o: common_vendor.f(allBtMedals, (item, index, i0) => {
          return common_vendor.e({
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: !item.isActive && selectedItemId.value === item.id ? 1 : "",
            e: common_vendor.o(($event) => selectMedal(item), index),
            f: common_vendor.t(item.name),
            g: !item.isActive ? 1 : "",
            h: !item.isActive && selectedItemId.value === item.id
          }, !item.isActive && selectedItemId.value === item.id ? {
            i: common_vendor.o(($event) => handleMedalClick(item, "starRail"), index)
          } : {}, {
            j: index
          });
        }),
        p: common_vendor.f(levelMedals, (item, index, i0) => {
          return {
            a: item.icon,
            b: !item.isActive ? 1 : "",
            c: !item.isActive ? 1 : "",
            d: common_vendor.t(item.name),
            e: !item.isActive ? 1 : "",
            f: index
          };
        }),
        q: currentType.value,
        r: common_vendor.o(swiperChange),
        s: showActivatePopup.value
      }, showActivatePopup.value ? {
        t: (_b2 = selectedMedal.value) == null ? void 0 : _b2.icon,
        v: common_vendor.t((_c2 = selectedMedal.value) == null ? void 0 : _c2.name),
        w: common_vendor.t(common_vendor.unref(utils_userState.userState).lightningStars || 0),
        x: common_vendor.o(cancelActivate),
        y: common_vendor.t((common_vendor.unref(utils_userState.userState).lightningStars || 0) <= 0 ? "点亮星不足" : "确认点亮"),
        z: common_vendor.o(confirmActivate),
        A: (common_vendor.unref(utils_userState.userState).lightningStars || 0) <= 0,
        B: common_vendor.o(() => {
        }),
        C: common_vendor.o(cancelActivate)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d354906b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-medal/order-medal.js.map
