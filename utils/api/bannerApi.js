// 轮播图API服务

import { get } from './request';
import { API_PATHS } from './config';

/**
 * 获取所有轮播图数据
 * @returns {Promise} 轮播图数据
 */
export const fetchBanners = async () => {
  try {
    const response = await get(API_PATHS.BANNERS);
    if (response.code === 200) {
      // 转换后端数据格式为前端所需格式
      return response.data.map((item) => {
        return {
          tag: item.tag,
          title: [item.title1, item.title2],
          desc: [item.desc1, item.desc2],
          image: item.imageUrl,
          bgColor: item.bgColor
        };
      });
    } else {
      throw new Error(response.message || '获取轮播图数据失败');
    }
  } catch (error) {
    console.error('获取轮播图数据失败:', error);
    throw error;
  }
}; 