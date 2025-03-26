package com.finalproject.milkstorebackend.service;

import com.finalproject.milkstorebackend.model.ChatRequest;
import com.finalproject.milkstorebackend.model.ChatResponse;

/**
 * DeepSeek AI服务接口
 */
public interface DeepSeekService {
    
    /**
     * 处理聊天请求
     * @param request 聊天请求
     * @return 聊天响应
     */
    ChatResponse chat(ChatRequest request);
} 