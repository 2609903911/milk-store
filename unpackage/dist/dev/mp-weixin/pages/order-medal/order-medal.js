"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_userData = require("../../utils/userData.js");
const utils_request = require("../../utils/request.js");
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
    const medalTypes = common_vendor.reactive([]);
    const allSeasonalMedals = common_vendor.reactive([]);
    const allNatureMedals = common_vendor.reactive([]);
    const allBtMedals = common_vendor.reactive([]);
    const allLevelMedals = common_vendor.reactive([]);
    const seasonalMedals = common_vendor.reactive([]);
    const natureMedals = common_vendor.reactive([]);
    const btMedals = common_vendor.reactive([]);
    const levelMedals = common_vendor.reactive([]);
    const lastAcquiredMedal = common_vendor.ref(null);
    const fetchMedalTypes = async () => {
      try {
        const apiUrl = "/api/medals/types";
        const response = await utils_request.get(
          apiUrl,
          {},
          {
            showError: true,
            loading: true,
            loadingText: "加载勋章类型中..."
          }
        );
        const responseData = response.data && response.data.data ? response.data.data : response.data && response.data.code === 200 ? response.data.data : null;
        if (responseData) {
          medalTypes.splice(0, medalTypes.length);
          responseData.forEach((type) => {
            medalTypes.push(type.typeName);
          });
        } else {
          medalTypes.splice(
            0,
            medalTypes.length,
            "二十四节气限定",
            "大自然限定微章",
            "崩铁联动限定",
            "等级徽章"
          );
        }
      } catch (error) {
        medalTypes.splice(
          0,
          medalTypes.length,
          "二十四节气限定",
          "大自然限定微章",
          "崩铁联动限定",
          "等级徽章"
        );
      }
    };
    const fetchAllMedals = async () => {
      try {
        const apiUrl = "/api/medals";
        const response = await utils_request.get(
          apiUrl,
          {},
          {
            showError: true,
            loading: true,
            loadingText: "加载勋章数据中..."
          }
        );
        const responseData = response.data && response.data.data ? response.data.data : response.data && response.data.code === 200 ? response.data.data : null;
        if (responseData) {
          const medals = responseData;
          allSeasonalMedals.splice(0, allSeasonalMedals.length);
          allNatureMedals.splice(0, allNatureMedals.length);
          allBtMedals.splice(0, allBtMedals.length);
          allLevelMedals.splice(0, allLevelMedals.length);
          medals.forEach((medal) => {
            const medalData = {
              id: medal.medalId,
              name: medal.medalName,
              icon: medal.iconPath || medal.icon || `../../static/images/medal/${medal.medalId}.png`,
              isActive: false,
              description: medal.description
            };
            if (medal.type && medal.type.typeId) {
              const typeId = medal.type.typeId;
              if (typeId === "seasonal") {
                allSeasonalMedals.push(medalData);
              } else if (typeId === "nature") {
                allNatureMedals.push(medalData);
              } else if (typeId === "starrail") {
                allBtMedals.push(medalData);
              } else if (typeId === "rank") {
                allLevelMedals.push(medalData);
              }
            }
          });
        } else {
          loadDefaultMedalData();
        }
      } catch (error) {
        loadDefaultMedalData();
      }
    };
    const loadDefaultMedalData = () => {
      allSeasonalMedals.splice(0, allSeasonalMedals.length);
      allNatureMedals.splice(0, allNatureMedals.length);
      allBtMedals.splice(0, allBtMedals.length);
      allLevelMedals.splice(0, allLevelMedals.length);
      allSeasonalMedals.push(
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
        }
      );
      allNatureMedals.push(
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
        }
      );
      allBtMedals.push(
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
        }
      );
      allLevelMedals.push(
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
        }
      );
    };
    const fetchUserProfile = async () => {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.userId) {
          return;
        }
        const userId = userInfo.userId;
        const apiUrl = `/api/user/profile?userId=${userId}`;
        const response = await utils_request.get(
          apiUrl,
          {},
          {
            showError: true,
            loading: true,
            loadingText: "加载用户信息中..."
          }
        );
        const responseData = response.data && response.data.data ? response.data.data : response.data && response.data.code === 200 ? response.data.data : null;
        if (responseData) {
          const userData = responseData;
          userAvatar.value = userData.avatar || "/static/images/avatar.png";
          userNickname.value = userData.nickname || "熊猫奶茶会员";
          userLevel.value = userData.memberLevel || 1;
          utils_userState.userState.lightningStars = userData.lightningStars || 0;
          utils_userState.userState.medals = userData.medals || [];
        }
      } catch (error) {
      }
    };
    const getUserMedals = async () => {
      try {
        await utils_userData.initUserData();
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.userId) {
          return;
        }
        const userId = userInfo.userId;
        const apiUrl = `/api/medals/user/${userId}`;
        const response = await utils_request.get(
          apiUrl,
          {},
          {
            showError: true,
            loading: true,
            loadingText: "加载用户勋章中..."
          }
        );
        const responseData = response.data && response.data.data ? response.data.data : response.data && response.data.code === 200 ? response.data.data : null;
        if (responseData) {
          seasonalMedals.splice(0, seasonalMedals.length);
          natureMedals.splice(0, natureMedals.length);
          btMedals.splice(0, btMedals.length);
          levelMedals.splice(0, levelMedals.length);
          const userMedalsData = responseData.medals || responseData || [];
          const userMedalMap = /* @__PURE__ */ new Map();
          userMedalsData.forEach((item) => {
            if (item.medal && item.medal.medalId) {
              userMedalMap.set(item.medal.medalId, {
                isActive: item.isActive,
                obtainTime: item.obtainTime,
                medal: item.medal
              });
            } else if (item.medalId) {
              userMedalMap.set(item.medalId, {
                isActive: item.isActive || true,
                obtainTime: item.obtainTime || item.claimTime || /* @__PURE__ */ new Date(),
                medal: item
              });
            }
          });
          allSeasonalMedals.forEach((medal) => {
            const clonedMedal = { ...medal };
            const userMedal = userMedalMap.get(medal.id);
            clonedMedal.isActive = userMedal ? userMedal.isActive : false;
            clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null;
            seasonalMedals.push(clonedMedal);
          });
          allNatureMedals.forEach((medal) => {
            const clonedMedal = { ...medal };
            const userMedal = userMedalMap.get(medal.id);
            clonedMedal.isActive = userMedal ? userMedal.isActive : false;
            clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null;
            natureMedals.push(clonedMedal);
          });
          allBtMedals.forEach((medal) => {
            const clonedMedal = { ...medal };
            const userMedal = userMedalMap.get(medal.id);
            clonedMedal.isActive = userMedal ? userMedal.isActive : false;
            clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null;
            btMedals.push(clonedMedal);
          });
          allLevelMedals.forEach((medal) => {
            const clonedMedal = { ...medal };
            const userMedal = userMedalMap.get(medal.id);
            clonedMedal.isActive = userMedal ? userMedal.isActive : false;
            clonedMedal.obtainTime = userMedal ? userMedal.obtainTime : null;
            levelMedals.push(clonedMedal);
          });
          if (userMedalsData.length > 0) {
            const sortedMedals = [...userMedalsData].sort((a, b) => {
              const timeA = a.obtainTime || a.claimTime ? new Date(a.obtainTime || a.claimTime).getTime() : 0;
              const timeB = b.obtainTime || b.claimTime ? new Date(b.obtainTime || b.claimTime).getTime() : 0;
              return timeB - timeA;
            });
            const lastMedal = sortedMedals[0];
            if (lastMedal) {
              const lastMedalId = lastMedal.medal ? lastMedal.medal.medalId : lastMedal.medalId || null;
              if (lastMedalId) {
                const allMedals = [
                  ...allSeasonalMedals,
                  ...allNatureMedals,
                  ...allBtMedals,
                  ...allLevelMedals
                ];
                lastAcquiredMedal.value = allMedals.find(
                  (medal) => medal.id === lastMedalId
                ) || null;
              }
            }
          }
          utils_userState.userState.medals = userMedalsData;
        } else {
          setAllMedalsInactive();
        }
      } catch (error) {
        setAllMedalsInactive();
      }
    };
    const setAllMedalsInactive = () => {
      seasonalMedals.splice(0, seasonalMedals.length);
      natureMedals.splice(0, natureMedals.length);
      btMedals.splice(0, btMedals.length);
      levelMedals.splice(0, levelMedals.length);
      seasonalMedals.push(
        ...allSeasonalMedals.map((medal) => ({ ...medal, isActive: false }))
      );
      natureMedals.push(
        ...allNatureMedals.map((medal) => ({ ...medal, isActive: false }))
      );
      btMedals.push(
        ...allBtMedals.map((medal) => ({ ...medal, isActive: false }))
      );
      levelMedals.push(
        ...allLevelMedals.map((medal) => ({ ...medal, isActive: false }))
      );
    };
    common_vendor.onMounted(async () => {
      try {
        await fetchUserProfile();
        await fetchMedalTypes();
        await fetchAllMedals();
        await getUserMedals();
      } catch (error) {
        if (medalTypes.length === 0) {
          medalTypes.splice(
            0,
            medalTypes.length,
            "二十四节气限定",
            "大自然限定微章",
            "崩铁联动限定",
            "等级徽章"
          );
        }
        if (allSeasonalMedals.length === 0 && allNatureMedals.length === 0 && allBtMedals.length === 0 && allLevelMedals.length === 0) {
          loadDefaultMedalData();
          setAllMedalsInactive();
        }
      }
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
      common_vendor.index.__f__("log", "at pages/order-medal/order-medal.vue:897", "当前选中徽章ID:", selectedItemId.value);
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
    const confirmActivate = async () => {
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
      try {
        common_vendor.index.showLoading({
          title: "点亮中..."
        });
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.userId) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "用户信息不存在",
            icon: "none"
          });
          return;
        }
        const userId = userInfo.userId;
        const medalId = selectedMedal.value.id;
        const apiUrl = `/api/medals/activate?userId=${userId}&medalId=${medalId}`;
        const response = await utils_request.post(
          apiUrl,
          {},
          // 参数放在URL中，请求体为空
          {
            showError: true
          }
        );
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/order-medal/order-medal.vue:968", "点亮勋章响应:", response);
        if (response && response.code === 200) {
          common_vendor.index.showToast({
            title: "徽章点亮成功",
            icon: "success"
          });
          if (response.data && response.data.user) {
            utils_userState.userState.lightningStars = response.data.user.lightning_stars;
          }
          await fetchUserProfile();
          await getUserMedals();
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
            const medalToUpdate = btMedals.find(
              (m) => m.id === selectedMedal.value.id
            );
            if (medalToUpdate)
              medalToUpdate.isActive = true;
          }
        } else {
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.message) || "徽章点亮失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/order-medal/order-medal.vue:1012", "点亮徽章失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      } finally {
        showActivatePopup.value = false;
        selectedMedal.value = null;
        selectedMedalType.value = "";
      }
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
        o: common_vendor.f(btMedals, (item, index, i0) => {
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
