package com.milkstore.service.impl;

import com.milkstore.entity.Banner;
import com.milkstore.mapper.BannerMapper;
import com.milkstore.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 轮播图产品服务实现类
 */
@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerMapper bannerMapper;
    
    /**
     * 查询所有轮播图产品
     * @return 轮播图产品列表
     */
    @Override
    public List<Banner> findAllBanners() {
        return bannerMapper.findAll();
    }
} 