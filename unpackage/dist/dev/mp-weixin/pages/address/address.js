"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
  __name: "address",
  setup(__props) {
    const addressList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const defaultAddress = common_vendor.ref("");
    common_vendor.onLoad(() => {
      fetchAddresses();
    });
    common_vendor.onShow(() => {
      fetchAddresses();
    });
    const fetchAddresses = async () => {
      if (!utils_userState.userState.userId) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      loading.value = true;
      try {
        const result = await utils_api_request.get(`/api/user/addresses`, {
          userId: utils_userState.userState.userId
        });
        common_vendor.index.__f__("log", "at pages/address/address.vue:120", "获取到的地址数据:", result);
        if (result.code === 200 && result.data) {
          const formattedData = result.data.map((item) => {
            return {
              ...item,
              formattedPhone: formatPhone(item.phone)
            };
          });
          common_vendor.index.__f__("log", "at pages/address/address.vue:131", "格式化后的地址数据:", formattedData);
          addressList.value = formattedData;
          const defaultAddr = result.data.find((item) => item.isDefault);
          if (defaultAddr) {
            defaultAddress.value = defaultAddr.address;
          }
        } else {
          common_vendor.index.showToast({
            title: "获取地址失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/address/address.vue:147", "获取地址列表失败:", error);
        common_vendor.index.showToast({
          title: "获取地址失败，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const formatPhone = (phone) => {
      if (!phone)
        return "";
      if (phone.length !== 11) {
        return phone;
      }
      return phone.substring(0, 3) + "****" + phone.substring(7);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const editAddress = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/address/edit-address?id=${item.id}`,
        events: {
          // 为目标页面定义事件，目标页面可以通过 eventChannel 触发
          addressData: function(data) {
          }
        },
        success: function(res) {
          res.eventChannel.emit("addressData", {
            id: item.id,
            contactName: item.contactName,
            phone: item.phone,
            gender: item.gender || "male",
            address: item.address,
            isDefault: item.isDefault ? true : false
          });
        }
      });
    };
    const addAddress = () => {
      common_vendor.index.navigateTo({
        url: "/pages/address/edit-address"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "20"
        }),
        b: common_vendor.o(goBack),
        c: defaultAddress.value
      }, defaultAddress.value ? {
        d: common_vendor.p({
          type: "location-filled",
          size: "24",
          color: "#0066FF"
        }),
        e: common_vendor.t(defaultAddress.value)
      } : {}, {
        f: loading.value
      }, loading.value ? {
        g: common_vendor.p({
          type: "spinner-cycle",
          size: "30",
          color: "#999"
        })
      } : addressList.value.length > 0 ? {
        i: common_vendor.f(addressList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.address),
            b: common_vendor.t(item.contactName),
            c: common_vendor.t(item.gender === "male" ? "(先生)" : item.gender === "female" ? "(女士)" : ""),
            d: common_vendor.t(item.formattedPhone),
            e: "06cd66b5-3-" + i0,
            f: common_vendor.o(($event) => editAddress(item), index),
            g: index
          };
        }),
        j: common_vendor.p({
          type: "compose",
          size: "20"
        })
      } : !loading.value ? {
        l: common_assets._imports_0$12
      } : {}, {
        h: addressList.value.length > 0,
        k: !loading.value,
        m: common_vendor.o(addAddress)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/address.js.map
