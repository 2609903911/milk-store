package com.milkstore.service;

import com.milkstore.entity.PandaStoreTransaction;
import com.milkstore.entity.UserCoupon;
import java.util.List;
import java.util.Map;

public interface PandaStoreTransactionService {
    
    /**
     * 创建新交易
     */
    Map<String, Object> createTransaction(PandaStoreTransaction transaction);
    
    /**
     * 创建优惠券兑换交易（先创建用户优惠券，再创建交易记录）
     * @param transaction 交易基本信息
     * @param userCoupon 用户优惠券信息
     * @return 交易结果
     */
    Map<String, Object> createCouponTransaction(PandaStoreTransaction transaction, UserCoupon userCoupon);
    
    /**
     * 创建点亮星兑换交易
     * @param transaction 交易基本信息
     * @return 交易结果
     */
    Map<String, Object> createLightstarTransaction(PandaStoreTransaction transaction);
    
    /**
     * 更新交易记录的优惠券ID
     * @param transactionId 交易ID
     * @param couponId 优惠券ID
     * @return 是否更新成功
     */
    boolean updateTransactionCouponId(String transactionId, Long couponId);
    
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