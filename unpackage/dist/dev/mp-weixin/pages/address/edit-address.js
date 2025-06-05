"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_request = require("../../utils/api/request.js");
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
  __name: "edit-address",
  props: {
    id: {
      type: String,
      // 始终用字符串处理ID
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const isEdit = common_vendor.computed(() => !!props.id);
    const addressId = common_vendor.computed(() => props.id || "");
    const isLoading = common_vendor.ref(false);
    const formData = common_vendor.ref({
      contactName: "",
      phone: "",
      gender: "male",
      address: "",
      isDefault: false
    });
    common_vendor.onUnmounted(() => {
      if (isLoading.value) {
        common_vendor.index.hideLoading();
        isLoading.value = false;
      }
    });
    common_vendor.onBackPress(() => {
      if (isLoading.value) {
        common_vendor.index.hideLoading();
        isLoading.value = false;
      }
    });
    const safeShowLoading = (title) => {
      if (!isLoading.value) {
        common_vendor.index.showLoading({
          title: title || "加载中..."
        });
        isLoading.value = true;
      }
    };
    const safeHideLoading = () => {
      if (isLoading.value) {
        common_vendor.index.hideLoading();
        isLoading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      if (isEdit.value) {
        const eventChannel = getOpenerEventChannel();
        if (eventChannel && eventChannel.on) {
          eventChannel.on("addressData", function(data) {
            if (data) {
              formData.value = {
                contactName: data.contactName || "",
                phone: data.phone || "",
                gender: data.gender || "male",
                address: data.address || "",
                isDefault: !!data.isDefault
              };
            } else {
              fetchAddressDetail();
            }
          });
        } else {
          fetchAddressDetail();
        }
      }
    });
    function getOpenerEventChannel() {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const eventChannel = currentPage.getOpenerEventChannel();
      return eventChannel;
    }
    const fetchAddressDetail = async () => {
      try {
        safeShowLoading("加载中...");
        if (!addressId.value) {
          safeHideLoading();
          return common_vendor.index.showToast({
            title: "地址ID不能为空",
            icon: "none"
          });
        }
        const result = await utils_api_request.get(`/api/user/address/${addressId.value}`, {
          userId: utils_userState.userState.userId
        });
        if (result.code === 200 && result.data) {
          formData.value = {
            contactName: result.data.contactName,
            phone: result.data.phone,
            gender: result.data.gender || "male",
            address: result.data.address || "",
            isDefault: result.data.isDefault
          };
        } else {
          common_vendor.index.showToast({
            title: "获取地址详情失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取地址详情失败，请重试",
          icon: "none"
        });
      } finally {
        safeHideLoading();
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const saveAddress = async () => {
      if (!formData.value.contactName) {
        return common_vendor.index.showToast({
          title: "请输入联系人姓名",
          icon: "none"
        });
      }
      if (!formData.value.phone) {
        return common_vendor.index.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
      }
      if (!/^1\d{10}$/.test(formData.value.phone)) {
        return common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
      }
      if (!formData.value.address) {
        return common_vendor.index.showToast({
          title: "请输入收货地址",
          icon: "none"
        });
      }
      try {
        safeShowLoading("保存中...");
        const submitData = {
          userId: utils_userState.userState.userId,
          contactName: formData.value.contactName,
          phone: formData.value.phone,
          gender: formData.value.gender,
          address: formData.value.address,
          isDefault: formData.value.isDefault
        };
        let result;
        if (isEdit.value) {
          result = await utils_api_request.put(`/api/user/address/${addressId.value}`, submitData);
        } else {
          result = await utils_api_request.post("/api/user/address", submitData);
        }
        safeHideLoading();
        if (result.code === 200) {
          common_vendor.index.showToast({
            title: isEdit.value ? "地址更新成功" : "地址添加成功",
            icon: "success",
            success: () => {
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            }
          });
        } else {
          common_vendor.index.showToast({
            title: result.message || "保存失败",
            icon: "none"
          });
        }
      } catch (error) {
        safeHideLoading();
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
    };
    const deleteAddress = async () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该收货地址吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              safeShowLoading("删除中...");
              const result = await utils_api_request.request({
                url: `/api/user/address/${addressId.value}?userId=${utils_userState.userState.userId}`,
                method: "DELETE"
              });
              safeHideLoading();
              if (result.code === 200) {
                common_vendor.index.showToast({
                  title: "地址删除成功",
                  icon: "success",
                  success: () => {
                    setTimeout(() => {
                      common_vendor.index.navigateBack();
                    }, 1500);
                  }
                });
              } else {
                common_vendor.index.showToast({
                  title: result.message || "删除失败",
                  icon: "none"
                });
              }
            } catch (error) {
              safeHideLoading();
              common_vendor.index.showToast({
                title: "删除失败，请重试",
                icon: "none"
              });
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "20"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.t(isEdit.value ? "编辑地址" : "新增地址"),
        d: formData.value.contactName,
        e: common_vendor.o(($event) => formData.value.contactName = $event.detail.value),
        f: formData.value.phone,
        g: common_vendor.o(($event) => formData.value.phone = $event.detail.value),
        h: formData.value.gender === "male" ? 1 : "",
        i: common_vendor.o(($event) => formData.value.gender = "male"),
        j: formData.value.gender === "female" ? 1 : "",
        k: common_vendor.o(($event) => formData.value.gender = "female"),
        l: formData.value.address,
        m: common_vendor.o(($event) => formData.value.address = $event.detail.value),
        n: formData.value.isDefault,
        o: common_vendor.o(($event) => formData.value.isDefault = $event.detail.value),
        p: common_vendor.o(saveAddress),
        q: isEdit.value
      }, isEdit.value ? {
        r: common_vendor.o(deleteAddress)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/edit-address.js.map
