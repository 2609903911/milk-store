package com.milkstore.service.impl;

import com.milkstore.entity.UserCoupon;
import com.milkstore.mapper.UserCouponMapper;
import com.milkstore.service.UserCouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserCouponServiceImpl implements UserCouponService {

    @Autowired
    private UserCouponMapper userCouponMapper;
    
    @Override
    public List<UserCoupon> findByUserId(String userId) {
        return userCouponMapper.findByUserId(userId);
    }
    
    @Override
    public List<UserCoupon> findByUserIdWithTemplate(String userId) {
        return userCouponMapper.findByUserIdWithTemplate(userId);
    }
    
    @Override
    public List<UserCoupon> findByUserIdAndStatus(String userId, String status) {
        return userCouponMapper.findByUserIdAndStatus(userId, status);
    }
    
    @Override
    public List<UserCoupon> findByUserIdAndStatusWithTemplate(String userId, String status) {
        return userCouponMapper.findByUserIdAndStatusWithTemplate(userId, status);
    }
    
    @Override
    public Map<String, Object> createUserCoupon(UserCoupon userCoupon) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = userCouponMapper.insert(userCoupon);
            if (rows > 0) {
                result.put("success", true);
                result.put("message", "优惠券创建成功");
                result.put("couponId", userCoupon.getId());
                result.put("userCoupon", userCoupon);
            } else {
                result.put("success", false);
                result.put("message", "优惠券创建失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "优惠券创建异常: " + e.getMessage());
        }
        return result;
    }
    
    @Override
    public UserCoupon findById(Long id) {
        return userCouponMapper.findById(id);
    }
    
    @Override
    public boolean updateStatus(Long id, String status) {
        return userCouponMapper.updateStatus(id, status) > 0;
    }
    
    @Override
    public boolean useCoupon(Long id, String orderId) {
        return userCouponMapper.useCoupon(id, orderId) > 0;
    }
} 