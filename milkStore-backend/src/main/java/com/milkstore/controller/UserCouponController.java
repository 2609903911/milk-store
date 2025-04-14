package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.UserCoupon;
import com.milkstore.service.UserCouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-coupons")
public class UserCouponController {

    @Autowired
    private UserCouponService userCouponService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * 根据用户ID查询用户优惠券
     * @param userId 用户ID
     * @return 用户优惠券列表
     */
    @GetMapping("/user/{userId}")
    public Result<List<UserCoupon>> findByUserId(@PathVariable("userId") String userId) {
        List<UserCoupon> userCoupons = userCouponService.findByUserId(userId);
        return Result.success("查询成功", userCoupons);
    }
    
    /**
     * 根据用户ID和状态查询用户优惠券
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
} 