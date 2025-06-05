package com.finalproject.milkstorebackend.model;

import lombok.Data;
import java.util.List;
import com.finalproject.milkstorebackend.entity.ai.Message;

@Data
public class ChatRequest {
    private List<Message> messages;
    private String systemPrompt;
} 