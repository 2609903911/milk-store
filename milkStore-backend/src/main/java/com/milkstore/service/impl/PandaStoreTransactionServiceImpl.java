package com.milkstore.service.impl;

import com.milkstore.entity.PandaStoreTransaction;
import com.milkstore.entity.User;
import com.milkstore.mapper.PandaStoreTransactionMapper;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.PandaStoreTransactionService;
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