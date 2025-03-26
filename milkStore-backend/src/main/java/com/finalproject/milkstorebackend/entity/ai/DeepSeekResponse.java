package com.finalproject.milkstorebackend.entity.ai;

import lombok.Data;

import java.util.List;

/**
 * 表示DeepSeek API响应的实体类
 */
@Data
public class DeepSeekResponse {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;
    
    @Data
    public static class Choice {
        private Message message;
        private String finish_reason;
        private Integer index;
    }
    
    @Data
    public static class Usage {
        private Integer prompt_tokens;
        private Integer completion_tokens;
        private Integer total_tokens;
    }
} 