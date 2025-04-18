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
  __name: "address",
  setup(__props) {
    const addressList = common_vendor.ref([
      {
        id: "1",
        address: "都昌县湖滨学校西1",
        name: "Teia(先生)",
        phone: "130****1672",
        isDefault: false
      },
      {
        id: "2",
        address: "九江市浔阳区委(陆家坊支路东)1",
        name: "1(先生)",
        phone: "130****1672",
        isDefault: true
      }
    ]);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const editAddress = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/address/edit-address?id=${item.id}`
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
        c: common_vendor.p({
          type: "location-filled",
          size: "24",
          color: "#0066FF"
        }),
        d: common_vendor.f(addressList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.address),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.phone),
            d: "06cd66b5-2-" + i0,
            e: common_vendor.o(($event) => editAddress(item), index),
            f: index
          };
        }),
        e: common_vendor.p({
          type: "compose",
          size: "20"
        }),
        f: addressList.value.length === 0
      }, addressList.value.length === 0 ? {
        g: common_assets._imports_0$12
      } : {}, {
        h: common_vendor.o(addAddress)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/address.js.map
