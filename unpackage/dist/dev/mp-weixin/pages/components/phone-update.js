"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_api_config = require("../../utils/api/config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "phone-update",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentPhone: {
      type: String,
      default: ""
    }
  },
  emits: ["update:visible", "success", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const isPhoneValid = common_vendor.ref(false);
    const isCounting = common_vendor.ref(false);
    const countdown = common_vendor.ref(60);
    const codeButtonText = common_vendor.ref("获取验证码");
    common_vendor.watch(
      () => props.currentPhone,
      (newValue) => {
        if (newValue && newValue.length >= 11) {
          phone.value = "";
        }
      },
      { immediate: true }
    );
    const isFormValid = common_vendor.computed(() => {
      return isPhoneValid.value && code.value.length === 6;
    });
    const validatePhone = () => {
      phone.value = phone.value.replace(/\D/g, "");
      if (phone.value.length > 11) {
        phone.value = phone.value.slice(0, 11);
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      isPhoneValid.value = phoneReg.test(phone.value);
    };
    const handleCodeInput = () => {
      code.value = code.value.replace(/\D/g, "");
      if (code.value.length > 6) {
        code.value = code.value.slice(0, 6);
      }
    };
    const getVerificationCode = async () => {
      if (!isPhoneValid.value || isCounting.value) {
        return;
      }
      try {
        const url = `${utils_api_config.API_PATHS.AUTH_SEND_CODE}?phone=${encodeURIComponent(
          phone.value
        )}&type=update_phone`;
        const response = await utils_request.get(
          url,
          {},
          {
            loading: true,
            loadingText: "发送中..."
          }
        );
        if (response && (response.code === 200 || response.data && response.data.code === 200)) {
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
          startCountdown();
        } else {
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.message) || "发送失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
      }
    };
    const startCountdown = () => {
      isCounting.value = true;
      countdown.value = 60;
      codeButtonText.value = `${countdown.value}秒后重发`;
      const timer = setInterval(() => {
        countdown.value--;
        codeButtonText.value = `${countdown.value}秒后重发`;
        if (countdown.value <= 0) {
          clearInterval(timer);
          isCounting.value = false;
          codeButtonText.value = "获取验证码";
        }
      }, 1e3);
    };
    const submitForm = async () => {
      if (!isFormValid.value) {
        return;
      }
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.userId) {
          common_vendor.index.showToast({
            title: "用户未登录",
            icon: "none"
          });
          return;
        }
        const response = await utils_request.post(
          utils_api_config.API_PATHS.USER_UPDATE_PHONE,
          {
            userId: userInfo.userId,
            phone: phone.value,
            code: code.value
          },
          {
            loading: true,
            loadingText: "提交中..."
          }
        );
        common_vendor.index.__f__("log", "at pages/components/phone-update.vue:248", response);
        if (response && (response.code === 200 || response.data && response.data.code === 200)) {
          common_vendor.index.showToast({
            title: "手机号修改成功",
            icon: "success"
          });
          emit("success", phone.value);
          closePopup();
        } else {
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.data.message) || "修改失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        });
      }
    };
    const cancel = () => {
      emit("cancel");
      closePopup();
    };
    const closePopup = () => {
      emit("update:visible", false);
      phone.value = "";
      code.value = "";
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.visible
      }, __props.visible ? {
        b: common_vendor.o(cancel),
        c: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        d: common_vendor.o(cancel),
        e: common_vendor.o([($event) => phone.value = $event.detail.value, validatePhone]),
        f: phone.value,
        g: common_vendor.o([($event) => code.value = $event.detail.value, handleCodeInput]),
        h: code.value,
        i: common_vendor.t(codeButtonText.value),
        j: !isPhoneValid.value || isCounting.value ? 1 : "",
        k: common_vendor.o(getVerificationCode),
        l: !isFormValid.value ? 1 : "",
        m: common_vendor.o(submitForm),
        n: common_vendor.o(() => {
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96016176"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/phone-update.js.map
