"use strict";
const common_vendor = require("../common/vendor.js");
const defaultProductData = [
  {
    name: "招牌奶茶",
    products: [
      {
        image: "/static/images/hot01.png",
        name: "杨梅吐气",
        desc: "杨梅与气泡水的完美融合",
        price: 12
      },
      {
        image: "/static/images/hot02.png",
        name: "手作米麻薯",
        desc: "手工制作的米麻薯，口感Q弹",
        price: 10
      },
      {
        image: "/static/images/hot03.png",
        name: "满杯芭乐",
        desc: "新鲜芭乐与气泡水的完美结合",
        price: 15
      },
      {
        image: "/static/images/hot04.png",
        name: "抹茶奶绿",
        desc: "抹茶与奶绿的清新搭配",
        price: 10
      },
      {
        image: "/static/images/hot05.png",
        name: "喜凤梨",
        desc: "凤梨与气泡水的甜蜜组合",
        price: 12
      }
    ]
  },
  {
    name: "真鲜奶茶",
    products: [
      {
        image: "/static/images/new01.png",
        name: "经典奶茶",
        desc: "选用进口奶源，醇香浓郁",
        price: 15
      },
      {
        image: "/static/images/new02.png",
        name: "红豆奶茶",
        desc: "香甜红豆与奶茶的经典搭配",
        price: 18
      },
      {
        image: "/static/images/new03.png",
        name: "布丁奶茶",
        desc: "Q弹布丁与香浓奶茶的融合",
        price: 20
      },
      {
        image: "/static/images/new04.png",
        name: "珍珠奶茶",
        desc: "嚼劲十足的珍珠与奶茶的完美融合",
        price: 16
      },
      {
        image: "/static/images/new05.png",
        name: "芋圆奶茶",
        desc: "Q弹芋圆与丝滑奶茶的组合",
        price: 14
      }
    ]
  },
  {
    name: "新品种草",
    products: [
      {
        image: "/static/images/classic01.png",
        name: "芝芝莓莓",
        desc: "草莓与芝士的梦幻搭配",
        price: 22
      },
      {
        image: "/static/images/classic02.png",
        name: "多肉葡萄",
        desc: "多肉与葡萄的创新组合",
        price: 20
      },
      {
        image: "/static/images/classic03.png",
        name: "芒果雪冰",
        desc: "新鲜芒果加上细腻雪冰",
        price: 18
      },
      {
        image: "/static/images/classic04.png",
        name: "椰云拿铁",
        desc: "丝滑拿铁与椰云的结合",
        price: 16
      },
      {
        image: "/static/images/classic05.png",
        name: "桃桃乌龙",
        desc: "乌龙茶与水蜜桃的清新口味",
        price: 19
      }
    ]
  },
  {
    name: "清爽鲜果茶",
    products: [
      {
        image: "/static/images/fruit01.png",
        name: "满杯百香",
        desc: "新鲜百香果，酸甜可口",
        price: 16
      },
      {
        image: "/static/images/fruit02.png",
        name: "柠檬绿茶",
        desc: "清新柠檬与绿茶的搭配",
        price: 14
      },
      {
        image: "/static/images/fruit03.png",
        name: "蜜桃乌龙",
        desc: "香甜蜜桃与乌龙茶的结合",
        price: 18
      },
      {
        image: "/static/images/fruit04.png",
        name: "金桔柠檬",
        desc: "酸甜可口的金桔柠檬",
        price: 15
      },
      {
        image: "/static/images/fruit05.png",
        name: "青提乌龙",
        desc: "清爽青提与醇香乌龙茶",
        price: 17
      }
    ]
  }
];
const STORAGE_KEY = "milk_tea_products";
const saveProductData = (data) => {
  try {
    common_vendor.index.setStorageSync(STORAGE_KEY, JSON.stringify(data));
    common_vendor.index.__f__("log", "at utils/productData.js:152", "产品数据保存成功");
    return true;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:155", "保存产品数据失败：", e);
    return false;
  }
};
const getProductData = () => {
  try {
    const storageData = common_vendor.index.getStorageSync(STORAGE_KEY);
    if (storageData) {
      return JSON.parse(storageData);
    } else {
      saveProductData(defaultProductData);
      return defaultProductData;
    }
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:172", "获取产品数据失败：", e);
    return defaultProductData;
  }
};
const searchProducts = (keyword) => {
  try {
    if (!keyword)
      return [];
    const allProducts = getProductData();
    const results = [];
    allProducts.forEach((category) => {
      const matchedProducts = category.products.filter(
        (product) => product.name.includes(keyword) || product.desc.includes(keyword)
      );
      if (matchedProducts.length > 0) {
        matchedProducts.forEach((product) => {
          results.push({
            ...product,
            category: category.name
          });
        });
      }
    });
    return results;
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/productData.js:319", "搜索产品失败：", e);
    return [];
  }
};
const initProductData = () => {
  const existingData = common_vendor.index.getStorageSync(STORAGE_KEY);
  if (!existingData) {
    saveProductData(defaultProductData);
  }
  return true;
};
exports.getProductData = getProductData;
exports.initProductData = initProductData;
exports.searchProducts = searchProducts;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/productData.js.map
