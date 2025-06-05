// 产品API服务

import { get } from "./request";
import { API_PATHS } from "./config";

/**
 * 获取所有激活状态的产品
 * @returns {Promise} 产品数据
 */
export const fetchProducts = async () => {
  try {
    const response = await get(API_PATHS.PRODUCTS);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 获取所有产品（包括非活跃产品，需要管理员权限）
 * @returns {Promise} 产品数据
 */
export const fetchAllProducts = async () => {
  try {
    const response = await get(API_PATHS.PRODUCTS_ALL);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 根据ID获取产品
 * @param {Number} id 产品ID
 * @returns {Promise} 产品数据
 */
export const fetchProductById = async (id) => {
  try {
    if (!id && id !== 0) {
      throw new Error("产品ID不能为空");
    }

    const response = await get(`${API_PATHS.PRODUCTS_BY_ID}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 根据分类ID获取产品
 * @param {Number} categoryId 分类ID
 * @returns {Promise} 产品数据
 */
export const fetchProductsByCategory = async (categoryId) => {
  try {
    if (!categoryId && categoryId !== 0) {
      throw new Error("分类ID不能为空");
    }

    const response = await get(
      `${API_PATHS.PRODUCTS_BY_CATEGORY}/${categoryId}`
    );
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 根据名称搜索产品
 * @param {String} name 产品名称关键词
 * @returns {Promise} 产品数据
 */
export const searchProductsByName = async (name) => {
  try {
    if (!name) {
      throw new Error("搜索关键词不能为空");
    }

    const response = await get(
      `${API_PATHS.PRODUCTS_SEARCH}?name=${encodeURIComponent(name)}`
    );
    return response || [];
  } catch (error) {
    throw error;
  }
};
