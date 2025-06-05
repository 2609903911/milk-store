// 产品分类API服务

import { get } from "./request";
import { API_PATHS } from "./config";

/**
 * 获取所有产品分类
 * @returns {Promise} 分类数据
 */
export const fetchCategories = async () => {
  try {
    const response = await get(API_PATHS.CATEGORIES);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 根据ID获取产品分类
 * @param {Number} id 分类ID
 * @returns {Promise} 分类数据
 */
export const fetchCategoryById = async (id) => {
  try {
    if (!id && id !== 0) {
      throw new Error("分类ID不能为空");
    }

    const response = await get(`${API_PATHS.CATEGORY_BY_ID}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
