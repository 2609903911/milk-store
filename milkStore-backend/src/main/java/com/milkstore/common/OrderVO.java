package com.milkstore.common;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单数据传输对象
 */
@Data
public class OrderVO {
    /**
     * 订单ID
     */
    private String orderId;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 订单状态
     */
    private String orderStatus;
    
    /**
     * 订单状态显示文本
     */
    private String orderStatusText;
    
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
     * 使用的优惠券名称
     */
    private String couponName;
    
    /**
     * 支付方式
     */
    private String paymentMethod;
    
    /**
     * 支付方式显示文本
     */
    private String paymentMethodText;
    
    /**
     * 配送方式
     */
    private String deliveryType;
    
    /**
     * 配送方式显示文本
     */
    private String deliveryTypeText;
    
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
     * 订单商品列表
     */
    private List<OrderItemVO> orderItems;
    
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
    
    /**
     * 订单项VO
     */
    @Data
    public static class OrderItemVO {
        /**
         * 商品ID
         */
        private Integer productId;
        
        /**
         * 商品名称
         */
        private String name;
        
        /**
         * 商品价格
         */
        private BigDecimal price;
        
        /**
         * 商品数量
         */
        private Integer quantity;
        
        /**
         * 商品规格
         */
        private String specs;
        
        /**
         * 商品图片
         */
        private String image;
    }
} 