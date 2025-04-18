"use strict";
const common_vendor = require("../../common/vendor.js");
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
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const isEdit = common_vendor.computed(() => !!props.id);
    const formData = common_vendor.ref({
      name: "",
      phone: "",
      gender: "male",
      // 默认为先生
      address: "",
      addressDetail: "",
      isDefault: false
    });
    common_vendor.onMounted(() => {
      if (isEdit.value) {
        if (props.id === "1") {
          formData.value = {
            name: "Teia",
            phone: "13012341672",
            gender: "male",
            address: "都昌县湖滨学校西",
            addressDetail: "1号楼",
            isDefault: false
          };
        } else if (props.id === "2") {
          formData.value = {
            name: "1",
            phone: "13012341672",
            gender: "male",
            address: "九江市浔阳区委(陆家坊支路东)",
            addressDetail: "1号",
            isDefault: true
          };
        }
      }
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const chooseLocation = () => {
      common_vendor.index.showToast({
        title: "选择位置功能待实现",
        icon: "none"
      });
    };
    const saveAddress = () => {
      if (!formData.value.name) {
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
          title: "请选择收货地址",
          icon: "none"
        });
      }
      common_vendor.index.showToast({
        title: "地址保存成功",
        icon: "success",
        success: () => {
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      });
    };
    const deleteAddress = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该收货地址吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "地址删除成功",
              icon: "success",
              success: () => {
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              }
            });
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
        d: formData.value.name,
        e: common_vendor.o(($event) => formData.value.name = $event.detail.value),
        f: formData.value.phone,
        g: common_vendor.o(($event) => formData.value.phone = $event.detail.value),
        h: formData.value.gender === "male" ? 1 : "",
        i: common_vendor.o(($event) => formData.value.gender = "male"),
        j: formData.value.gender === "female" ? 1 : "",
        k: common_vendor.o(($event) => formData.value.gender = "female"),
        l: formData.value.address
      }, formData.value.address ? {
        m: common_vendor.t(formData.value.address)
      } : {}, {
        n: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        o: common_vendor.o(chooseLocation),
        p: formData.value.addressDetail,
        q: common_vendor.o(($event) => formData.value.addressDetail = $event.detail.value),
        r: formData.value.isDefault,
        s: common_vendor.o(($event) => formData.value.isDefault = $event.detail.value),
        t: common_vendor.o(saveAddress),
        v: isEdit.value
      }, isEdit.value ? {
        w: common_vendor.o(deleteAddress)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/edit-address.js.map
