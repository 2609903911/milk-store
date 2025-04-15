package com.milkstore.service;

import com.milkstore.entity.StoreProduct;
import java.util.List;

/**
 * 商城商品服务接口
 */
public interface StoreProductService {
    
    /**
     * 获取所有商城商品
     */
    List<StoreProduct> findAllProducts();
    
    /**
     * 根据分类获取商城商品
     */
    List<StoreProduct> findProductsByCategory(String category);
    
    /**
     * 根据ID获取商城商品
     */
    StoreProduct findProductById(String id);
    
    /**
     * 新增商城商品
     */
    boolean addProduct(StoreProduct storeProduct);
    
    /**
     * 更新商城商品
     */
    boolean updateProduct(StoreProduct storeProduct);
    
    /**
     * 删除商城商品
     */
    boolean deleteProduct(String id);
} 