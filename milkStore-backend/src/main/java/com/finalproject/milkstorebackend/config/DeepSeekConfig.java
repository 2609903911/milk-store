package com.finalproject.milkstorebackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * DeepSeek API配置类
 */
@Configuration
public class DeepSeekConfig {
    
    @Value("${deepseek.api.url:https://api.deepseek.com/v1}")
    private String apiUrl;
    
    @Value("${deepseek.api.key:default-key}")
    private String apiKey;
    
    @Value("${deepseek.api.model:deepseek-chat}")
    private String model;
    
    @Value("${deepseek.api.max-tokens:2000}")
    private Integer maxTokens;
    
    @Value("${deepseek.api.temperature:0.7}")
    private Double temperature;
    
    /**
     * 创建WebClient Bean用于HTTP请求
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
    
    public String getModel() {
        return model;
    }
    
    public Integer getMaxTokens() {
        return maxTokens;
    }
    
    public Double getTemperature() {
        return temperature;
    }
} 