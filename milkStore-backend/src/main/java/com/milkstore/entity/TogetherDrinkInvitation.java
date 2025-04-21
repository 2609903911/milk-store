package com.milkstore.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

/**
 * 一起喝邀请实体类
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TogetherDrinkInvitation implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 邀请码
     */
    private String inviteCode;
    
    /**
     * 创建者ID
     */
    private String creatorId;
    
    /**
     * 参与者ID
     */
    private String participantId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 邀请状态：
     * created - 已创建
     * joined - 已有人加入
     * paid - 已支付
     * cancelled - 已取消
     * expired - 已过期
     */
    private String status;
    
    /**
     * 总金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 支付者ID
     */
    private String payerId;
    
    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
    
    /**
     * 过期时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expireTime;
    
    /**
     * 加入时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime joinedAt;
    
    /**
     * 支付时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paidAt;
    
    // 以下为非数据库字段，用于传输数据
    
    /**
     * 创建者昵称（非数据库字段）
     */
    private transient String creatorNickname;
    
    /**
     * 创建者头像（非数据库字段）
     */
    private transient String creatorAvatar;
    
    /**
     * 参与者昵称（非数据库字段）
     */
    private transient String participantNickname;
    
    /**
     * 参与者头像（非数据库字段）
     */
    private transient String participantAvatar;
    
    /**
     * 商品名称（非数据库字段）
     */
    private transient String productName;
    
    /**
     * 商品价格（非数据库字段）
     */
    private transient Double productPrice;
    
    /**
     * 商品图片（非数据库字段）
     */
    private transient String productImage;
    
    /**
     * 关联的订单ID（非数据库字段，使用payerId代替）
     */
    private transient String orderId;
    
    /**
     * 商品信息（非数据库字段）
     */
    private transient Object product;
    
    /**
     * 创建者信息（非数据库字段）
     */
    private transient Object creator;
    
    /**
     * 参与者信息（非数据库字段）
     */
    private transient Object participant;
    
    /**
     * 检查邀请是否已过期
     */
    @JsonIgnore
    public boolean isExpired() {
        if ("expired".equals(status) || "cancelled".equals(status) || "paid".equals(status)) {
            return true;
        }
        
        if (expireTime == null) {
            return false;
        }
        
        return expireTime.isBefore(LocalDateTime.now());
    }
    
    /**
     * 检查是否可以加入
     */
    @JsonIgnore
    public boolean canJoin() {
        return "created".equals(status) && !isExpired() && participantId == null;
    }
    
    /**
     * 检查是否已准备好创建订单
     */
    @JsonIgnore
    public boolean isReadyForOrder() {
        return "joined".equals(status) && 
               participantId != null && 
               expireTime != null && 
               expireTime.isAfter(LocalDateTime.now());
    }
} 