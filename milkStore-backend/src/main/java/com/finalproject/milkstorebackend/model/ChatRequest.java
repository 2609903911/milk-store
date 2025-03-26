package com.finalproject.milkstorebackend.model;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private List<Message> messages;
    private String systemPrompt;
}

@Data
class Message {
    private String role;
    private String content;
} 