package com.milkstore.mapper;

import com.milkstore.entity.UserCoupon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserCouponMapper {
    
    /**
     * 根据用户ID查询用户优惠券
     * @param userId 用户ID
     * @return 用户优惠券列表
     */
    List<UserCoupon> findByUserId(@Param("userId") String userId);
    
    /**
     * 根据用户ID和状态查询用户优惠券
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表
     */
    List<UserCoupon> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") String status);
} 