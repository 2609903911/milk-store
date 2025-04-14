package com.milkstore.mapper;

import com.milkstore.entity.VerificationCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

@Mapper
public interface VerificationCodeMapper {
    
    /**
     * 插入新的验证码
     * @param verificationCode 验证码对象
     * @return 影响行数
     */
    int insert(VerificationCode verificationCode);
    
    /**
     * 根据手机号和类型查询最新的未过期且未使用的验证码
     * @param phone 手机号
     * @param type 验证码类型
     * @param currentTime 当前时间
     * @return 验证码对象
     */
    VerificationCode findLatestValidCode(@Param("phone") String phone, @Param("type") String type, @Param("currentTime") Date currentTime);
    
    /**
     * 将验证码标记为已使用
     * @param id 验证码ID
     * @return 影响行数
     */
    int markAsUsed(@Param("id") Long id);
    
    /**
     * 检查是否在指定时间内已经发送过验证码
     * @param phone 手机号
     * @param type 验证码类型
     * @param startTime 开始时间
     * @return 验证码对象
     */
    VerificationCode findLatestByTime(@Param("phone") String phone, @Param("type") String type, @Param("startTime") Date startTime);
} 