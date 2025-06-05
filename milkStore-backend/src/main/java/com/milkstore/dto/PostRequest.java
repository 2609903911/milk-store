package com.milkstore.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private String title;         // 帖子标题
    private String content;       // 帖子内容
    private Integer productId;    // 关联的奶茶产品ID
    private List<String> images;  // 图片URL列表
} 