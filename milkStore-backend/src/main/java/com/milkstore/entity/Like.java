package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 点赞实体类
 */
@Data
public class Like {
    /**
     * 点赞唯一ID
     */
    private String likeId;
    
    /**
     * 点赞用户ID
     */
    private String userId;
    
    /**
     * 点赞目标ID（帖子ID或评论ID）
     */
    private String targetId;
    
    /**
     * 点赞类型：1-帖子，2-评论
     */
    private Integer targetType;
    
    /**
     * 点赞时间
     */
    private Date createTime;
    
    /**
     * 用户信息（非数据库字段）
     */
    private User user;
} 