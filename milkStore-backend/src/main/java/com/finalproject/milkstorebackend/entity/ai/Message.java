package com.finalproject.milkstorebackend.entity.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 表示聊天消息的实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    /**
     * 消息角色：user（用户）或assistant（AI助手）
     */
    private String role;
    
    /**
     * 消息内容
     */
    private String content;
} 