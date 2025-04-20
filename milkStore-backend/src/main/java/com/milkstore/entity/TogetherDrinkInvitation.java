package com.milkstore.entity;

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
     * 创建者昵称
     */
    private String creatorNickname;
    
    /**
     * 创建者头像
     */
    private String creatorAvatar;
    
    /**
     * 参与者ID
     */
    private String participantId;
    
    /**
     * 参与者昵称
     */
    private String participantNickname;
    
    /**
     * 参与者头像
     */
    private String participantAvatar;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 商品名称
     */
    private String productName;
    
    /**
     * 商品价格
     */
    private Double productPrice;
    
    /**
     * 商品图片
     */
    private String productImage;
    
    /**
     * 邀请状态：
     * CREATED - 已创建
     * JOINED - 已有人加入
     * CANCELED - 已取消
     * EXPIRED - 已过期
     * COMPLETED - 已完成（已创建订单）
     */
    private String status;
    
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
     * 完成时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completeTime;
    
    /**
     * 关联的订单ID
     */
    private String orderId;
    
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
        if ("EXPIRED".equals(status) || "CANCELED".equals(status) || "COMPLETED".equals(status)) {
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
        return "CREATED".equals(status) && !isExpired() && participantId == null;
    }
    
    /**
     * 检查是否已准备好创建订单
     */
    @JsonIgnore
    public boolean isReadyForOrder() {
        return "JOINED".equals(status) && 
               participantId != null && 
               expireTime != null && 
               expireTime.isAfter(LocalDateTime.now());
    }
} 