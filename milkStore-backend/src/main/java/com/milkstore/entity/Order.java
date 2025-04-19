package com.milkstore.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体类
 */
@Data
public class Order {
    /**
     * 订单ID
     */
    @Id
    private String orderId;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 订单状态: pending-待支付, paid-已支付, completed-已完成, cancelled-已取消, refunded-已退款
     */
    private String orderStatus;
    
    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;
    
    /**
     * 实付金额
     */
    private BigDecimal actualAmount;
    
    /**
     * 使用的优惠券ID
     */
    private Long couponId;
    
    /**
     * 支付方式
     */
    private String paymentMethod;
    
    /**
     * 配送方式: self-自取, delivery-外卖
     */
    private String deliveryType;
    
    /**
     * 店铺名称
     */
    private String storeName;
    
    /**
     * 店铺地址
     */
    private String storeAddress;
    
    /**
     * 联系人
     */
    private String contactName;
    
    /**
     * 联系电话
     */
    private String contactPhone;
    
    /**
     * 配送地址
     */
    private String deliveryAddress;
    
    /**
     * 订单商品JSON
     */
    private String orderItems;
    
    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    /**
     * 支付时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime payTime;
    
    /**
     * 完成时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completeTime;
    
    /**
     * 备注
     */
    private String remark;
} 