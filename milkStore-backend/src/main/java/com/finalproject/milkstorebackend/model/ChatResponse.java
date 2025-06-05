package com.finalproject.milkstorebackend.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;
import com.finalproject.milkstorebackend.entity.ai.Message;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;
    private boolean success;
    private String message;
    private String content;
    private String system_fingerprint;
    
    public ChatResponse(boolean success, String message, String content) {
        this.success = success;
        this.message = message;
        this.content = content;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Choice {
        private int index;
        private Message message;
        private String finish_reason;
        private Object logprobs;  // 添加这一行
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Usage {
        private int prompt_tokens;
        private int completion_tokens;
        private int total_tokens;
        private PromptTokensDetails prompt_tokens_details;
        private int prompt_cache_hit_tokens;
        private int prompt_cache_miss_tokens;
        
        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public static class PromptTokensDetails {
            private int cached_tokens;
        }
    }
    
    public boolean isSuccess() {
        return choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null;
    }
    
    public String getContent() {
        if (isSuccess()) {
            return choices.get(0).getMessage().getContent();
        }
        return content != null ? content : "抱歉，我无法理解您的问题。";
    }
}