"use strict";
const common_vendor = require("../common/vendor.js");
const toast = (title, icon = "none", duration = 1500, mask = false) => {
  common_vendor.index.showToast({
    title,
    icon,
    duration,
    mask
  });
};
exports.toast = toast;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/uniUtils.js.map
