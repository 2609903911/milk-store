package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

@Data
public class UserCoupon {
    private Long id;
    private Long couponTemplateId;
    private String couponCode;
    private String status;
    private Date claimTime;
    private Date usedTime;
    private String orderId;
    private Date createTime;
    private Date updateTime;
    private String userId;
    
    // 非数据库字段，用于关联查询
    private CouponTemplate couponTemplate;
} 