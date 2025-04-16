package com.finalproject.milkstorebackend.controller;

import com.finalproject.milkstorebackend.model.ApiResponse;
import com.finalproject.milkstorebackend.service.UserService;
import com.milkstore.entity.User;
import com.milkstore.entity.UserCoupon;
import com.milkstore.service.MedalService;
import com.milkstore.service.UserCouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户相关接口
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private MedalService medalService;
    
    @Autowired
    private UserCouponService userCouponService;
    
    /**
     * 根据用户ID获取用户详细信息
     * @param userId 用户ID
     * @return 用户详细信息，包括基本信息、勋章、优惠券等
     */
    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getUserProfile(@RequestParam("userId") String userId) {
        try {
            // 1. 获取用户基本信息
            User user = userService.getUserById(userId);
            
            if (user == null) {
                return ApiResponse.error(404, "用户不存在");
            }
            
            // 2. 获取用户勋章
            List<Map<String, Object>> medals = new ArrayList<>();
            try {
                Map<String, Object> userMedals = medalService.findUserMedals(userId);
                if (userMedals != null && userMedals.containsKey("medals")) {
                    medals = (List<Map<String, Object>>) userMedals.get("medals");
                }
            } catch (Exception e) {
                System.err.println("获取用户勋章时出错: " + e.getMessage());
            }
            
            // 3. 获取用户优惠券
            List<UserCoupon> userCoupons = new ArrayList<>();
            try {
                userCoupons = userCouponService.findByUserIdWithTemplate(userId);
            } catch (Exception e) {
                System.err.println("获取用户优惠券时出错: " + e.getMessage());
            }
            
            // 4. 构建用户完整信息
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("nickname", user.getNickname());
            userData.put("avatar", user.getAvatar());
            userData.put("phone", user.getPhone());
            userData.put("gender", user.getGender());
            userData.put("birthday", user.getBirthday());
            userData.put("pandaCoins", user.getPandaCoins());
            userData.put("lightningStars", user.getLightningStars());
            userData.put("memberLevel", user.getMemberLevel());
            userData.put("createTime", user.getCreateTime());
            userData.put("lastLoginTime", user.getLastLoginTime());
            userData.put("medals", medals);
            userData.put("coupons", userCoupons);
            userData.put("addresses", new ArrayList<>()); // 暂时返回空地址列表
            
            return ApiResponse.success("获取用户信息成功", userData);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("获取用户信息失败: " + e.getMessage());
        }
    }
} 