package com.milkstore.service;

import com.milkstore.entity.PandaStoreTransaction;
import java.util.List;
import java.util.Map;

public interface PandaStoreTransactionService {
    
    /**
     * 创建新交易
     */
    Map<String, Object> createTransaction(PandaStoreTransaction transaction);
    
    /**
     * 根据ID查找交易
     */
    PandaStoreTransaction getTransactionById(String transactionId);
    
    /**
     * 获取用户的交易历史
     */
    List<PandaStoreTransaction> getUserTransactions(String userId);
    
    /**
     * 分页获取所有交易
     */
    Map<String, Object> getAllTransactions(int page, int size);
    
    /**
     * 更新交易状态
     */
    boolean updateTransactionStatus(String transactionId, String status);
} 