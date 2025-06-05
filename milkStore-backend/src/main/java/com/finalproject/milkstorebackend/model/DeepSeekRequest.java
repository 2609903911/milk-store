package com.finalproject.milkstorebackend.model;

import lombok.Data;
import java.util.List;
import com.finalproject.milkstorebackend.entity.ai.Message;

@Data
public class DeepSeekRequest {
    private String model;
    private List<Message> messages;
    private Integer max_tokens;
    private Double temperature;
} 