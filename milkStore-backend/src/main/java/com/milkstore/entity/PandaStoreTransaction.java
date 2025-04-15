package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

@Data
public class PandaStoreTransaction {
    private String transactionId;
    private String userId;
    private String productId;
    private String transactionType; // "coupon" 或 "lightstar"
    private Integer coinsSpent;
    private Integer quantity;
    private Long couponId;
    private Integer lightstarAmount;
    private String status; // "success", "failed", "canceled"
    private String remark;
    private Date transactionTime;
    private Date createTime;
    private Date updateTime;
    
    // 非数据库字段，用于展示
    private String productTitle;
    private String username;
} 