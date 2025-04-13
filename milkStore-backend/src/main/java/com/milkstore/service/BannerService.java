package com.milkstore.service;

import com.milkstore.entity.Banner;

import java.util.List;

/**
 * 轮播图产品服务接口
 */
public interface BannerService {
    
    /**
     * 查询所有轮播图产品
     * @return 轮播图产品列表
     */
    List<Banner> findAllBanners();
} 