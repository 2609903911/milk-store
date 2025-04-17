package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 熊猫商城商品实体类
 */
@Data
public class StoreProduct {
    private String id;              // 商品ID
    private String title;           // 商品标题
    private String type;            // 商品类型：discount, cash, free, specialPrice, shipping
    private Double value;           // 商品价值/折扣率/金额
    private Double minOrderAmount;  // 最低订单金额要求
    private String description;     // 商品描述
    private String validity;        // 有效期，如"30天"
    private Integer coinsCost;      // 所需熊猫币
    private String category;        // 分类：discount, cash, free, lightStar, shipping
    private String imageUrl;        // 商品图片URL
    private Boolean isActive;       // 是否激活
    private Long createTime;        // 创建时间（毫秒时间戳）
    private Long couponTemplateId;  // 关联的优惠券模板ID
} 