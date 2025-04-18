package com.milkstore.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.milkstore.entity.UserAddress;
import com.milkstore.mapper.UserAddressMapper;
import com.milkstore.service.UserAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserAddressServiceImpl implements UserAddressService {
    
    @Autowired
    private UserAddressMapper userAddressMapper;
    
    @Override
    public UserAddress getDefaultAddress(String userId) {
        LambdaQueryWrapper<UserAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserAddress::getUserId, userId)
                   .eq(UserAddress::getIsDefault, true);
        return userAddressMapper.selectOne(queryWrapper);
    }
    
    @Override
    public List<UserAddress> getUserAddresses(String userId) {
        LambdaQueryWrapper<UserAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserAddress::getUserId, userId)
                   .orderByDesc(UserAddress::getIsDefault)
                   .orderByDesc(UserAddress::getUpdateTime);
        return userAddressMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional
    public UserAddress addAddress(UserAddress address) {
        // 设置创建和更新时间
        LocalDateTime now = LocalDateTime.now();
        address.setCreateTime(now);
        address.setUpdateTime(now);
        
        // 如果是默认地址，则取消其他默认地址
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            clearOtherDefaultAddresses(address.getUserId());
        }
        
        userAddressMapper.insert(address);
        return address;
    }
    
    @Override
    @Transactional
    public boolean updateAddress(UserAddress address, String addressId, String userId) {
        // 确认地址存在且属于该用户
        LambdaQueryWrapper<UserAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserAddress::getId, addressId)
                   .eq(UserAddress::getUserId, userId);
        UserAddress existingAddress = userAddressMapper.selectOne(queryWrapper);
        
        if (existingAddress == null) {
            return false;
        }
        
        // 更新地址
        address.setId(addressId);
        address.setUserId(userId);
        address.setUpdateTime(LocalDateTime.now());
        
        // 如果设置为默认地址，需要取消其他默认地址
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            clearOtherDefaultAddresses(userId);
        }
        
        return userAddressMapper.updateById(address) > 0;
    }
    
    @Override
    @Transactional
    public boolean setDefaultAddress(String addressId, String userId) {
        // 确认地址存在且属于该用户
        LambdaQueryWrapper<UserAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserAddress::getId, addressId)
                   .eq(UserAddress::getUserId, userId);
        UserAddress existingAddress = userAddressMapper.selectOne(queryWrapper);
        
        if (existingAddress == null) {
            return false;
        }
        
        // 先清除其他默认地址
        clearOtherDefaultAddresses(userId);
        
        // 设置当前地址为默认
        LambdaUpdateWrapper<UserAddress> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(UserAddress::getId, addressId)
                    .set(UserAddress::getIsDefault, true)
                    .set(UserAddress::getUpdateTime, LocalDateTime.now());
        
        return userAddressMapper.update(null, updateWrapper) > 0;
    }
    
    @Override
    @Transactional
    public boolean deleteAddress(String addressId, String userId) {
        // 确认地址存在且属于该用户
        LambdaQueryWrapper<UserAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserAddress::getId, addressId)
                   .eq(UserAddress::getUserId, userId);
        
        return userAddressMapper.delete(queryWrapper) > 0;
    }
    
    /**
     * 清除用户的其他默认地址
     * @param userId 用户ID
     */
    private void clearOtherDefaultAddresses(String userId) {
        LambdaUpdateWrapper<UserAddress> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(UserAddress::getUserId, userId)
                    .eq(UserAddress::getIsDefault, true)
                    .set(UserAddress::getIsDefault, false)
                    .set(UserAddress::getUpdateTime, LocalDateTime.now());
        
        userAddressMapper.update(null, updateWrapper);
    }
} 