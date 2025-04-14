package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.User;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private VerificationCodeService verificationCodeService;
    
    @Autowired
    private UserMapper userMapper;
    
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
     * @return 登录结果
     */
    @PostMapping("/login/code")
    public Result<Object> loginWithCode(
            @RequestParam("phone") String phone,
            @RequestParam("code") String code) {
        
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
        }
        
        // 4. 生成登录令牌
        String token = UUID.randomUUID().toString().replace("-", "");
        
        // 5. 返回用户信息和令牌
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("user", user);
        resultMap.put("token", token);
        
        return Result.success("登录成功", resultMap);
    }
    
    /**
     * 创建新用户
     * @param phone 手机号
     * @return 新用户信息
     */
    private User createNewUser(String phone) {
        User user = new User();
        user.setUserId("user_" + System.currentTimeMillis());
        user.setNickname("用户" + phone.substring(phone.length() - 4));
        user.setPhone(phone);
        user.setGender("unknown");
        user.setPandaCoins(0);
        user.setLightningStars(0);
        user.setMemberLevel(1);
        
        userMapper.insert(user);
        
        return user;
    }
} 