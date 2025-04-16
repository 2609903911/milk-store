"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_categoryApi = require("./api/categoryApi.js");
const utils_api_productApi = require("./api/productApi.js");
const utils_productService = require("./productService.js");
const fetchProductDataFromAPI = async () => {
  var _a;
  try {
    const categories = await utils_api_categoryApi.fetchCategories();
    common_vendor.index.__f__("log", "at utils/productData.js:11", "获取到的分类信息:", categories);
    const result = await Promise.all(
      categories.map(async (category) => {
        const products = await utils_api_productApi.fetchProductsByCategory(category.id);
        common_vendor.index.__f__("log", "at utils/productData.js:18", `分类${category.name}的产品:`, products);
        return {
          name: category.name,
          products: products.map((product) => {
            return {
              id: product.id,
              image: product.imageUrl || `/static/images/default-product.png`,
              imageUrl: product.imageUrl || `/static/images/default-product.png`,
              // 同时保留两个字段
              name: product.name || "",
              desc: product.description || "",
              // 确保desc和description都有值
              description: product.description || "",
              price: product.price || 0,
              category: category.name,
              // 保留其他可能的原始字段
              ...product
            };
          })
        };
      })
    );
    common_vendor.index.__f__("log", "at utils/productData.js:43", "转换后的产品数据结构:", JSON.stringify(((_a = result[0]) == null ? void 0 : _a.products[0]) || {}));
    return result;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/productData.js:47", "从API获取产品数据失败:", error);
    throw error;
  }
};
const getProductData = async () => {
  try {
    common_vendor.index.__f__("log", "at utils/productData.js:56", "开始从API获取产品数据...");
    const apiData = await fetchProductDataFromAPI();
    common_vendor.index.__f__("log", "at utils/productData.js:58", "从API获取产品数据成功");
    return apiData;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:61", "获取产品数据失败，使用默认数据：", e);
    return utils_productService.getDefaultProductData();
  }
};
const refreshProductData = async () => {
  try {
    const apiData = await fetchProductDataFromAPI();
    common_vendor.index.__f__("log", "at utils/productData.js:72", "产品数据刷新成功");
    return apiData;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:75", "刷新产品数据失败：", e);
    return utils_productService.getDefaultProductData();
  }
};
const initProductData = async () => {
  try {
    common_vendor.index.__f__("log", "at utils/productData.js:399", "初始化产品数据...");
    return await refreshProductData();
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:402", "初始化产品数据失败：", e);
    return utils_productService.getDefaultProductData();
  }
};
exports.getProductData = getProductData;
exports.initProductData = initProductData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/productData.js.map
