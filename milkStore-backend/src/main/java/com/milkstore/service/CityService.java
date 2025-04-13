package com.milkstore.service;

import com.milkstore.entity.City;

import java.util.List;
import java.util.Map;

/**
 * 城市服务接口
 */
public interface CityService {
    
    /**
     * 获取所有城市
     * @return 城市列表
     */
    List<City> findAllCities();
    
    /**
     * 获取热门城市
     * @return 热门城市列表
     */
    List<City> findHotCities();
    
    /**
     * 根据首字母获取城市
     * @param letter 首字母（大写）
     * @return 城市列表
     */
    List<City> findCitiesByLetter(String letter);
    
    /**
     * 获取所有城市和热门城市的组合数据
     * @return 包含热门城市和按字母分组的城市的Map
     */
    Map<String, Object> getCityData();
} 