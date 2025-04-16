package com.finalproject.milkstorebackend.service;

import com.milkstore.entity.User;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 根据用户ID获取用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    User getUserById(String userId);
    
    /**
     * 根据手机号获取用户信息
     * @param phone 手机号
     * @return 用户信息
     */
    User getUserByPhone(String phone);
} 