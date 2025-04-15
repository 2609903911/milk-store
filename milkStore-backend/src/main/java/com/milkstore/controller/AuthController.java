package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.User;
import com.milkstore.entity.UserCoupon;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.MedalService;
import com.milkstore.service.UserCouponService;
import com.milkstore.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private VerificationCodeService verificationCodeService;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private MedalService medalService;
    
    @Autowired
    private UserCouponService userCouponService;
    
    /**
     * 发送验证码
     * @param phone 手机号
     * @param type 验证码类型
     * @return 发送结果
     */
    @PostMapping("/code/send")
    public Result<Object> sendVerificationCode(
            @RequestParam("phone") String phone,
            @RequestParam(value = "type", defaultValue = "login") String type) {
        
        // 1. 简单的手机号格式校验
        if (phone == null || phone.length() < 11) {
            return Result.error(400, "无效的手机号");
        }
        
        // 2. 发送验证码
        boolean success = verificationCodeService.sendCode(phone, type);
        
        if (success) {
            return Result.success("验证码发送成功", null);
        } else {
            return Result.error(429, "发送验证码过于频繁，请稍后再试");
        }
    }
    
    /**
     * 使用验证码登录
     * @param phone 手机号
     * @param code 验证码
     * @return 登录结果，包括用户信息、勋章、优惠券和token
     */
    @PostMapping("/login/code")
    public Result<Object> loginWithCode(
            @RequestParam("phone") String phone,
            @RequestParam("code") String code) {
        
        try {
            // 1. 验证验证码
            boolean isValid = verificationCodeService.verifyCode(phone, code, "login");
            
            if (!isValid) {
                return Result.error(400, "验证码错误");
            }
            
            // 2. 查询用户是否存在
            User user = userMapper.findByPhone(phone);
            
            // 3. 用户不存在，自动注册
            if (user == null) {
                user = createNewUser(phone);
            } else {
                // 更新最后登录时间仅在内存中更新，不持久化到数据库
                user.setLastLoginTime(new Date());
            }
            
            // 4. 生成登录令牌
            String token = UUID.randomUUID().toString().replace("-", "");
            
            // 5. 获取用户勋章 - 处理可能的异常
            List<Map<String, Object>> medals = new ArrayList<>();
            try {
                Map<String, Object> userMedals = medalService.findUserMedals(user.getUserId());
                if (userMedals != null && userMedals.containsKey("medals")) {
                    medals = (List<Map<String, Object>>) userMedals.get("medals");
                }
            } catch (Exception e) {
                System.err.println("获取用户勋章时出错: " + e.getMessage());
            }
            
            // 6. 获取用户优惠券 - 处理可能的异常
            List<UserCoupon> userCoupons = new ArrayList<>();
            try {
                userCoupons = userCouponService.findByUserIdWithTemplate(user.getUserId());
            } catch (Exception e) {
                System.err.println("获取用户优惠券时出错: " + e.getMessage());
            }
            
            // 7. 构建包含完整用户数据的响应
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
            userData.put("addresses", new ArrayList<>()); // 返回空地址列表
            
            // 8. 返回用户信息和令牌
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("user", userData);
            resultMap.put("token", token);
            
            return Result.success("登录成功", resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "登录失败: " + e.getMessage());
        }
    }
    
    /**
     * 创建新用户
     * @param phone 手机号
     * @return 新用户信息
     */
    private User createNewUser(String phone) {
        User user = new User();
        String userId = "user_" + System.currentTimeMillis();
        user.setUserId(userId);
        user.setNickname("用户" + phone.substring(phone.length() - 4));
        user.setPhone(phone);
        user.setGender("unknown"); // 使用表中的enum值
        user.setPandaCoins(0);
        user.setLightningStars(0);
        user.setMemberLevel(1);
        // 设置默认头像
        user.setAvatar("/static/images/avatar.png");
        // 设置创建时间和最后登录时间
        Date now = new Date();
        user.setCreateTime(now);
        user.setLastLoginTime(now);
        
        try {
            userMapper.insert(user);
        } catch (Exception e) {
            System.err.println("创建用户失败: " + e.getMessage());
            throw e; // 重新抛出异常，让上层捕获
        }
        
        return user;
    }
} 