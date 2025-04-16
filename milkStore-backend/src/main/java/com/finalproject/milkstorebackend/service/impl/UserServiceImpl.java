package com.finalproject.milkstorebackend.service.impl;

import com.milkstore.entity.User;
import com.milkstore.mapper.UserMapper;
import com.finalproject.milkstorebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    
    /**
     * 根据用户ID获取用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    @Override
    public User getUserById(String userId) {
        return userMapper.findById(userId);
    }
    
    /**
     * 根据手机号获取用户信息
     * @param phone 手机号
     * @return 用户信息
     */
    @Override
    public User getUserByPhone(String phone) {
        return userMapper.findByPhone(phone);
    }
} 