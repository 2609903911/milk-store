package com.finalproject.milkstorebackend.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String id;
    private String object;
    private long created;
    private List<Choice> choices;
    private Usage usage;
    private boolean success;
    private String message;
    private String content;
    
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
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Usage {
        private int prompt_tokens;
        private int completion_tokens;
        private int total_tokens;
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