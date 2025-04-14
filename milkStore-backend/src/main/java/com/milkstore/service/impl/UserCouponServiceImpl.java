package com.milkstore.service.impl;

import com.milkstore.entity.UserCoupon;
import com.milkstore.mapper.UserCouponMapper;
import com.milkstore.service.UserCouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCouponServiceImpl implements UserCouponService {

    @Autowired
    private UserCouponMapper userCouponMapper;
    
    @Override
    public List<UserCoupon> findByUserId(String userId) {
        return userCouponMapper.findByUserId(userId);
    }
    
    @Override
    public List<UserCoupon> findByUserIdAndStatus(String userId, String status) {
        return userCouponMapper.findByUserIdAndStatus(userId, status);
    }
} 