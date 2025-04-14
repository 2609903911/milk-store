package com.milkstore.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * 验证码工具类
 */
@Component
public class VerificationCodeUtil {
    
    private static final SecureRandom random = new SecureRandom();
    
    /**
     * 生成6位数字验证码
     * @return 6位数字验证码
     */
    public static String generateCode() {
        // 生成6位随机数字
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
    
    /**
     * 校验验证码是否正确
     * @param inputCode 用户输入的验证码
     * @param storedCode 系统存储的验证码
     * @return 是否匹配
     */
    public static boolean validateCode(String inputCode, String storedCode) {
        if (inputCode == null || storedCode == null) {
            return false;
        }
        return inputCode.equals(storedCode);
    }
} 