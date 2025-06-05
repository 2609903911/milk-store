"use strict";
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
const fetchBanners = async () => {
  try {
    const response = await utils_api_request.get(utils_api_config.API_PATHS.BANNERS);
    if (response.code === 200) {
      return response.data.map((item) => {
        return {
          tag: item.tag,
          title: [item.title1, item.title2],
          desc: [item.desc1, item.desc2],
          image: item.imageUrl,
          bgColor: item.bgColor
        };
      });
    } else {
      throw new Error(response.message || "获取轮播图数据失败");
    }
  } catch (error) {
    throw error;
  }
};
exports.fetchBanners = fetchBanners;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/bannerApi.js.map
