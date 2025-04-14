package com.milkstore.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class CouponTemplate {
    private Long id;
    private String code;
    private String title;
    private String type;
    private BigDecimal value;
    private BigDecimal minOrderAmount;
    private String scope;
    private String description;
    private String imageUrl;
    private String status;
    private Date startTime;
    private Date endTime;
    private Date createTime;
    private Date updateTime;
    private Boolean isDeleted;
} 