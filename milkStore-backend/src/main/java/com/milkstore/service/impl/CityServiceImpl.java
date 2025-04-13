package com.milkstore.service.impl;

import com.milkstore.entity.City;
import com.milkstore.mapper.CityMapper;
import com.milkstore.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 城市服务实现类
 */
@Service
public class CityServiceImpl implements CityService {

    @Autowired
    private CityMapper cityMapper;
    
    /**
     * 获取所有城市
     * @return 城市列表
     */
    @Override
    public List<City> findAllCities() {
        return cityMapper.findAll();
    }
    
    /**
     * 获取热门城市
     * @return 热门城市列表
     */
    @Override
    public List<City> findHotCities() {
        return cityMapper.findHotCities();
    }
    
    /**
     * 根据首字母获取城市
     * @param letter 首字母（大写）
     * @return 城市列表
     */
    @Override
    public List<City> findCitiesByLetter(String letter) {
        return cityMapper.findCitiesByLetter(letter);
    }
    
    /**
     * 获取所有城市和热门城市的组合数据
     * @return 包含热门城市和按字母分组的城市的Map
     */
    @Override
    public Map<String, Object> getCityData() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取热门城市
        List<City> hotCities = findHotCities();
        result.put("hotCities", hotCities);
        
        // 获取字母列表（A-Z，不包含I,O,U,V）
        List<String> letters = Arrays.asList(
            "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", 
            "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"
        );
        
        // 按字母分组城市
        Map<String, List<City>> cityMap = new HashMap<>();
        for (String letter : letters) {
            List<City> cities = findCitiesByLetter(letter);
            if (!cities.isEmpty()) {
                cityMap.put(letter, cities);
            }
        }
        
        result.put("cityMap", cityMap);
        result.put("letters", letters);
        
        return result;
    }
} 