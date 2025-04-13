package com.finalproject.milkstorebackend.service.impl;

import com.finalproject.milkstorebackend.model.ChatRequest;
import com.finalproject.milkstorebackend.model.ChatResponse;
import com.finalproject.milkstorebackend.model.DeepSeekRequest;
import com.finalproject.milkstorebackend.service.DeepSeekService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * DeepSeek AI服务实现类
 */
@Service
public class DeepSeekServiceImpl implements DeepSeekService {

    private static final Logger logger = LoggerFactory.getLogger(DeepSeekServiceImpl.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${deepseek.api.key}")
    private String apiKey;

    @Value("${deepseek.api.url}")
    private String apiUrl;

    @Value("${deepseek.api.model}")
    private String model;

    @Value("${deepseek.api.max-tokens}")
    private Integer maxTokens;

    @Value("${deepseek.api.temperature}")
    private Double temperature;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public ChatResponse chat(ChatRequest request) {
        logger.info("开始处理聊天请求");
        logger.debug("请求内容: {}", request);

        try {
            // 构建请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            logger.debug("API Key: {}", apiKey.substring(0, 5) + "...");

            // 构建请求体
            DeepSeekRequest deepSeekRequest = new DeepSeekRequest();
            deepSeekRequest.setModel(model);
            deepSeekRequest.setMessages(request.getMessages());
            deepSeekRequest.setMax_tokens(maxTokens);
            deepSeekRequest.setTemperature(temperature);

            String requestBody = objectMapper.writeValueAsString(deepSeekRequest);
            logger.debug("请求体: {}", requestBody);

            // 发送请求
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            logger.info("发送请求到DeepSeek API: {}", apiUrl);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl + "/chat/completions",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            logger.info("收到DeepSeek API响应");
            logger.debug("响应内容: {}", response.getBody());

            // 解析响应
            ChatResponse chatResponse = objectMapper.readValue(response.getBody(), ChatResponse.class);
            return chatResponse;

        } catch (Exception e) {
            logger.error("调用DeepSeek API时发生错误", e);
            ChatResponse errorResponse = new ChatResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("AI服务调用失败: " + e.getMessage());
            errorResponse.setContent("抱歉，服务暂时不可用，请稍后再试。");
            return errorResponse;
        }
    }
} 