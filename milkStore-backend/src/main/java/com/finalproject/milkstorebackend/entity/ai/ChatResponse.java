package com.finalproject.milkstorebackend.entity.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 表示聊天响应的实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    /**
     * 是否成功
     */
    private boolean success;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * AI助手回复内容
     */
    private String content;
} 