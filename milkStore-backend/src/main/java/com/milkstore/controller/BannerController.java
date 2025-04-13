package com.milkstore.controller;

import com.milkstore.entity.Banner;
import com.milkstore.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * 轮播图产品前端控制器
 */
@RestController
@RequestMapping("/api/banners")
public class BannerController {

    @Autowired
    private BannerService bannerService;
    
    /**
     * 获取所有轮播图产品信息
     * @return 轮播图产品列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBanners() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Banner> banners = bannerService.findAllBanners();
            
            response.put("code", 200);
            response.put("message", "获取轮播图产品成功");
            response.put("data", banners);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取轮播图产品失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 