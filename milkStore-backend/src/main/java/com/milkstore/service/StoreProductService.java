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
     * 获取商品关联的优惠券模板ID
     * @param productId 商品ID
     * @return 关联的优惠券模板ID，如果没有关联则返回null
     */
    Long getCouponTemplateIdByProductId(String productId);
    
    /**
     * 更新商品关联的优惠券模板ID
     * @param productId 商品ID
     * @param couponTemplateId 优惠券模板ID
     * @return 是否更新成功
     */
    boolean updateCouponTemplateId(String productId, Long couponTemplateId);
    
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