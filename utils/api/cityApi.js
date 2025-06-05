// 城市API服务

import { get } from "./request";
import { API_PATHS } from "./config";

/**
 * 获取所有城市数据（包括热门城市和按字母分组的城市）
 * @returns {Promise} 城市数据
 */
export const fetchAllCities = async () => {
  try {
    const response = await get(API_PATHS.CITIES);
    if (response.code === 200) {
      return {
        hotCities: response.data.hotCities || [],
        letters: response.data.letters || [],
        cityMap: response.data.cityMap || {},
      };
    } else {
      throw new Error(response.message || "获取城市数据失败");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * 获取热门城市
 * @returns {Promise} 热门城市数据
 */
export const fetchHotCities = async () => {
  try {
    const response = await get(API_PATHS.HOT_CITIES);
    if (response.code === 200) {
      return response.data || [];
    } else {
      throw new Error(response.message || "获取热门城市数据失败");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * 获取特定字母开头的城市
 * @param {String} letter 城市拼音首字母（A-Z）
 * @returns {Promise} 城市数据
 */
export const fetchCitiesByLetter = async (letter) => {
  try {
    if (!letter) {
      throw new Error("字母参数不能为空");
    }

    const response = await get(`${API_PATHS.CITIES_BY_LETTER}/${letter}`);
    if (response.code === 200) {
      return response.data || [];
    } else {
      throw new Error(response.message || `获取${letter}开头的城市数据失败`);
    }
  } catch (error) {
    throw error;
  }
};
