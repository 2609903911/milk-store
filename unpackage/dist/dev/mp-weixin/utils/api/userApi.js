"use strict";
const utils_request = require("../request.js");
const getUserProfile = (userId) => {
  return utils_request.request({
    url: `/api/user/profile-info?userId=${userId}`,
    method: "GET"
  });
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/userApi.js.map
