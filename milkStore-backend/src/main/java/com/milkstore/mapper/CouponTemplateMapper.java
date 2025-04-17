package com.milkstore.mapper;

import com.milkstore.entity.CouponTemplate;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface CouponTemplateMapper {
    
    /**
     * 根据ID查询优惠券模板
     * @param id 模板ID
     * @return 优惠券模板
     */
    @Select("SELECT * FROM coupon_template WHERE id = #{id}")
    CouponTemplate findById(@Param("id") Long id);
    
    /**
     * 查询所有有效的优惠券模板
     * @return 优惠券模板列表
     */
    @Select("SELECT * FROM coupon_template WHERE status = 'active' AND is_deleted = false " +
            "AND NOW() BETWEEN start_time AND end_time ORDER BY create_time DESC")
    List<CouponTemplate> findAllActive();
    
    /**
     * 查询所有优惠券模板
     * @return 优惠券模板列表
     */
    @Select("SELECT * FROM coupon_template WHERE is_deleted = false ORDER BY create_time DESC")
    List<CouponTemplate> findAll();
    
    /**
     * 根据代码查询优惠券模板
     * @param code 模板代码
     * @return 优惠券模板
     */
    @Select("SELECT * FROM coupon_template WHERE code = #{code} AND is_deleted = false")
    CouponTemplate findByCode(@Param("code") String code);
} 