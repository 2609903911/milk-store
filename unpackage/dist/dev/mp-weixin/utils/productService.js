"use strict";
require("../common/vendor.js");
require("./userState.js");
const utils_api_productApi = require("./api/productApi.js");
const utils_api_categoryApi = require("./api/categoryApi.js");
const getProductData = async () => {
  try {
    const categories = await utils_api_categoryApi.fetchCategories();
    const result = await Promise.all(
      categories.map(async (category) => {
        const products = await utils_api_productApi.fetchProductsByCategory(category.id);
        return {
          name: category.name,
          products: products.map((product) => ({
            id: product.id,
            image: product.imageUrl || `/static/images/default-product.png`,
            name: product.name,
            desc: product.description,
            price: product.price
          }))
        };
      })
    );
    return result;
  } catch (error) {
    throw error;
  }
};
const getDefaultProductData = () => {
  return [
    {
      name: "奶茶",
      products: [
        {
          image: "/static/images/default-product.png",
          name: "默认奶茶产品",
          desc: "暂无产品数据，请检查网络连接",
          price: 0
        }
      ]
    },
    {
      name: "果茶",
      products: [
        {
          image: "/static/images/default-product.png",
          name: "默认果茶产品",
          desc: "暂无产品数据，请检查网络连接",
          price: 0
        }
      ]
    }
  ];
};
exports.getDefaultProductData = getDefaultProductData;
exports.getProductData = getProductData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/productService.js.map
