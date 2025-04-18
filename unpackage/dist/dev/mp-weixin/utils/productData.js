"use strict";
const utils_api_categoryApi = require("./api/categoryApi.js");
const utils_api_productApi = require("./api/productApi.js");
const utils_productService = require("./productService.js");
const fetchProductDataFromAPI = async () => {
  try {
    const categories = await utils_api_categoryApi.fetchCategories();
    const result = await Promise.all(
      categories.map(async (category) => {
        const products = await utils_api_productApi.fetchProductsByCategory(category.id);
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
    return result;
  } catch (error) {
    throw error;
  }
};
const getProductData = async () => {
  try {
    const apiData = await fetchProductDataFromAPI();
    return apiData;
  } catch (e) {
    return utils_productService.getDefaultProductData();
  }
};
const refreshProductData = async () => {
  try {
    const apiData = await fetchProductDataFromAPI();
    return apiData;
  } catch (e) {
    return utils_productService.getDefaultProductData();
  }
};
const initProductData = async () => {
  try {
    return await refreshProductData();
  } catch (e) {
    return utils_productService.getDefaultProductData();
  }
};
exports.getProductData = getProductData;
exports.initProductData = initProductData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/productData.js.map
