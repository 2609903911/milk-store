"use strict";
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
const fetchAllCities = async () => {
  try {
    const response = await utils_api_request.get(utils_api_config.API_PATHS.CITIES);
    if (response.code === 200) {
      return {
        hotCities: response.data.hotCities || [],
        letters: response.data.letters || [],
        cityMap: response.data.cityMap || {}
      };
    } else {
      throw new Error(response.message || "获取城市数据失败");
    }
  } catch (error) {
    throw error;
  }
};
exports.fetchAllCities = fetchAllCities;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/cityApi.js.map
