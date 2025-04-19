package com.milkstore.controller;

import com.milkstore.entity.UserAddress;
import com.milkstore.service.UserAddressService;
import com.milkstore.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserAddressController {

    @Autowired
    private UserAddressService userAddressService;
    
    /**
     * 获取用户默认地址
     */
    @GetMapping("/default-address")
    public Result<Map<String, Object>> getUserDefaultAddress(@RequestParam String userId) {
        // 参数校验
        if (!StringUtils.hasText(userId)) {
            return Result.error("用户ID不能为空");
        }
        
        // 获取用户默认地址
        UserAddress defaultAddress = userAddressService.getDefaultAddress(userId);
        if (defaultAddress == null) {
            return Result.error(404, "未设置默认地址");
        }
        
        // 构建返回数据
        Map<String, Object> data = new HashMap<>();
        Map<String, String> addressInfo = new HashMap<>();
        addressInfo.put("address", defaultAddress.getAddress());
        addressInfo.put("contactName", defaultAddress.getContactName());
        addressInfo.put("phone", defaultAddress.getPhone());
        data.put("address", addressInfo);
        
        return Result.success("获取默认地址成功", data);
    }
    
    /**
     * 获取用户所有地址
     */
    @GetMapping("/addresses")
    public Result<List<UserAddress>> getUserAddresses(@RequestParam String userId) {
        // 参数校验
        if (!StringUtils.hasText(userId)) {
            return Result.error("用户ID不能为空");
        }
        
        // 获取用户所有地址
        List<UserAddress> addresses = userAddressService.getUserAddresses(userId);
        
        return Result.success("获取地址列表成功", addresses);
    }
    
    /**
     * 添加用户地址
     */
    @PostMapping("/address")
    public Result<UserAddress> addUserAddress(@RequestBody UserAddress address) {
        // 参数校验
        if (address == null || !StringUtils.hasText(address.getUserId()) 
                || !StringUtils.hasText(address.getContactName()) 
                || !StringUtils.hasText(address.getPhone()) 
                || !StringUtils.hasText(address.getAddress())) {
            return Result.error("参数不完整");
        }
        
        // 添加地址
        UserAddress savedAddress = userAddressService.addAddress(address);
        
        return Result.success("添加地址成功", savedAddress);
    }
    
    /**
     * 更新用户地址
     */
    @PutMapping("/address/{addressId}")
    public Result<Object> updateUserAddress(@PathVariable String addressId, 
                                   @RequestBody UserAddress address) {
        // 参数校验
        if (address == null || !StringUtils.hasText(addressId)
                || !StringUtils.hasText(address.getUserId())) {
            return Result.error("参数不完整");
        }
        
        // 更新地址
        boolean result = userAddressService.updateAddress(address, addressId, address.getUserId());
        if (!result) {
            return Result.error(404, "地址不存在或无权限");
        }
        
        return Result.success("更新地址成功", null);
    }
    
    /**
     * 设置默认地址
     */
    @PutMapping("/address/{addressId}/default")
    public Result<Object> setDefaultAddress(@PathVariable String addressId, @RequestParam String userId) {
        // 参数校验
        if (!StringUtils.hasText(addressId) || !StringUtils.hasText(userId)) {
            return Result.error("参数不完整");
        }
        
        // 设置默认地址
        boolean result = userAddressService.setDefaultAddress(addressId, userId);
        if (!result) {
            return Result.error(404, "地址不存在或无权限");
        }
        
        return Result.success("设置默认地址成功", null);
    }
    
    /**
     * 删除用户地址
     */
    @DeleteMapping("/address/{addressId}")
    public Result<Object> deleteUserAddress(@PathVariable String addressId, @RequestParam String userId) {
        // 参数校验
        if (!StringUtils.hasText(addressId) || !StringUtils.hasText(userId)) {
            return Result.error("参数不完整");
        }
        
        // 删除地址
        boolean result = userAddressService.deleteAddress(addressId, userId);
        if (!result) {
            return Result.error(404, "地址不存在或无权限");
        }
        
        return Result.success("删除地址成功", null);
    }
} 