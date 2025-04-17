package com.milkstore.service.impl;

import com.milkstore.entity.PandaStoreTransaction;
import com.milkstore.entity.User;
import com.milkstore.entity.UserCoupon;
import com.milkstore.mapper.PandaStoreTransactionMapper;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.PandaStoreTransactionService;
import com.milkstore.service.UserCouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PandaStoreTransactionServiceImpl implements PandaStoreTransactionService {

    @Autowired
    private PandaStoreTransactionMapper transactionMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private UserCouponService userCouponService;

    @Override
    @Transactional
    public Map<String, Object> createTransaction(PandaStoreTransaction transaction) {
        Map<String, Object> result = new HashMap<>();
        
        // 生成唯一的交易ID
        transaction.setTransactionId("TX" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
        transaction.setTransactionTime(new Date());
        transaction.setStatus("success");
        
        try {
            // 执行交易
            int inserted = transactionMapper.insert(transaction);
            
            if (inserted > 0) {
                // 扣除用户熊猫币
                User user = userMapper.findById(transaction.getUserId());
                if (user != null) {
                    int newCoins = user.getPandaCoins() - transaction.getCoinsSpent();
                    // 如果是点亮星交易，更新点亮星数量
                    if ("lightstar".equals(transaction.getTransactionType())) {
                        int newStars = user.getLightningStars() + transaction.getLightstarAmount();
                        userMapper.updateCoinsAndStars(transaction.getUserId(), newCoins, newStars);
                    } else {
                        userMapper.updateCoins(transaction.getUserId(), newCoins);
                    }
                }
                
                result.put("success", true);
                result.put("message", "交易成功");
                result.put("transaction", transaction);
            } else {
                result.put("success", false);
                result.put("message", "创建交易记录失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "交易过程中出现错误: " + e.getMessage());
        }
        
        return result;
    }
    
    @Override
    @Transactional
    public Map<String, Object> createCouponTransaction(PandaStoreTransaction transaction, UserCoupon userCoupon) {
        Map<String, Object> result = new HashMap<>();
        
        // 生成唯一的交易ID
        transaction.setTransactionId("TX" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
        transaction.setTransactionTime(new Date());
        transaction.setStatus("success");
        transaction.setTransactionType("coupon");
        
        try {
            // 1. 创建用户优惠券
            Map<String, Object> couponResult = userCouponService.createUserCoupon(userCoupon);
            
            if ((Boolean) couponResult.get("success")) {
                Long couponId = (Long) couponResult.get("couponId");
                
                // 2. 创建交易记录（不含优惠券ID）
                int inserted = transactionMapper.insertWithoutCoupon(transaction);
                
                if (inserted > 0) {
                    // 3. 更新交易记录中的优惠券ID
                    boolean updated = updateTransactionCouponId(transaction.getTransactionId(), couponId);
                    
                    if (updated) {
                        // 4. 扣除用户熊猫币
                        User user = userMapper.findById(transaction.getUserId());
                        if (user != null) {
                            int newCoins = user.getPandaCoins() - transaction.getCoinsSpent();
                            userMapper.updateCoins(transaction.getUserId(), newCoins);
                        }
                        
                        result.put("success", true);
                        result.put("message", "优惠券兑换成功");
                        result.put("transaction", transaction);
                        result.put("userCoupon", userCoupon);
                    } else {
                        result.put("success", false);
                        result.put("message", "更新交易记录优惠券ID失败");
                    }
                } else {
                    result.put("success", false);
                    result.put("message", "创建交易记录失败");
                }
            } else {
                result.put("success", false);
                result.put("message", "创建用户优惠券失败: " + couponResult.get("message"));
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "优惠券兑换过程中出现错误: " + e.getMessage());
        }
        
        return result;
    }
    
    @Override
    @Transactional
    public Map<String, Object> createLightstarTransaction(PandaStoreTransaction transaction) {
        Map<String, Object> result = new HashMap<>();
        
        // 生成唯一的交易ID
        transaction.setTransactionId("TX" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
        transaction.setTransactionTime(new Date());
        transaction.setStatus("success");
        transaction.setTransactionType("lightstar");
        
        try {
            // 执行交易
            int inserted = transactionMapper.insertWithoutCoupon(transaction);
            
            if (inserted > 0) {
                // 扣除用户熊猫币并增加点亮星
                User user = userMapper.findById(transaction.getUserId());
                if (user != null) {
                    int newCoins = user.getPandaCoins() - transaction.getCoinsSpent();
                    int newStars = user.getLightningStars() + transaction.getLightstarAmount();
                    userMapper.updateCoinsAndStars(transaction.getUserId(), newCoins, newStars);
                }
                
                result.put("success", true);
                result.put("message", "点亮星兑换成功");
                result.put("transaction", transaction);
            } else {
                result.put("success", false);
                result.put("message", "创建交易记录失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "点亮星兑换过程中出现错误: " + e.getMessage());
        }
        
        return result;
    }
    
    @Override
    public boolean updateTransactionCouponId(String transactionId, Long couponId) {
        return transactionMapper.updateCouponId(transactionId, couponId) > 0;
    }

    @Override
    public PandaStoreTransaction getTransactionById(String transactionId) {
        return transactionMapper.findById(transactionId);
    }

    @Override
    public List<PandaStoreTransaction> getUserTransactions(String userId) {
        return transactionMapper.findByUserId(userId);
    }

    @Override
    public Map<String, Object> getAllTransactions(int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        int offset = (page - 1) * size;
        List<PandaStoreTransaction> transactions = transactionMapper.findAll(offset, size);
        int total = transactionMapper.countAll();
        
        result.put("transactions", transactions);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }

    @Override
    public boolean updateTransactionStatus(String transactionId, String status) {
        return transactionMapper.updateStatus(transactionId, status) > 0;
    }
} 