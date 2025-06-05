// 产品数据管理
import { fetchCategories, fetchCategoryById } from "./api/categoryApi";
import { fetchProductsByCategory } from "./api/productApi";
import { getDefaultProductData } from "./productService";

// 从API获取产品和分类数据
const fetchProductDataFromAPI = async () => {
  try {
    // 1. 获取所有分类
    const categories = await fetchCategories();

    // 2. 对每个分类获取对应的产品
    const result = await Promise.all(
      categories.map(async (category) => {
        // 获取该分类下的产品
        const products = await fetchProductsByCategory(category.id);

        // 转换为前端需要的格式，确保字段映射正确
        return {
          name: category.name,
          products: products.map((product) => {
            // 统一字段名称，确保兼容性
            return {
              id: product.id,
              image: product.imageUrl || `/static/images/default-product.png`,
              imageUrl:
                product.imageUrl || `/static/images/default-product.png`, // 同时保留两个字段
              name: product.name || "",
              desc: product.description || "", // 确保desc和description都有值
              description: product.description || "",
              price: product.price || 0,
              category: category.name,
              // 保留其他可能的原始字段
              ...product,
            };
          }),
        };
      })
    );

    return result;
  } catch (error) {
    throw error;
  }
};

// 获取产品数据 - 直接从API获取，如果失败则使用默认数据
export const getProductData = async () => {
  try {
    // 直接从API获取
    const apiData = await fetchProductDataFromAPI();
    return apiData;
  } catch (e) {
    // 如果API失败，返回默认数据
    return getDefaultProductData();
  }
};

// 刷新产品数据（从API获取）
export const refreshProductData = async () => {
  try {
    // 从API获取
    const apiData = await fetchProductDataFromAPI();
    return apiData;
  } catch (e) {
    // 如果API获取失败，返回默认数据
    return getDefaultProductData();
  }
};

// 更新特定产品信息
export const updateProduct = async (
  categoryIndex,
  productIndex,
  updatedProduct
) => {
  try {
    const allProducts = await getProductData();

    // 确保索引有效
    if (
      categoryIndex >= 0 &&
      categoryIndex < allProducts.length &&
      productIndex >= 0 &&
      productIndex < allProducts[categoryIndex].products.length
    ) {
      // 更新产品
      allProducts[categoryIndex].products[productIndex] = {
        ...allProducts[categoryIndex].products[productIndex],
        ...updatedProduct,
      };

      // 这里可以添加API调用来同步更新到后端

      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// 添加新产品到指定分类
export const addProduct = async (categoryIndex, newProduct) => {
  try {
    const allProducts = await getProductData();

    // 确保分类索引有效
    if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
      // 添加新产品
      allProducts[categoryIndex].products.push(newProduct);

      // 这里可以添加API调用来同步更新到后端

      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// 删除产品
export const deleteProduct = async (categoryIndex, productIndex) => {
  try {
    const allProducts = await getProductData();

    // 确保索引有效
    if (
      categoryIndex >= 0 &&
      categoryIndex < allProducts.length &&
      productIndex >= 0 &&
      productIndex < allProducts[categoryIndex].products.length
    ) {
      // 删除产品
      allProducts[categoryIndex].products.splice(productIndex, 1);

      // 这里可以添加API调用来同步更新到后端

      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// 添加新分类
export const addCategory = async (newCategory) => {
  try {
    const allProducts = await getProductData();

    // 添加新分类
    allProducts.push({
      name: newCategory.name,
      products: newCategory.products || [],
    });

    // 这里可以添加API调用来同步更新到后端

    return true;
  } catch (e) {
    return false;
  }
};

// 删除分类
export const deleteCategory = async (categoryIndex) => {
  try {
    const allProducts = await getProductData();

    // 确保索引有效
    if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
      // 删除分类
      allProducts.splice(categoryIndex, 1);

      // 这里可以添加API调用来同步更新到后端

      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// 搜索产品
export const searchProducts = async (keyword) => {
  try {
    if (!keyword) return [];

    const allProducts = await getProductData();
    const result = [];

    // 转换关键词为小写以进行不区分大小写的搜索
    const lowerKeyword = keyword.toLowerCase();

    // 遍历所有分类和产品
    allProducts.forEach((category) => {
      category.products.forEach((product) => {
        // 检查产品名称或描述是否包含关键词
        const nameMatch =
          product.name && product.name.toLowerCase().includes(lowerKeyword);

        // 检查description字段(后端API)或desc字段(本地数据)
        const descMatch =
          (product.description &&
            product.description.toLowerCase().includes(lowerKeyword)) ||
          (product.desc && product.desc.toLowerCase().includes(lowerKeyword));

        if (nameMatch || descMatch) {
          result.push({
            ...product,
            category: category.name,
          });
        }
      });
    });

    return result;
  } catch (e) {
    return [];
  }
};

// 高级搜索产品
export const advancedSearchProducts = async (options = {}) => {
  try {
    const {
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      categoryNames = [],
      sortBy = "price", // 'price', 'name'
      sortOrder = "asc", // 'asc', 'desc'
      limit = 0, // 限制返回结果数量，0表示不限制
    } = options;

    // 获取所有产品数据
    const allProducts = await getProductData();
    let result = [];

    // 转换关键词为小写以进行不区分大小写的搜索
    const lowerKeyword = keyword.toLowerCase();

    // 遍历所有分类和产品
    allProducts.forEach((category) => {
      // 检查是否需要按分类筛选
      if (categoryNames.length > 0 && !categoryNames.includes(category.name)) {
        return; // 跳过不在指定分类中的产品
      }

      category.products.forEach((product) => {
        // 关键词过滤 - 检查产品名称或描述是否包含关键词
        const matchesKeyword =
          !keyword ||
          product.name.toLowerCase().includes(lowerKeyword) ||
          product.desc.toLowerCase().includes(lowerKeyword);

        // 价格范围过滤
        const matchesPrice =
          product.price >= minPrice && product.price <= maxPrice;

        // 如果满足所有筛选条件，添加到结果中
        if (matchesKeyword && matchesPrice) {
          result.push({
            ...product,
            category: category.name,
          });
        }
      });
    });

    // 根据指定字段排序
    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    // 限制结果数量
    if (limit > 0 && result.length > limit) {
      result = result.slice(0, limit);
    }

    return result;
  } catch (e) {
    return [];
  }
};

// 获取热门产品（根据固定规则或推荐算法）
export const getHotProducts = async (limit = 6) => {
  try {
    // 在真实应用中，这里可能会调用专门的API获取热门产品
    // 这里使用简单的模拟实现，取价格较高的前几个产品作为"热门"
    const allProducts = await getProductData();
    const hotProducts = [];

    // 收集所有产品
    allProducts.forEach((category) => {
      category.products.forEach((product) => {
        hotProducts.push({
          ...product,
          category: category.name,
        });
      });
    });

    // 按价格降序排序并限制数量
    return hotProducts.sort((a, b) => b.price - a.price).slice(0, limit);
  } catch (e) {
    return [];
  }
};

// 获取推荐产品（基于分类）
export const getRecommendedProducts = async (categoryName, limit = 4) => {
  try {
    const allProducts = await getProductData();
    const recommendedProducts = [];

    // 查找指定分类
    const targetCategory = allProducts.find(
      (category) => category.name === categoryName
    );

    if (targetCategory && targetCategory.products.length > 0) {
      // 从目标分类中随机选择几个产品
      const shuffled = [...targetCategory.products].sort(
        () => 0.5 - Math.random()
      );
      const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

      selected.forEach((product) => {
        recommendedProducts.push({
          ...product,
          category: categoryName,
        });
      });
    }

    // 如果推荐产品不足，从其他分类中补充
    if (recommendedProducts.length < limit) {
      const neededProducts = limit - recommendedProducts.length;
      const otherProducts = [];

      allProducts.forEach((category) => {
        if (category.name !== categoryName) {
          category.products.forEach((product) => {
            otherProducts.push({
              ...product,
              category: category.name,
            });
          });
        }
      });

      // 随机打乱并选择所需数量的产品
      const shuffled = otherProducts.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(
        0,
        Math.min(neededProducts, shuffled.length)
      );

      recommendedProducts.push(...selected);
    }

    return recommendedProducts;
  } catch (e) {
    return [];
  }
};

// 初始化产品数据 - 用于应用启动时
export const initProductData = async () => {
  try {
    return await refreshProductData();
  } catch (e) {
    return getDefaultProductData();
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
    const category = await fetchCategoryById(categoryId);
    if (!category) {
      throw new Error("分类不存在");
    }

    // 2. 获取该分类下的产品
    const products = await fetchProductsByCategory(categoryId);

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
 * 分页获取产品
 * @param {Object} options 分页选项
 * @returns {Promise<Object>} 分页结果
 */
export const getProductsWithPagination = async (options = {}) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      categoryName = "",
      minPrice = 0,
      maxPrice = Infinity,
      sortBy = "price",
      sortOrder = "asc",
    } = options;

    // 获取所有满足筛选条件的产品
    const filterOptions = {
      keyword,
      minPrice,
      maxPrice,
      categoryNames: categoryName ? [categoryName] : [],
      sortBy,
      sortOrder,
    };

    // 使用高级搜索获取所有符合条件的产品
    const allFilteredProducts = await advancedSearchProducts(filterOptions);

    // 计算总数和总页数
    const total = allFilteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);

    // 计算当前页的数据
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const currentPageData = allFilteredProducts.slice(startIndex, endIndex);

    return {
      data: currentPageData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (e) {
    return {
      data: [],
      pagination: {
        total: 0,
        page: options.page || 1,
        pageSize: options.pageSize || 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      error: e.message,
    };
  }
};

/**
 * 获取各分类产品数量
 * @returns {Promise<Array>} 分类统计数据
 */
export const getCategoriesStats = async () => {
  try {
    const allProducts = await getProductData();

    // 计算每个分类的产品数量和最大/最小价格
    return allProducts.map((category) => {
      const productCount = category.products.length;

      // 计算价格范围
      let minPrice = Infinity;
      let maxPrice = 0;
      let totalPrice = 0;

      category.products.forEach((product) => {
        minPrice = Math.min(minPrice, product.price);
        maxPrice = Math.max(maxPrice, product.price);
        totalPrice += product.price;
      });

      // 计算平均价格
      const avgPrice =
        productCount > 0 ? (totalPrice / productCount).toFixed(2) : 0;

      return {
        name: category.name,
        productCount,
        priceRange: {
          min: productCount > 0 ? minPrice : 0,
          max: maxPrice,
          avg: avgPrice,
        },
      };
    });
  } catch (e) {
    return [];
  }
};

// 默认导出
export default {
  getProductData,
  updateProduct,
  addProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  searchProducts,
  advancedSearchProducts,
  getHotProducts,
  getRecommendedProducts,
  initProductData,
  getProductsWithPagination,
  getCategoriesStats,
};
