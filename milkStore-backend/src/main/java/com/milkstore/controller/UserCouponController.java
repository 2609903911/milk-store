package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.UserCoupon;
import com.milkstore.service.UserCouponService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-coupons")
@Slf4j
public class UserCouponController {

    @Autowired
    private UserCouponService userCouponService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * 根据用户ID查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表
     */
    @GetMapping("/user/{userId}")
    public Result<List<UserCoupon>> findByUserId(@PathVariable("userId") String userId) {
        List<UserCoupon> userCoupons = userCouponService.findByUserId(userId);
        return Result.success("查询成功", userCoupons);
    }
    
    /**
     * 根据用户ID查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @return 用户优惠券列表（包含模板信息）
     */
    @GetMapping("/user/{userId}/with-template")
    public Result<List<UserCoupon>> findByUserIdWithTemplate(@PathVariable("userId") String userId) {
        List<UserCoupon> userCoupons = userCouponService.findByUserIdWithTemplate(userId);
        return Result.success("查询成功", userCoupons);
    }
    
    /**
     * 根据用户ID和状态查询用户优惠券（不包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表
     */
    @GetMapping("/user/{userId}/status/{status}")
    public Result<List<UserCoupon>> findByUserIdAndStatus(
            @PathVariable("userId") String userId,
            @PathVariable("status") String status) {
        List<UserCoupon> userCoupons = userCouponService.findByUserIdAndStatus(userId, status);
        return Result.success("查询成功", userCoupons);
    }
    
    /**
     * 根据用户ID和状态查询用户优惠券（包含模板信息）
     * @param userId 用户ID
     * @param status 优惠券状态
     * @return 用户优惠券列表（包含模板信息）
     */
    @GetMapping("/user/{userId}/status/{status}/with-template")
    public Result<List<UserCoupon>> findByUserIdAndStatusWithTemplate(
            @PathVariable("userId") String userId,
            @PathVariable("status") String status) {
        List<UserCoupon> userCoupons = userCouponService.findByUserIdAndStatusWithTemplate(userId, status);
        return Result.success("查询成功", userCoupons);
    }
    
    /**
     * 检查数据库表结构
     * @return 表结构信息
     */
    @GetMapping("/check-table-structure")
    public Result<Map<String, Object>> checkTableStructure() {
        // 检查coupon_template表是否存在
        List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SHOW TABLES LIKE 'coupon_template'");
        
        if (tables.isEmpty()) {
            return Result.error("coupon_template表不存在");
        }
        
        // 获取表结构
        List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SHOW COLUMNS FROM coupon_template");
        
        return Result.success("查询成功", Map.of("columns", columns));
    }

    /**
     * 根据ID获取优惠券详情
     * @param id 优惠券ID
     * @return 优惠券详情
     */
    @GetMapping("/{id}")
    public Result<UserCoupon> getCouponById(@PathVariable("id") Long id) {
        log.info("获取优惠券详情，ID: {}", id);
        try {
            UserCoupon userCoupon = userCouponService.findById(id);
            if (userCoupon == null) {
                return Result.error("优惠券不存在");
            }
            return Result.success("获取成功", userCoupon);
        } catch (Exception e) {
            log.error("获取优惠券详情失败", e);
            return Result.error("获取优惠券详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新优惠券使用状态
     * @param id 优惠券ID
     * @param orderId 订单ID
     * @return 更新结果
     */
    @PutMapping("/{id}/use")
    public Result<?> useCoupon(
            @PathVariable("id") Long id,
            @RequestParam("orderId") String orderId) {
        log.info("更新优惠券使用状态，ID: {}, 订单ID: {}", id, orderId);
        try {
            // 查找优惠券
            UserCoupon userCoupon = userCouponService.findById(id);
            if (userCoupon == null) {
                return Result.error("优惠券不存在");
            }
            
            // 检查优惠券状态
            if ("used".equals(userCoupon.getStatus())) {
                return Result.error("优惠券已被使用");
            }
            
            // 更新优惠券状态
            userCoupon.setStatus("used");
            userCoupon.setUsedTime(new java.util.Date());
            userCoupon.setOrderId(orderId);
            
            // 调用专门的方法使用优惠券
            boolean success = userCouponService.useCoupon(id, orderId);
            
            if (success) {
                return Result.success("优惠券使用成功", null);
            } else {
                return Result.error("优惠券使用失败");
            }
        } catch (Exception e) {
            log.error("更新优惠券状态失败", e);
            return Result.error("更新优惠券状态失败: " + e.getMessage());
        }
    }
} 