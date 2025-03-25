"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "personal-data",
  setup(__props) {
    const userInfo = common_vendor.ref({
      avatar: "/static/images/avatar.png",
      nickname: "醇厚的生椰西瓜",
      phone: "13012341234",
      gender: "male",
      // male或female
      birthday: ""
    });
    common_vendor.onMounted(() => {
      if (utils_userState.userState) {
        userInfo.value = {
          avatar: utils_userState.userState.avatar || "/static/images/avatar.png",
          nickname: utils_userState.userState.nickname || "醇厚的生椰西瓜",
          phone: utils_userState.userState.phone || "13012341234",
          gender: utils_userState.userState.gender || "male",
          birthday: utils_userState.userState.birthday || ""
        };
      }
    });
    const formatPhone = (phone) => {
      if (!phone)
        return "";
      return phone.substring(0, 3) + "****" + phone.substring(7);
    };
    const saveUserInfo = () => {
      utils_userState.updateUserState({
        avatar: userInfo.value.avatar,
        nickname: userInfo.value.nickname,
        phone: userInfo.value.phone,
        gender: userInfo.value.gender,
        birthday: userInfo.value.birthday
      });
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    const showDatePicker = () => {
      common_vendor.index.showToast({
        title: "日期选择功能即将上线",
        icon: "none"
      });
    };
    const bindPhone = () => {
      common_vendor.index.showToast({
        title: "更换手机号功能即将上线",
        icon: "none"
      });
    };
    const goToAddressManage = () => {
      common_vendor.index.showToast({
        title: "地址管理功能即将上线",
        icon: "none"
      });
    };
    const switchAccount = () => {
      common_vendor.index.showToast({
        title: "切换账号功能即将上线",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar,
        b: common_assets._imports_0$9,
        c: userInfo.value.nickname,
        d: common_vendor.o(($event) => userInfo.value.nickname = $event.detail.value),
        e: common_vendor.t(formatPhone(userInfo.value.phone)),
        f: common_vendor.o(bindPhone),
        g: userInfo.value.gender === "male" ? 1 : "",
        h: common_vendor.o(($event) => userInfo.value.gender = "male"),
        i: userInfo.value.gender === "female" ? 1 : "",
        j: common_vendor.o(($event) => userInfo.value.gender = "female"),
        k: common_vendor.t(userInfo.value.birthday || "未设置"),
        l: common_vendor.o(showDatePicker),
        m: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        n: common_vendor.o(goToAddressManage),
        o: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        p: common_vendor.o(switchAccount),
        q: common_vendor.o(saveUserInfo)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f356bf5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personal-data/personal-data.js.map
