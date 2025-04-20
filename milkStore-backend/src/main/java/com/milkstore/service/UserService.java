package com.milkstore.service;

import java.util.Map;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 根据用户ID获取用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    Map<String, Object> getUserById(String userId);
} 