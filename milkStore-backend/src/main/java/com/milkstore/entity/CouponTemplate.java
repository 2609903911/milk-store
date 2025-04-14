package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

@Data
public class CouponTemplate {
    private Long id;
    private String name;
    private String type;
    private Double discount;
    private Double amount;
    private Double minOrderAmount;
    private String description;
    private Date startTime;
    private Date endTime;
    private Integer quantity;
    private Integer usedCount;
    private Integer validDays;
    private Boolean isDeleted;
    private Date createTime;
    private Date updateTime;
} 