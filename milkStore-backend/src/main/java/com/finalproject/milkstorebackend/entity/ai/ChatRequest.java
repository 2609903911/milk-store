package com.finalproject.milkstorebackend.entity.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 表示聊天请求的实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    /**
     * 消息历史列表
     */
    private List<Message> messages;
    
    /**
     * 系统提示词
     */
    private String systemPrompt;
} 