package com.finalproject.milkstorebackend.entity.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 表示DeepSeek API请求的实体类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeepSeekRequest {
    /**
     * 模型名称
     */
    private String model;
    
    /**
     * 消息列表
     */
    private List<Message> messages;
    
    /**
     * 生成token的最大数量
     */
    private Integer max_tokens;
    
    /**
     * 温度参数，控制生成文本的随机性
     */
    private Double temperature;
} 