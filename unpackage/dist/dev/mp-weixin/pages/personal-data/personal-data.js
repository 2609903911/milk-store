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
    const isDatePickerVisible = common_vendor.ref(false);
    const today = /* @__PURE__ */ new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const selectedYear = common_vendor.ref(todayYear);
    const selectedMonth = common_vendor.ref(todayMonth);
    const selectedDay = common_vendor.ref(todayDay);
    const currentYear = todayYear;
    const years = Array.from({ length: currentYear - 1949 }, (_, i) => i + 1950);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = common_vendor.computed(() => {
      const daysInMonth = new Date(
        selectedYear.value,
        selectedMonth.value,
        0
      ).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    });
    const defaultDatePickerValue = [
      years.findIndex((y) => y === todayYear),
      todayMonth - 1,
      todayDay - 1
    ];
    const datePickerValue = common_vendor.ref(defaultDatePickerValue);
    common_vendor.onMounted(() => {
      if (utils_userState.userState) {
        userInfo.value = {
          avatar: utils_userState.userState.avatar || "/static/images/avatar.png",
          nickname: utils_userState.userState.nickname || "醇厚的生椰西瓜",
          phone: utils_userState.userState.phone || "13012341234",
          gender: utils_userState.userState.gender || "male",
          birthday: utils_userState.userState.birthday || ""
        };
        if (userInfo.value.birthday) {
          const [year, month, day] = userInfo.value.birthday.split("-").map(Number);
          selectedYear.value = year;
          selectedMonth.value = month;
          selectedDay.value = day;
          datePickerValue.value = [
            years.findIndex((y) => y === year),
            months.findIndex((m) => m === month),
            days.value.findIndex((d) => d === day)
          ];
        }
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
      if (userInfo.value.birthday) {
        const [year, month, day] = userInfo.value.birthday.split("-").map(Number);
        selectedYear.value = year;
        selectedMonth.value = month;
        selectedDay.value = day;
        datePickerValue.value = [
          years.findIndex((y) => y === year),
          months.findIndex((m) => m === month),
          days.value.findIndex((d) => d === day)
        ];
      } else {
        selectedYear.value = todayYear;
        selectedMonth.value = todayMonth;
        selectedDay.value = todayDay;
        datePickerValue.value = defaultDatePickerValue;
      }
      isDatePickerVisible.value = true;
    };
    const hideDatePicker = () => {
      isDatePickerVisible.value = false;
    };
    const onDatePickerChange = (e) => {
      const values = e.detail.value;
      selectedYear.value = years[values[0]];
      selectedMonth.value = months[values[1]];
      const daysInSelectedMonth = new Date(
        selectedYear.value,
        selectedMonth.value,
        0
      ).getDate();
      if (values[2] >= daysInSelectedMonth) {
        values[2] = daysInSelectedMonth - 1;
      }
      selectedDay.value = days.value[values[2]];
      datePickerValue.value = values;
    };
    const confirmDateSelection = () => {
      const formatMonth = selectedMonth.value.toString().padStart(2, "0");
      const formatDay = selectedDay.value.toString().padStart(2, "0");
      userInfo.value.birthday = `${selectedYear.value}-${formatMonth}-${formatDay}`;
      hideDatePicker();
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
    const chooseAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        // 默认9，设置为1表示一次只能选择一张图片
        sizeType: ["compressed"],
        // 可以指定是原图还是压缩图，默认二者都有，这里使用压缩图
        sourceType: ["album", "camera"],
        // 从相册选择或使用相机拍摄
        success: function(res) {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.navigateTo({
            url: `/pages/image-cropper/image-cropper?src=${encodeURIComponent(
              tempFilePath
            )}&type=avatar`,
            events: {
              // 接收裁剪后的图片
              cropImage: function(data) {
                if (data.path) {
                  userInfo.value.avatar = data.path;
                }
              }
            },
            fail: () => {
              userInfo.value.avatar = tempFilePath;
            }
          });
        }
      });
    };
    const handleAvatarError = () => {
      common_vendor.index.__f__("log", "at pages/personal-data/personal-data.vue:403", "头像加载失败，使用默认头像");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar || "/static/images/avatar",
        b: common_vendor.o(handleAvatarError),
        c: common_vendor.o(chooseAvatar),
        d: common_assets._imports_0$9,
        e: userInfo.value.nickname,
        f: common_vendor.o(($event) => userInfo.value.nickname = $event.detail.value),
        g: common_vendor.t(formatPhone(userInfo.value.phone)),
        h: common_vendor.o(bindPhone),
        i: userInfo.value.gender === "male" ? 1 : "",
        j: common_vendor.o(($event) => userInfo.value.gender = "male"),
        k: userInfo.value.gender === "female" ? 1 : "",
        l: common_vendor.o(($event) => userInfo.value.gender = "female"),
        m: common_vendor.t(userInfo.value.birthday || "未设置"),
        n: common_vendor.o(showDatePicker),
        o: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        p: common_vendor.o(goToAddressManage),
        q: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        r: common_vendor.o(switchAccount),
        s: common_vendor.o(saveUserInfo),
        t: isDatePickerVisible.value
      }, isDatePickerVisible.value ? {
        v: common_vendor.o(hideDatePicker),
        w: common_vendor.o(confirmDateSelection),
        x: common_vendor.f(common_vendor.unref(years), (year, index, i0) => {
          return {
            a: common_vendor.t(year),
            b: "year-" + index
          };
        }),
        y: common_vendor.f(common_vendor.unref(months), (month, index, i0) => {
          return {
            a: common_vendor.t(month),
            b: "month-" + index
          };
        }),
        z: common_vendor.f(days.value, (day, index, i0) => {
          return {
            a: common_vendor.t(day),
            b: "day-" + index
          };
        }),
        A: datePickerValue.value,
        B: common_vendor.o(onDatePickerChange),
        C: common_vendor.o(() => {
        }),
        D: common_vendor.o(hideDatePicker)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f356bf5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personal-data/personal-data.js.map
