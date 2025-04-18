"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const utils_api_config = require("../../utils/api/config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + PhoneUpdate)();
}
const PhoneUpdate = () => "../components/phone-update.js";
const _sfc_main = {
  __name: "personal-data",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const userInfo = common_vendor.ref({
      userId: "",
      avatar: "/static/images/avatar.png",
      nickname: "",
      phone: "",
      gender: "male",
      birthday: "",
      memberLevel: 1,
      pandaCoins: 0,
      lightningStars: 0
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
    const isPhoneUpdateVisible = common_vendor.ref(false);
    const fetchUserProfile = async () => {
      loading.value = true;
      try {
        const userInfoStorage = common_vendor.index.getStorageSync("userInfo");
        if (!userInfoStorage || !userInfoStorage.userId) {
          common_vendor.index.showToast({
            title: "用户未登录",
            icon: "none"
          });
          loading.value = false;
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
          return;
        }
        const userId = userInfoStorage.userId;
        const response = await utils_request.get(
          `${utils_api_config.API_PATHS.USER_PROFILE}?userId=${userId}`,
          {},
          {
            showError: true
          }
        );
        const responseData = response.data && response.data.data ? response.data.data : response.data && response.data.code === 200 ? response.data.data : null;
        if (responseData) {
          let formattedBirthday = "";
          if (responseData.birthday) {
            const birthdayDate = new Date(responseData.birthday);
            const year = birthdayDate.getFullYear();
            const month = String(birthdayDate.getMonth() + 1).padStart(
              2,
              "0"
            );
            const day = String(birthdayDate.getDate()).padStart(2, "0");
            formattedBirthday = `${year}-${month}-${day}`;
          }
          userInfo.value = {
            userId: responseData.userId,
            avatar: responseData.avatar || "/static/images/avatar.png",
            nickname: responseData.nickname || "",
            phone: responseData.phone || "",
            gender: responseData.gender || "male",
            birthday: formattedBirthday,
            memberLevel: responseData.memberLevel || 1,
            pandaCoins: responseData.pandaCoins || 0,
            lightningStars: responseData.lightningStars || 0
          };
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      fetchUserProfile();
    });
    const formatPhone = (phone) => {
      if (!phone)
        return "";
      if (phone.length < 11)
        return phone;
      return phone.substring(0, 3) + "****" + phone.substring(7);
    };
    const updateUserProfile = async () => {
      try {
        loading.value = true;
        const updateData = {
          userId: userInfo.value.userId,
          nickname: userInfo.value.nickname,
          gender: userInfo.value.gender,
          birthday: userInfo.value.birthday,
          // 已格式化为YYYY-MM-DD
          avatar: userInfo.value.avatar
        };
        const response = await utils_request.post(utils_api_config.API_PATHS.USER_UPDATE, updateData, {
          showError: true
        });
        if (response && (response.code === 200 || response.data && response.data.code === 200)) {
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "保存失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const saveUserInfo = () => {
      updateUserProfile();
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
      isPhoneUpdateVisible.value = true;
    };
    const handlePhoneUpdateSuccess = (newPhone) => {
      userInfo.value.phone = newPhone;
      common_vendor.index.showToast({
        title: "手机号更新成功",
        icon: "success"
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
          common_vendor.index.showLoading({
            title: "上传头像中..."
          });
          const fullUploadUrl = utils_api_config.getFullUrl(utils_api_config.API_PATHS.USER_AVATAR_UPLOAD);
          common_vendor.index.__f__("log", "at pages/personal-data/personal-data.vue:521", "上传URL:", fullUploadUrl);
          common_vendor.index.uploadFile({
            url: fullUploadUrl,
            // 使用完整URL
            filePath: tempFilePath,
            name: "avatarFile",
            formData: {
              userId: userInfo.value.userId
            },
            success: (uploadRes) => {
              var _a;
              try {
                common_vendor.index.__f__("log", "at pages/personal-data/personal-data.vue:533", "上传结果:", uploadRes.data);
                const result = JSON.parse(uploadRes.data);
                if (result.code === 200 && ((_a = result.data) == null ? void 0 : _a.avatarUrl)) {
                  let serverAvatarUrl = result.data.avatarUrl;
                  common_vendor.index.__f__("log", "at pages/personal-data/personal-data.vue:538", "服务器返回的头像URL:", serverAvatarUrl);
                  if (serverAvatarUrl.startsWith("/")) {
                    serverAvatarUrl = utils_api_config.getFullUrl(serverAvatarUrl);
                  }
                  userInfo.value.avatar = serverAvatarUrl;
                  const userData = common_vendor.index.getStorageSync("userInfo");
                  if (userData) {
                    userData.avatar = serverAvatarUrl;
                    common_vendor.index.setStorageSync("userInfo", userData);
                  }
                  common_vendor.index.showToast({
                    title: "头像更新成功",
                    icon: "success"
                  });
                } else {
                  common_vendor.index.showToast({
                    title: result.message || "头像保存失败",
                    icon: "none"
                  });
                }
              } catch (e) {
                common_vendor.index.__f__("error", "at pages/personal-data/personal-data.vue:567", "解析上传结果失败:", e, uploadRes.data);
                common_vendor.index.showToast({
                  title: "服务器返回数据格式错误",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/personal-data/personal-data.vue:575", "上传失败:", err);
              common_vendor.index.showToast({
                title: "上传失败，请稍后再试",
                icon: "none"
              });
            },
            complete: () => {
              common_vendor.index.hideLoading();
            }
          });
        }
      });
    };
    const handleAvatarError = () => {
      common_vendor.index.__f__("error", "at pages/personal-data/personal-data.vue:591", "头像加载失败:", userInfo.value.avatar);
      userInfo.value.avatar = "/static/images/avatar.png";
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : {
        b: userInfo.value.avatar.startsWith("http") ? userInfo.value.avatar : common_vendor.unref(utils_api_config.getFullUrl)(userInfo.value.avatar) || "/static/images/avatar.png",
        c: common_vendor.o(handleAvatarError),
        d: common_vendor.o(chooseAvatar),
        e: common_assets._imports_0$9,
        f: userInfo.value.nickname,
        g: common_vendor.o(($event) => userInfo.value.nickname = $event.detail.value),
        h: common_vendor.t(formatPhone(userInfo.value.phone)),
        i: common_vendor.o(bindPhone),
        j: userInfo.value.gender === "male" ? 1 : "",
        k: common_vendor.o(($event) => userInfo.value.gender = "male"),
        l: userInfo.value.gender === "female" ? 1 : "",
        m: common_vendor.o(($event) => userInfo.value.gender = "female"),
        n: common_vendor.t(userInfo.value.birthday || "未设置"),
        o: common_vendor.o(showDatePicker),
        p: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        q: common_vendor.o(goToAddressManage),
        r: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ccc"
        }),
        s: common_vendor.o(switchAccount)
      }, {
        t: !loading.value
      }, !loading.value ? {
        v: common_vendor.o(saveUserInfo)
      } : {}, {
        w: isDatePickerVisible.value
      }, isDatePickerVisible.value ? {
        x: common_vendor.o(hideDatePicker),
        y: common_vendor.o(confirmDateSelection),
        z: common_vendor.f(common_vendor.unref(years), (year, index, i0) => {
          return {
            a: common_vendor.t(year),
            b: "year-" + index
          };
        }),
        A: common_vendor.f(common_vendor.unref(months), (month, index, i0) => {
          return {
            a: common_vendor.t(month),
            b: "month-" + index
          };
        }),
        B: common_vendor.f(days.value, (day, index, i0) => {
          return {
            a: common_vendor.t(day),
            b: "day-" + index
          };
        }),
        C: datePickerValue.value,
        D: common_vendor.o(onDatePickerChange),
        E: common_vendor.o(() => {
        }),
        F: common_vendor.o(hideDatePicker)
      } : {}, {
        G: common_vendor.o(($event) => isPhoneUpdateVisible.value = $event),
        H: common_vendor.o(handlePhoneUpdateSuccess),
        I: common_vendor.p({
          visible: isPhoneUpdateVisible.value,
          currentPhone: userInfo.value.phone
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f356bf5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personal-data/personal-data.js.map
