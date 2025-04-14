package com.milkstore.service.impl;

import com.milkstore.entity.VerificationCode;
import com.milkstore.mapper.VerificationCodeMapper;
import com.milkstore.service.VerificationCodeService;
import com.milkstore.util.VerificationCodeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {
    
    private static final Logger logger = LoggerFactory.getLogger(VerificationCodeServiceImpl.class);
    
    // 验证码有效期（分钟）
    private static final int CODE_EXPIRE_MINUTES = 10;
    
    // 两次发送的最小间隔（秒）
    private static final int SEND_INTERVAL_SECONDS = 60;
    
    @Autowired
    private VerificationCodeMapper verificationCodeMapper;
    
    @Override
    public boolean sendCode(String phone, String type) {
        try {
            // 检查是否可以发送验证码（防止频繁发送）
            if (!canSendCode(phone, type)) {
                logger.info("发送验证码过于频繁，请稍后再试：{}, {}", phone, type);
                return false;
            }
            
            // 生成验证码
            String code = VerificationCodeUtil.generateCode();
            
            // 设置过期时间
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, CODE_EXPIRE_MINUTES);
            Date expireTime = calendar.getTime();
            
            // 保存验证码到数据库
            VerificationCode verificationCode = new VerificationCode();
            verificationCode.setPhone(phone);
            verificationCode.setCode(code);
            verificationCode.setType(type);
            verificationCode.setExpireTime(expireTime);
            verificationCode.setIsUsed(false);
            
            verificationCodeMapper.insert(verificationCode);
            
            // 这里应该调用实际的短信发送接口
            // 为了测试，直接打印验证码
            logger.info("向手机号 {} 发送验证码: {}, 类型: {}", phone, code, type);
            
            return true;
        } catch (Exception e) {
            logger.error("发送验证码失败: {}", e.getMessage(), e);
            return false;
        }
    }
    
    @Override
    public boolean verifyCode(String phone, String code, String type) {
        try {
            // 查询最新的有效验证码
            VerificationCode verificationCode = verificationCodeMapper.findLatestValidCode(phone, type, new Date());
            
            if (verificationCode == null) {
                logger.info("找不到有效的验证码: {}, {}", phone, type);
                return false;
            }
            
            // 验证码是否匹配
            boolean isMatch = VerificationCodeUtil.validateCode(code, verificationCode.getCode());
            
            if (isMatch) {
                // 标记验证码为已使用
                verificationCodeMapper.markAsUsed(verificationCode.getId());
                logger.info("验证码验证成功: {}, {}", phone, type);
            } else {
                logger.info("验证码不匹配: {}, {}, 输入: {}, 实际: {}", 
                        phone, type, code, verificationCode.getCode());
            }
            
            return isMatch;
        } catch (Exception e) {
            logger.error("验证码验证失败: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 检查是否可以发送验证码（防止频繁发送）
     * @param phone 手机号
     * @param type 验证码类型
     * @return 是否可以发送
     */
    private boolean canSendCode(String phone, String type) {
        // 计算最小发送间隔时间
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.SECOND, -SEND_INTERVAL_SECONDS);
        Date startTime = calendar.getTime();
        
        // 查询是否在间隔时间内已经发送过
        VerificationCode recentCode = verificationCodeMapper.findLatestByTime(phone, type, startTime);
        
        return recentCode == null;
    }
} 