package com.milkstore.mapper;

import com.milkstore.entity.UserCoupon;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserCouponMapper {
    
    /**
     * 根据用户ID查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表
     */
    @Select("SELECT * FROM user_coupon WHERE user_id = #{userId}")
    List<UserCoupon> findByUserId(@Param("userId") String userId);
    
    /**
     * 根据用户ID查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表（包含模板信息）
     */
    @Select("SELECT uc.*, ct.* FROM user_coupon uc " +
            "LEFT JOIN coupon_template ct ON uc.coupon_template_id = ct.id " +
            "WHERE uc.user_id = #{userId}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "couponTemplateId", column = "coupon_template_id"),
        @Result(property = "couponTemplate", column = "coupon_template_id", 
                javaType = com.milkstore.entity.CouponTemplate.class,
                one = @One(select = "com.milkstore.mapper.CouponTemplateMapper.findById"))
    })
    List<UserCoupon> findByUserIdWithTemplate(@Param("userId") String userId);
    
    /**
     * 根据用户ID和状态查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表
     */
    @Select("SELECT * FROM user_coupon WHERE user_id = #{userId} AND status = #{status}")
    List<UserCoupon> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") String status);
    
    /**
     * 根据用户ID和状态查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表（包含模板信息）
     */
    @Select("SELECT uc.*, ct.* FROM user_coupon uc " +
            "LEFT JOIN coupon_template ct ON uc.coupon_template_id = ct.id " +
            "WHERE uc.user_id = #{userId} AND uc.status = #{status}")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "couponTemplateId", column = "coupon_template_id"),
        @Result(property = "couponTemplate", column = "coupon_template_id", 
                javaType = com.milkstore.entity.CouponTemplate.class,
                one = @One(select = "com.milkstore.mapper.CouponTemplateMapper.findById"))
    })
    List<UserCoupon> findByUserIdAndStatusWithTemplate(@Param("userId") String userId, @Param("status") String status);
    
    /**
     * 插入用户优惠券记录
     * @param userCoupon 用户优惠券对象
     * @return 影响行数
     */
    @Insert("INSERT INTO user_coupon(coupon_template_id, coupon_code, status, claim_time, user_id) " +
            "VALUES(#{couponTemplateId}, #{couponCode}, #{status}, #{claimTime}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UserCoupon userCoupon);
    
    /**
     * 根据ID查询优惠券
     * @param id 优惠券ID
     * @return 优惠券对象
     */
    @Select("SELECT * FROM user_coupon WHERE id = #{id}")
    UserCoupon findById(@Param("id") Long id);
    
    /**
     * 更新优惠券状态
     * @param id 优惠券ID
     * @param status 新状态
     * @return 影响行数
     */
    @Update("UPDATE user_coupon SET status = #{status}, update_time = NOW() WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    /**
     * 使用优惠券
     * @param id 优惠券ID
     * @param orderId 订单ID
     * @return 影响行数
     */
    @Update("UPDATE user_coupon SET status = 'used', used_time = NOW(), order_id = #{orderId}, " +
            "update_time = NOW() WHERE id = #{id} AND status = 'valid'")
    int useCoupon(@Param("id") Long id, @Param("orderId") String orderId);
} 