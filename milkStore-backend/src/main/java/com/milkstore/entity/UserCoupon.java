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
    
    // 暂时注释掉关联查询
    // private CouponTemplate couponTemplate;
} 