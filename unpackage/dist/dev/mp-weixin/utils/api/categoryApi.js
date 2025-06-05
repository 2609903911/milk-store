"use strict";
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
const fetchCategories = async () => {
  try {
    const response = await utils_api_request.get(utils_api_config.API_PATHS.CATEGORIES);
    return response || [];
  } catch (error) {
    throw error;
  }
};
exports.fetchCategories = fetchCategories;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/categoryApi.js.map
