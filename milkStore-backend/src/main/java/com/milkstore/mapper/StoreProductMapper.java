package com.milkstore.mapper;

import com.milkstore.entity.StoreProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StoreProductMapper {
    
    /**
     * 获取所有商城商品
     */
    @Select("SELECT * FROM panda_store_products WHERE is_active = true ORDER BY coins_cost ASC")
    List<StoreProduct> findAll();
    
    /**
     * 根据分类获取商城商品
     */
    @Select("SELECT * FROM panda_store_products WHERE category = #{category} AND is_active = true ORDER BY coins_cost ASC")
    List<StoreProduct> findByCategory(@Param("category") String category);
    
    /**
     * 根据ID获取商城商品
     */
    @Select("SELECT * FROM panda_store_products WHERE id = #{id}")
    StoreProduct findById(@Param("id") String id);
    
    /**
     * 新增商城商品
     */
    @Insert("INSERT INTO panda_store_products(id, title, type, value, min_order_amount, description, validity, " +
            "coins_cost, category, image_url, is_active, create_time) " +
            "VALUES(#{id}, #{title}, #{type}, #{value}, #{minOrderAmount}, #{description}, #{validity}, " +
            "#{coinsCost}, #{category}, #{imageUrl}, #{isActive}, #{createTime})")
    int insert(StoreProduct storeProduct);
    
    /**
     * 更新商城商品
     */
    @Update("UPDATE panda_store_products SET title = #{title}, type = #{type}, value = #{value}, " +
            "min_order_amount = #{minOrderAmount}, description = #{description}, validity = #{validity}, " +
            "coins_cost = #{coinsCost}, category = #{category}, image_url = #{imageUrl}, " +
            "is_active = #{isActive} " +
            "WHERE id = #{id}")
    int update(StoreProduct storeProduct);
    
    /**
     * 删除商城商品
     */
    @Delete("DELETE FROM panda_store_products WHERE id = #{id}")
    int delete(@Param("id") String id);
} 