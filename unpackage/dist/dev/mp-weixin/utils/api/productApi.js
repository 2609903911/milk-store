"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
const fetchProductsByCategory = async (categoryId) => {
  try {
    if (!categoryId && categoryId !== 0) {
      throw new Error("分类ID不能为空");
    }
    const response = await utils_api_request.get(`${utils_api_config.API_PATHS.PRODUCTS_BY_CATEGORY}/${categoryId}`);
    return response || [];
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/productApi.js:67", `获取分类ID=${categoryId}的产品数据失败:`, error);
    throw error;
  }
};
const searchProductsByName = async (name) => {
  try {
    if (!name) {
      throw new Error("搜索关键词不能为空");
    }
    const response = await utils_api_request.get(`${utils_api_config.API_PATHS.PRODUCTS_SEARCH}?name=${encodeURIComponent(name)}`);
    return response || [];
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/productApi.js:86", `搜索产品名称=${name}的数据失败:`, error);
    throw error;
  }
};
exports.fetchProductsByCategory = fetchProductsByCategory;
exports.searchProductsByName = searchProductsByName;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/productApi.js.map
