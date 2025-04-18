package com.milkstore.service;

import com.milkstore.entity.UserAddress;
import java.util.List;

public interface UserAddressService {
    /**
     * 获取用户的默认地址
     * @param userId 用户ID
     * @return 默认地址，若无则返回null
     */
    UserAddress getDefaultAddress(String userId);
    
    /**
     * 获取用户的所有地址
     * @param userId 用户ID
     * @return 地址列表
     */
    List<UserAddress> getUserAddresses(String userId);
    
    /**
     * 添加用户地址
     * @param address 地址信息
     * @return 添加后的地址（包含ID等信息）
     */
    UserAddress addAddress(UserAddress address);
    
    /**
     * 更新用户地址
     * @param address 更新的地址信息
     * @param addressId 地址ID
     * @param userId 用户ID（用于验证权限）
     * @return 是否更新成功
     */
    boolean updateAddress(UserAddress address, String addressId, String userId);
    
    /**
     * 设置默认地址
     * @param addressId 地址ID
     * @param userId 用户ID
     * @return 是否设置成功
     */
    boolean setDefaultAddress(String addressId, String userId);
    
    /**
     * 删除用户地址
     * @param addressId 地址ID
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteAddress(String addressId, String userId);
} 