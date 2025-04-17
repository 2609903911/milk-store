package com.milkstore.service;

import com.milkstore.entity.UserCoupon;
import java.util.List;
import java.util.Map;

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
    
    /**
     * 创建用户优惠券
     * @param userCoupon 用户优惠券对象
     * @return 创建结果，包含新创建的优惠券ID
     */
    Map<String, Object> createUserCoupon(UserCoupon userCoupon);
    
    /**
     * 根据ID查询优惠券
     * @param id 优惠券ID
     * @return 优惠券对象
     */
    UserCoupon findById(Long id);
    
    /**
     * 更新优惠券状态
     * @param id 优惠券ID
     * @param status 新状态
     * @return 是否更新成功
     */
    boolean updateStatus(Long id, String status);
    
    /**
     * 使用优惠券
     * @param id 优惠券ID
     * @param orderId 订单ID
     * @return 是否使用成功
     */
    boolean useCoupon(Long id, String orderId);
} 