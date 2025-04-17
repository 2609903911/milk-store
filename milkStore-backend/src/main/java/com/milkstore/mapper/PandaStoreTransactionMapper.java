package com.milkstore.mapper;

import com.milkstore.entity.PandaStoreTransaction;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface PandaStoreTransactionMapper {

    /**
     * 插入交易记录（不包含优惠券ID）
     */
    @Insert("INSERT INTO panda_store_transactions(transaction_id, user_id, product_id, transaction_type, " +
            "coins_spent, quantity, lightstar_amount, status, remark, transaction_time) " +
            "VALUES(#{transactionId}, #{userId}, #{productId}, #{transactionType}, #{coinsSpent}, " +
            "#{quantity}, #{lightstarAmount}, #{status}, #{remark}, #{transactionTime})")
    int insertWithoutCoupon(PandaStoreTransaction transaction);
    
    /**
     * 插入完整交易记录（包含优惠券ID）
     */
    @Insert("INSERT INTO panda_store_transactions(transaction_id, user_id, product_id, transaction_type, " +
            "coins_spent, quantity, coupon_id, lightstar_amount, status, remark, transaction_time) " +
            "VALUES(#{transactionId}, #{userId}, #{productId}, #{transactionType}, #{coinsSpent}, " +
            "#{quantity}, #{couponId}, #{lightstarAmount}, #{status}, #{remark}, #{transactionTime})")
    int insert(PandaStoreTransaction transaction);
    
    /**
     * 更新交易记录的优惠券ID
     */
    @Update("UPDATE panda_store_transactions SET coupon_id = #{couponId}, update_time = NOW() " +
            "WHERE transaction_id = #{transactionId}")
    int updateCouponId(@Param("transactionId") String transactionId, @Param("couponId") Long couponId);

    @Select("SELECT t.*, p.title as productTitle, u.nickname as username " +
            "FROM panda_store_transactions t " +
            "LEFT JOIN panda_store_products p ON t.product_id = p.id " +
            "LEFT JOIN users u ON t.user_id = u.user_id " +
            "WHERE t.transaction_id = #{transactionId}")
    PandaStoreTransaction findById(String transactionId);

    @Select("SELECT t.*, p.title as productTitle, u.nickname as username " +
            "FROM panda_store_transactions t " +
            "LEFT JOIN panda_store_products p ON t.product_id = p.id " +
            "LEFT JOIN users u ON t.user_id = u.user_id " +
            "WHERE t.user_id = #{userId} " +
            "ORDER BY t.transaction_time DESC")
    List<PandaStoreTransaction> findByUserId(String userId);

    @Select("SELECT t.*, p.title as productTitle, u.nickname as username " +
            "FROM panda_store_transactions t " +
            "LEFT JOIN panda_store_products p ON t.product_id = p.id " +
            "LEFT JOIN users u ON t.user_id = u.user_id " +
            "ORDER BY t.transaction_time DESC " +
            "LIMIT #{limit} OFFSET #{offset}")
    List<PandaStoreTransaction> findAll(@Param("offset") int offset, @Param("limit") int limit);
    
    @Select("SELECT COUNT(*) FROM panda_store_transactions")
    int countAll();
    
    @Update("UPDATE panda_store_transactions SET status = #{status}, update_time = NOW() " +
            "WHERE transaction_id = #{transactionId}")
    int updateStatus(@Param("transactionId") String transactionId, @Param("status") String status);
} 