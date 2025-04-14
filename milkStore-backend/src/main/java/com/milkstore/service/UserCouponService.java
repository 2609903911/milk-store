package com.milkstore.service;

import com.milkstore.entity.UserCoupon;
import java.util.List;

public interface UserCouponService {
    
    /**
     * 根据用户ID查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表
     */
    List<UserCoupon> findByUserId(String userId);
    
    /**
     * 根据用户ID查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表（包含模板信息）
     */
    List<UserCoupon> findByUserIdWithTemplate(String userId);
    
    /**
     * 根据用户ID和状态查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表
     */
    List<UserCoupon> findByUserIdAndStatus(String userId, String status);
    
    /**
     * 根据用户ID和状态查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表（包含模板信息）
     */
    List<UserCoupon> findByUserIdAndStatusWithTemplate(String userId, String status);
} 