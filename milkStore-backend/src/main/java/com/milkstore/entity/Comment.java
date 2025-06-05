package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 评论实体类
 */
@Data
public class Comment {
    /**
     * 评论ID
     */
    private String commentId;
    
    /**
     * 帖子ID
     */
    private String postId;
    
    /**
     * 评论用户ID
     */
    private String userId;
    
    /**
     * 评论内容
     */
    private String content;
    
    /**
     * 父评论ID，如果是顶级评论则为null
     */
    private String parentId;
    
    /**
     * 被回复用户ID，如果是顶级评论则为null
     */
    private String replyToUserId;
    
    /**
     * 点赞数
     */
    private Integer likesCount;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 状态：0-删除，1-正常
     */
    private Integer status;
    
    /**
     * 用户信息（非数据库字段）
     */
    private User user;
    
    /**
     * 被回复用户信息（非数据库字段）
     */
    private User replyToUser;
} 