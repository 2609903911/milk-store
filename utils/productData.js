// 产品数据管理
import { fetchCategories, fetchCategoryById } from './api/categoryApi';
import { fetchProductsByCategory } from './api/productApi';
import { getDefaultProductData } from './productService';

// 存储键名
const STORAGE_KEY = 'milk_tea_products';
const STORAGE_TIMESTAMP_KEY = 'milk_tea_products_timestamp';
const STORAGE_VERSION_KEY = 'milk_tea_products_version';
const DATA_CACHE_TIME = 60 * 60 * 1000; // 缓存有效期，默认1小时
const CURRENT_DATA_VERSION = '1.0'; // 数据结构版本号，当修改数据结构时更新此值

// 从API获取产品和分类数据
const fetchProductDataFromAPI = async () => {
    try {
        // 1. 获取所有分类
        const categories = await fetchCategories();
        console.log('获取到的分类信息:', categories);
        
        // 2. 对每个分类获取对应的产品
        const result = await Promise.all(
            categories.map(async (category) => {
                // 获取该分类下的产品
                const products = await fetchProductsByCategory(category.id);
                console.log(`分类${category.name}的产品:`, products);
                
                // 转换为前端需要的格式，确保字段映射正确
                return {
                    name: category.name,
                    products: products.map(product => {
                        // 统一字段名称，确保兼容性
                        return {
                            id: product.id,
                            image: product.imageUrl || `/static/images/default-product.png`,
                            imageUrl: product.imageUrl || `/static/images/default-product.png`, // 同时保留两个字段
                            name: product.name || '',
                            desc: product.description || '', // 确保desc和description都有值
                            description: product.description || '',
                            price: product.price || 0,
                            category: category.name,
                            // 保留其他可能的原始字段
                            ...product
                        };
                    })
                };
            })
        );
        
        // 打印转换后的产品数据结构用于调试
        console.log('转换后的产品数据结构:', JSON.stringify(result[0]?.products[0] || {}));
        
        return result;
    } catch (error) {
        console.error('从API获取产品数据失败:', error);
        throw error;
    }
}

// 保存产品数据到本地存储
export const saveProductData = (data) => {
    try {
        // 保存数据、时间戳和版本号
        uni.setStorageSync(STORAGE_KEY, JSON.stringify(data));
        uni.setStorageSync(STORAGE_TIMESTAMP_KEY, Date.now());
        uni.setStorageSync(STORAGE_VERSION_KEY, CURRENT_DATA_VERSION);
        console.log('产品数据保存成功');
        return true;
    } catch (e) {
        console.error('保存产品数据失败：', e);
        return false;
    }
}

// 从本地存储获取产品数据
const getProductDataFromStorage = () => {
    try {
        const storageData = uni.getStorageSync(STORAGE_KEY);
        const timestamp = uni.getStorageSync(STORAGE_TIMESTAMP_KEY) || 0;
        const version = uni.getStorageSync(STORAGE_VERSION_KEY) || '';
        const now = Date.now();
        
        // 检查数据是否存在、未过期且版本匹配
        if (storageData && 
            (now - timestamp < DATA_CACHE_TIME) && 
            version === CURRENT_DATA_VERSION) {
            return JSON.parse(storageData);
        }
        
        // 如果版本不匹配，清除旧数据
        if (version !== CURRENT_DATA_VERSION) {
            console.log(`数据版本不匹配(本地:${version}, 当前:${CURRENT_DATA_VERSION})，清除旧数据`);
            clearProductDataCache();
        }
        
        return null;
    } catch (e) {
        console.error('从本地存储获取产品数据失败：', e);
        return null;
    }
}

// 清除产品数据缓存
export const clearProductDataCache = () => {
    try {
        uni.removeStorageSync(STORAGE_KEY);
        uni.removeStorageSync(STORAGE_TIMESTAMP_KEY);
        uni.removeStorageSync(STORAGE_VERSION_KEY);
        console.log('产品数据缓存已清除');
        return true;
    } catch (e) {
        console.error('清除产品数据缓存失败：', e);
        return false;
    }
}

// 获取产品数据缓存信息
export const getProductDataCacheInfo = () => {
    try {
        const timestamp = uni.getStorageSync(STORAGE_TIMESTAMP_KEY) || 0;
        const version = uni.getStorageSync(STORAGE_VERSION_KEY) || '';
        const now = Date.now();
        
        // 如果缓存存在
        if (timestamp > 0) {
            const cacheAge = now - timestamp;
            const expiresIn = Math.max(0, DATA_CACHE_TIME - cacheAge);
            const isExpired = cacheAge >= DATA_CACHE_TIME;
            const isOutdated = version !== CURRENT_DATA_VERSION;
            
            return {
                exists: true,
                timestamp,
                formattedTime: new Date(timestamp).toLocaleString(),
                age: cacheAge,
                expiresIn,
                isExpired,
                version,
                isOutdated,
                currentVersion: CURRENT_DATA_VERSION
            };
        }
        
        // 无缓存
        return {
            exists: false,
            currentVersion: CURRENT_DATA_VERSION
        };
    } catch (e) {
        console.error('获取产品数据缓存信息失败：', e);
        return {
            exists: false,
            error: e.message,
            currentVersion: CURRENT_DATA_VERSION
        };
    }
}

// 获取产品数据 - 先尝试从API获取，如果失败则从本地存储获取，如果还是没有则使用默认数据
export const getProductData = async () => {
    try {
        // 先尝试从缓存获取
        const cachedData = getProductDataFromStorage();
        if (cachedData) {
            console.log('从本地存储获取产品数据成功');
            return cachedData;
        }
        
        // 缓存不存在或已过期，从API获取
        console.log('开始从API获取产品数据...');
        const apiData = await fetchProductDataFromAPI();
        
        // 保存到本地存储
        saveProductData(apiData);
        console.log('从API获取产品数据成功并保存到本地');
        
        return apiData;
    } catch (e) {
        console.error('获取产品数据失败，使用默认数据：', e);
        // 如果API和本地存储都失败，返回默认数据
        return getDefaultProductData();
    }
}

// 重置产品数据为默认数据
export const resetProductData = () => {
    return saveProductData(getDefaultProductData());
}

// 刷新产品数据（强制从API获取）
export const refreshProductData = async () => {
    try {
        // 从API获取
        const apiData = await fetchProductDataFromAPI();
        
        // 保存到本地存储
        saveProductData(apiData);
        console.log('产品数据刷新成功');
        
        return apiData;
    } catch (e) {
        console.error('刷新产品数据失败：', e);
        // 如果API获取失败，尝试从本地获取
        const localData = getProductDataFromStorage();
        return localData || getDefaultProductData();
    }
}

// 更新特定产品信息
export const updateProduct = async (categoryIndex, productIndex, updatedProduct) => {
    try {
        const allProducts = await getProductData();
        
        // 确保索引有效
        if (categoryIndex >= 0 && 
            categoryIndex < allProducts.length && 
            productIndex >= 0 && 
            productIndex < allProducts[categoryIndex].products.length) {
            
            // 更新产品
            allProducts[categoryIndex].products[productIndex] = {
                ...allProducts[categoryIndex].products[productIndex],
                ...updatedProduct
            };
            
            // 保存更新后的数据
            return saveProductData(allProducts);
        }
        return false;
    } catch (e) {
        console.error('更新产品失败：', e);
        return false;
    }
}

// 添加新产品到指定分类
export const addProduct = async (categoryIndex, newProduct) => {
    try {
        const allProducts = await getProductData();
        
        // 确保分类索引有效
        if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
            // 添加新产品
            allProducts[categoryIndex].products.push(newProduct);
            
            // 保存更新后的数据
            return saveProductData(allProducts);
        }
        return false;
    } catch (e) {
        console.error('添加产品失败：', e);
        return false;
    }
}

// 删除产品
export const deleteProduct = async (categoryIndex, productIndex) => {
    try {
        const allProducts = await getProductData();
        
        // 确保索引有效
        if (categoryIndex >= 0 && 
            categoryIndex < allProducts.length && 
            productIndex >= 0 && 
            productIndex < allProducts[categoryIndex].products.length) {
            
            // 删除产品
            allProducts[categoryIndex].products.splice(productIndex, 1);
            
            // 保存更新后的数据
            return saveProductData(allProducts);
        }
        return false;
    } catch (e) {
        console.error('删除产品失败：', e);
        return false;
    }
}

// 添加新分类
export const addCategory = async (newCategory) => {
    try {
        const allProducts = await getProductData();
        
        // 添加新分类
        allProducts.push({
            name: newCategory.name,
            products: newCategory.products || []
        });
        
        // 保存更新后的数据
        return saveProductData(allProducts);
    } catch (e) {
        console.error('添加分类失败：', e);
        return false;
    }
}

// 删除分类
export const deleteCategory = async (categoryIndex) => {
    try {
        const allProducts = await getProductData();
        
        // 确保索引有效
        if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
            // 删除分类
            allProducts.splice(categoryIndex, 1);
            
            // 保存更新后的数据
            return saveProductData(allProducts);
        }
        return false;
    } catch (e) {
        console.error('删除分类失败：', e);
        return false;
    }
}

// 搜索产品
export const searchProducts = async (keyword) => {
    try {
        if (!keyword) return [];
        
        const allProducts = await getProductData();
        const result = [];
        
        // 转换关键词为小写以进行不区分大小写的搜索
        const lowerKeyword = keyword.toLowerCase();
        
        // 遍历所有分类和产品
        allProducts.forEach(category => {
            category.products.forEach(product => {
                // 检查产品名称或描述是否包含关键词
                const nameMatch = product.name && product.name.toLowerCase().includes(lowerKeyword);
                
                // 检查description字段(后端API)或desc字段(本地数据)
                const descMatch = 
                    (product.description && product.description.toLowerCase().includes(lowerKeyword)) || 
                    (product.desc && product.desc.toLowerCase().includes(lowerKeyword));
                
                if (nameMatch || descMatch) {
                    result.push({
                        ...product,
                        category: category.name
                    });
                }
            });
        });
        
        // 打印匹配的结果和关键词用于调试
        console.log(`搜索"${keyword}"找到${result.length}个结果:`);
        result.forEach((item, index) => {
            console.log(`结果${index + 1}: ${item.name}, 描述: ${item.description || item.desc || '无'}`);
        });
        
        return result;
    } catch (e) {
        console.error('搜索产品失败：', e);
        return [];
    }
}

// 高级搜索产品
export const advancedSearchProducts = async (options = {}) => {
    try {
        const {
            keyword = '',
            minPrice = 0,
            maxPrice = Infinity,
            categoryNames = [],
            sortBy = 'price', // 'price', 'name'
            sortOrder = 'asc', // 'asc', 'desc'
            limit = 0 // 限制返回结果数量，0表示不限制
        } = options;
        
        // 获取所有产品数据
        const allProducts = await getProductData();
        let result = [];
        
        // 转换关键词为小写以进行不区分大小写的搜索
        const lowerKeyword = keyword.toLowerCase();
        
        // 遍历所有分类和产品
        allProducts.forEach(category => {
            // 检查是否需要按分类筛选
            if (categoryNames.length > 0 && !categoryNames.includes(category.name)) {
                return; // 跳过不在指定分类中的产品
            }
            
            category.products.forEach(product => {
                // 关键词过滤 - 检查产品名称或描述是否包含关键词
                const matchesKeyword = !keyword || 
                    product.name.toLowerCase().includes(lowerKeyword) ||
                    product.desc.toLowerCase().includes(lowerKeyword);
                
                // 价格范围过滤
                const matchesPrice = 
                    product.price >= minPrice && 
                    product.price <= maxPrice;
                
                // 如果满足所有筛选条件，添加到结果中
                if (matchesKeyword && matchesPrice) {
                    result.push({
                        ...product,
                        category: category.name
                    });
                }
            });
        });
        
        // 根据指定字段排序
        result.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'price') {
                return sortOrder === 'asc' 
                    ? a.price - b.price
                    : b.price - a.price;
            }
            return 0;
        });
        
        // 限制结果数量
        if (limit > 0 && result.length > limit) {
            result = result.slice(0, limit);
        }
        
        return result;
    } catch (e) {
        console.error('高级搜索产品失败：', e);
        return [];
    }
}

// 获取热门产品（根据固定规则或推荐算法）
export const getHotProducts = async (limit = 6) => {
    try {
        // 在真实应用中，这里可能会调用专门的API获取热门产品
        // 这里使用简单的模拟实现，取价格较高的前几个产品作为"热门"
        const allProducts = await getProductData();
        const hotProducts = [];
        
        // 收集所有产品
        allProducts.forEach(category => {
            category.products.forEach(product => {
                hotProducts.push({
                    ...product,
                    category: category.name
                });
            });
        });
        
        // 按价格降序排序并限制数量
        return hotProducts
            .sort((a, b) => b.price - a.price)
            .slice(0, limit);
    } catch (e) {
        console.error('获取热门产品失败：', e);
        return [];
    }
}

// 获取推荐产品（基于分类）
export const getRecommendedProducts = async (categoryName, limit = 4) => {
    try {
        const allProducts = await getProductData();
        const recommendedProducts = [];
        
        // 查找指定分类
        const targetCategory = allProducts.find(category => 
            category.name === categoryName
        );
        
        if (targetCategory && targetCategory.products.length > 0) {
            // 从目标分类中随机选择几个产品
            const shuffled = [...targetCategory.products].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(limit, shuffled.length));
            
            selected.forEach(product => {
                recommendedProducts.push({
                    ...product,
                    category: categoryName
                });
            });
        }
        
        // 如果推荐产品不足，从其他分类中补充
        if (recommendedProducts.length < limit) {
            const neededProducts = limit - recommendedProducts.length;
            const otherProducts = [];
            
            allProducts.forEach(category => {
                if (category.name !== categoryName) {
                    category.products.forEach(product => {
                        otherProducts.push({
                            ...product,
                            category: category.name
                        });
                    });
                }
            });
            
            // 随机打乱并选择所需数量的产品
            const shuffled = otherProducts.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(neededProducts, shuffled.length));
            
            recommendedProducts.push(...selected);
        }
        
        return recommendedProducts;
    } catch (e) {
        console.error('获取推荐产品失败：', e);
        return [];
    }
}

// 初始化产品数据 - 用于应用启动时
export const initProductData = async () => {
    try {
        // 检查是否需要刷新数据
        const timestamp = uni.getStorageSync(STORAGE_TIMESTAMP_KEY) || 0;
        const now = Date.now();
        
        // 如果数据过期或不存在，则从API获取
        if (now - timestamp >= DATA_CACHE_TIME || !uni.getStorageSync(STORAGE_KEY)) {
            console.log('产品数据需要刷新');
            return await refreshProductData();
        } else {
            console.log('使用本地缓存的产品数据');
            return getProductDataFromStorage();
        }
    } catch (e) {
        console.error('初始化产品数据失败：', e);
        return getDefaultProductData();
    }
}

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
      throw new Error('分类不存在');
    }
    
    // 2. 获取该分类下的产品
    const products = await fetchProductsByCategory(categoryId);
    
    // 3. 转换为前端需要的格式
    return {
      name: category.name,
      products: products.map(product => ({
        id: product.id,
        image: product.imageUrl || `/static/images/default-product.png`,
        name: product.name,
        desc: product.description,
        price: product.price
      }))
    };
  } catch (error) {
    console.error(`获取分类${categoryId}的产品失败:`, error);
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
            keyword = '',
            categoryName = '',
            minPrice = 0,
            maxPrice = Infinity,
            sortBy = 'price',
            sortOrder = 'asc'
        } = options;
        
        // 获取所有满足筛选条件的产品
        const filterOptions = {
            keyword,
            minPrice,
            maxPrice,
            categoryNames: categoryName ? [categoryName] : [],
            sortBy,
            sortOrder
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
                hasPreviousPage: page > 1
            }
        };
    } catch (e) {
        console.error('分页获取产品失败：', e);
        return {
            data: [],
            pagination: {
                total: 0,
                page: options.page || 1,
                pageSize: options.pageSize || 10,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            },
            error: e.message
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
        return allProducts.map(category => {
            const productCount = category.products.length;
            
            // 计算价格范围
            let minPrice = Infinity;
            let maxPrice = 0;
            let totalPrice = 0;
            
            category.products.forEach(product => {
                minPrice = Math.min(minPrice, product.price);
                maxPrice = Math.max(maxPrice, product.price);
                totalPrice += product.price;
            });
            
            // 计算平均价格
            const avgPrice = productCount > 0 ? 
                (totalPrice / productCount).toFixed(2) : 0;
            
            return {
                name: category.name,
                productCount,
                priceRange: {
                    min: productCount > 0 ? minPrice : 0,
                    max: maxPrice,
                    avg: avgPrice
                }
            };
        });
    } catch (e) {
        console.error('获取分类统计数据失败：', e);
        return [];
    }
};

// 默认导出
export default {
    getProductData,
    saveProductData,
    resetProductData,
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
    clearProductDataCache,
    getProductDataCacheInfo,
    getProductsWithPagination,
    getCategoriesStats
} 