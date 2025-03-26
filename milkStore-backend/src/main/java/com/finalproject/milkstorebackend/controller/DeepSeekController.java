package com.finalproject.milkstorebackend.controller;

import com.finalproject.milkstorebackend.model.ChatRequest;
import com.finalproject.milkstorebackend.model.ChatResponse;
import com.finalproject.milkstorebackend.service.DeepSeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * DeepSeek AI控制器
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(
    originPatterns = {"http://localhost:*", "http://127.0.0.1:*"},
    allowCredentials = "true",
    allowedHeaders = "*",
    exposedHeaders = "*",
    maxAge = 3600
)
public class DeepSeekController {
    
    private static final Logger logger = LoggerFactory.getLogger(DeepSeekController.class);
    
    @Autowired
    private DeepSeekService deepSeekService;
    
    /**
     * 处理聊天请求
     * @param request 聊天请求
     * @return 聊天响应
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        logger.info("收到聊天请求: {}", request);
        try {
            if (request == null || request.getMessages() == null || request.getMessages().isEmpty()) {
                logger.warn("无效的请求: 请求或消息为空");
                return ResponseEntity.badRequest()
                    .body(new ChatResponse(false, "无效的请求", "请提供有效的消息内容"));
            }
            
            ChatResponse response = deepSeekService.chat(request);
            logger.info("处理完成，返回响应: {}", response);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                logger.warn("响应不成功: {}", response.getMessage());
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            logger.error("处理请求时发生错误", e);
            return ResponseEntity.internalServerError()
                .body(new ChatResponse(false, "服务器内部错误", "抱歉，服务暂时不可用，请稍后再试。"));
        }
    }
    
    /**
     * 健康检查
     * @return 健康状态
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("收到健康检查请求");
        return ResponseEntity.ok("DeepSeek AI服务正常运行中");
    }
} 