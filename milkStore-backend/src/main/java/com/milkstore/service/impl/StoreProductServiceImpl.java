package com.milkstore.service.impl;

import com.milkstore.entity.StoreProduct;
import com.milkstore.mapper.StoreProductMapper;
import com.milkstore.service.StoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class StoreProductServiceImpl implements StoreProductService {

    @Autowired
    private StoreProductMapper storeProductMapper;

    @Override
    public List<StoreProduct> findAllProducts() {
        return storeProductMapper.findAll();
    }

    @Override
    public List<StoreProduct> findProductsByCategory(String category) {
        return storeProductMapper.findByCategory(category);
    }

    @Override
    public StoreProduct findProductById(String id) {
        return storeProductMapper.findById(id);
    }

    @Override
    public Long getCouponTemplateIdByProductId(String productId) {
        return storeProductMapper.findCouponTemplateIdByProductId(productId);
    }

    @Override
    public boolean updateCouponTemplateId(String productId, Long couponTemplateId) {
        try {
            return storeProductMapper.updateCouponTemplateId(productId, couponTemplateId) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean addProduct(StoreProduct storeProduct) {
        try {
            // 设置ID
            if (storeProduct.getId() == null || storeProduct.getId().isEmpty()) {
                storeProduct.setId("store_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));
            }
            
            // 设置时间（毫秒时间戳）
            storeProduct.setCreateTime(System.currentTimeMillis());
            
            // 设置默认值
            if (storeProduct.getIsActive() == null) {
                storeProduct.setIsActive(true);
            }
            
            return storeProductMapper.insert(storeProduct) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateProduct(StoreProduct storeProduct) {
        try {
            return storeProductMapper.update(storeProduct) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteProduct(String id) {
        try {
            return storeProductMapper.delete(id) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
} 