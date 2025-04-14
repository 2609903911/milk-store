package com.milkstore.service;

/**
 * 验证码服务接口
 */
public interface VerificationCodeService {
    
    /**
     * 发送验证码
     * @param phone 手机号
     * @param type 验证码类型(login-登录, register-注册, resetPassword-重置密码)
     * @return 是否发送成功
     */
    boolean sendCode(String phone, String type);
    
    /**
     * 验证验证码
     * @param phone 手机号
     * @param code 验证码
     * @param type 验证码类型
     * @return 是否验证成功
     */
    boolean verifyCode(String phone, String code, String type);
} 