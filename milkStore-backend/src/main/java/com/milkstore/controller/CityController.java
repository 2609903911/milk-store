package com.milkstore.controller;

import com.milkstore.entity.City;
import com.milkstore.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 城市前端控制器
 */
@RestController
@RequestMapping("/api/cities")
public class CityController {

    @Autowired
    private CityService cityService;
    
    /**
     * 获取所有城市数据（包括热门城市和按字母分组的城市）
     * @return 城市数据Map
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCityData() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> cityData = cityService.getCityData();
            
            response.put("code", 200);
            response.put("message", "获取城市数据成功");
            response.put("data", cityData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取城市数据失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取热门城市
     * @return 热门城市列表
     */
    @GetMapping("/hot")
    public ResponseEntity<Map<String, Object>> getHotCities() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<City> hotCities = cityService.findHotCities();
            
            response.put("code", 200);
            response.put("message", "获取热门城市成功");
            response.put("data", hotCities);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取热门城市失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 根据首字母获取城市
     * @param letter 首字母（大写）
     * @return 城市列表
     */
    @GetMapping("/letter/{letter}")
    public ResponseEntity<Map<String, Object>> getCitiesByLetter(@PathVariable String letter) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<City> cities = cityService.findCitiesByLetter(letter.toUpperCase());
            
            response.put("code", 200);
            response.put("message", "获取" + letter.toUpperCase() + "开头的城市成功");
            response.put("data", cities);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取城市数据失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 