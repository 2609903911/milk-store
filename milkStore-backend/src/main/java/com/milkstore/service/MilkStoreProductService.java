package com.milkstore.service;

import java.util.Map;
import java.util.List;

/**
 * 商品服务接口
 */
public interface MilkStoreProductService {
    
    /**
     * 根据商品ID获取商品信息
     * @param productId 商品ID
     * @return 商品信息
     */
    Map<String, Object> getProductById(Long productId);
    
    /**
     * 获取所有商品
     * @return 商品列表
     */
    List<Map<String, Object>> getAllProducts();
} 