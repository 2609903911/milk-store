package com.milkstore.service.impl;

import com.milkstore.entity.MilkProduct;
import com.milkstore.mapper.ProductMapper;
import com.milkstore.service.MilkStoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 奶茶店产品服务实现类
 */
@Service
public class MilkStoreProductServiceImpl implements MilkStoreProductService {

    @Autowired
    private ProductMapper productMapper;

    @Override
    public Map<String, Object> getProductById(Long productId) {
        // 根据ID查询商品
        MilkProduct product = productMapper.findById(productId.intValue());
        
        if (product == null) {
            return null;
        }
        
        // 将商品转换为Map返回
        Map<String, Object> productMap = new HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("name", product.getName());
        productMap.put("description", product.getDescription());
        productMap.put("price", product.getPrice().doubleValue());
        productMap.put("image", product.getImageUrl());
        
        if (product.getCategory() != null) {
            productMap.put("categoryId", product.getCategory().getId());
            productMap.put("categoryName", product.getCategory().getName());
        }
        
        return productMap;
    }

    @Override
    public List<Map<String, Object>> getAllProducts() {
        // 查询所有商品
        List<MilkProduct> products = productMapper.findAllActive();
        
        // 转换为Map列表
        List<Map<String, Object>> productList = new ArrayList<>();
        
        for (MilkProduct product : products) {
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("name", product.getName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice().doubleValue());
            productMap.put("image", product.getImageUrl());
            
            if (product.getCategory() != null) {
                productMap.put("categoryId", product.getCategory().getId());
                productMap.put("categoryName", product.getCategory().getName());
            }
            
            productList.add(productMap);
        }
        
        return productList;
    }
} 