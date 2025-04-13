"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_categoryApi = require("./api/categoryApi.js");
const utils_api_productApi = require("./api/productApi.js");
const utils_productService = require("./productService.js");
const STORAGE_KEY = "milk_tea_products";
const STORAGE_TIMESTAMP_KEY = "milk_tea_products_timestamp";
const STORAGE_VERSION_KEY = "milk_tea_products_version";
const DATA_CACHE_TIME = 60 * 60 * 1e3;
const CURRENT_DATA_VERSION = "1.0";
const fetchProductDataFromAPI = async () => {
  var _a;
  try {
    const categories = await utils_api_categoryApi.fetchCategories();
    common_vendor.index.__f__("log", "at utils/productData.js:18", "获取到的分类信息:", categories);
    const result = await Promise.all(
      categories.map(async (category) => {
        const products = await utils_api_productApi.fetchProductsByCategory(category.id);
        common_vendor.index.__f__("log", "at utils/productData.js:25", `分类${category.name}的产品:`, products);
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
    common_vendor.index.__f__("log", "at utils/productData.js:50", "转换后的产品数据结构:", JSON.stringify(((_a = result[0]) == null ? void 0 : _a.products[0]) || {}));
    return result;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/productData.js:54", "从API获取产品数据失败:", error);
    throw error;
  }
};
const saveProductData = (data) => {
  try {
    common_vendor.index.setStorageSync(STORAGE_KEY, JSON.stringify(data));
    common_vendor.index.setStorageSync(STORAGE_TIMESTAMP_KEY, Date.now());
    common_vendor.index.setStorageSync(STORAGE_VERSION_KEY, CURRENT_DATA_VERSION);
    common_vendor.index.__f__("log", "at utils/productData.js:66", "产品数据保存成功");
    return true;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:69", "保存产品数据失败：", e);
    return false;
  }
};
const getProductDataFromStorage = () => {
  try {
    const storageData = common_vendor.index.getStorageSync(STORAGE_KEY);
    const timestamp = common_vendor.index.getStorageSync(STORAGE_TIMESTAMP_KEY) || 0;
    const version = common_vendor.index.getStorageSync(STORAGE_VERSION_KEY) || "";
    const now = Date.now();
    if (storageData && now - timestamp < DATA_CACHE_TIME && version === CURRENT_DATA_VERSION) {
      return JSON.parse(storageData);
    }
    if (version !== CURRENT_DATA_VERSION) {
      common_vendor.index.__f__("log", "at utils/productData.js:91", `数据版本不匹配(本地:${version}, 当前:${CURRENT_DATA_VERSION})，清除旧数据`);
      clearProductDataCache();
    }
    return null;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:97", "从本地存储获取产品数据失败：", e);
    return null;
  }
};
const clearProductDataCache = () => {
  try {
    common_vendor.index.removeStorageSync(STORAGE_KEY);
    common_vendor.index.removeStorageSync(STORAGE_TIMESTAMP_KEY);
    common_vendor.index.removeStorageSync(STORAGE_VERSION_KEY);
    common_vendor.index.__f__("log", "at utils/productData.js:108", "产品数据缓存已清除");
    return true;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:111", "清除产品数据缓存失败：", e);
    return false;
  }
};
const getProductData = async () => {
  try {
    const cachedData = getProductDataFromStorage();
    if (cachedData) {
      common_vendor.index.__f__("log", "at utils/productData.js:164", "从本地存储获取产品数据成功");
      return cachedData;
    }
    common_vendor.index.__f__("log", "at utils/productData.js:169", "开始从API获取产品数据...");
    const apiData = await fetchProductDataFromAPI();
    saveProductData(apiData);
    common_vendor.index.__f__("log", "at utils/productData.js:174", "从API获取产品数据成功并保存到本地");
    return apiData;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:178", "获取产品数据失败，使用默认数据：", e);
    return utils_productService.getDefaultProductData();
  }
};
const refreshProductData = async () => {
  try {
    const apiData = await fetchProductDataFromAPI();
    saveProductData(apiData);
    common_vendor.index.__f__("log", "at utils/productData.js:197", "产品数据刷新成功");
    return apiData;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:201", "刷新产品数据失败：", e);
    const localData = getProductDataFromStorage();
    return localData || utils_productService.getDefaultProductData();
  }
};
const initProductData = async () => {
  try {
    const timestamp = common_vendor.index.getStorageSync(STORAGE_TIMESTAMP_KEY) || 0;
    const now = Date.now();
    if (now - timestamp >= DATA_CACHE_TIME || !common_vendor.index.getStorageSync(STORAGE_KEY)) {
      common_vendor.index.__f__("log", "at utils/productData.js:527", "产品数据需要刷新");
      return await refreshProductData();
    } else {
      common_vendor.index.__f__("log", "at utils/productData.js:530", "使用本地缓存的产品数据");
      return getProductDataFromStorage();
    }
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:534", "初始化产品数据失败：", e);
    return utils_productService.getDefaultProductData();
  }
};
exports.getProductData = getProductData;
exports.initProductData = initProductData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/productData.js.map
