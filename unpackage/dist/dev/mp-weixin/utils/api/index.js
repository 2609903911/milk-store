"use strict";
const utils_api_orderApi = require("./orderApi.js");
const utils_api_followApi = require("./followApi.js");
const utils_api_postApi = require("./postApi.js");
require("../../common/vendor.js");
const api = {
  order: utils_api_orderApi.orderApi,
  follow: utils_api_followApi.followApi,
  post: utils_api_postApi.postApi
};
exports.api = api;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/index.js.map
