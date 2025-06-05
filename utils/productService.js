/**
 * 产品服务
 * 提供产品相关的功能
 */

// 产品数据服务
import { productApi, categoryApi } from "./api";

/**
 * 获取产品数据（包含分类和对应产品）
 * @returns {Promise<Array>} 包含分类和产品的数组
 */
export const getProductData = async () => {
  try {
    // 1. 获取所有分类
    const categories = await categoryApi.fetchCategories();

    // 2. 对每个分类获取对应的产品
    const result = await Promise.all(
      categories.map(async (category) => {
        // 获取该分类下的产品
        const products = await productApi.fetchProductsByCategory(category.id);

        // 转换为前端需要的格式
        return {
          name: category.name,
          products: products.map((product) => ({
            id: product.id,
            image: product.imageUrl || `/static/images/default-product.png`,
            name: product.name,
            desc: product.description,
            price: product.price,
          })),
        };
      })
    );

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取单个分类下的产品
 * @param {Number} categoryId 分类ID
 * @returns {Promise<Object>} 包含分类和产品的对象
 */
export const getCategoryProducts = async (categoryId) => {
  try {
    // 1. 获取分类信息
    const category = await categoryApi.fetchCategoryById(categoryId);
    if (!category) {
      throw new Error("分类不存在");
    }

    // 2. 获取该分类下的产品
    const products = await productApi.fetchProductsByCategory(categoryId);

    // 3. 转换为前端需要的格式
    return {
      name: category.name,
      products: products.map((product) => ({
        id: product.id,
        image: product.imageUrl || `/static/images/default-product.png`,
        name: product.name,
        desc: product.description,
        price: product.price,
      })),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 获取默认的本地产品数据（当API请求失败时使用）
 * @returns {Array} 默认产品数据（最小化版本）
 */
export const getDefaultProductData = () => {
  // 返回一个最小的默认数据，仅用于在网络故障时显示基本界面
  return [
    {
      name: "奶茶",
      products: [
        {
          image: "/static/images/default-product.png",
          name: "默认奶茶产品",
          desc: "暂无产品数据，请检查网络连接",
          price: 0,
        },
      ],
    },
    {
      name: "果茶",
      products: [
        {
          image: "/static/images/default-product.png",
          name: "默认果茶产品",
          desc: "暂无产品数据，请检查网络连接",
          price: 0,
        },
      ],
    },
  ];
};
