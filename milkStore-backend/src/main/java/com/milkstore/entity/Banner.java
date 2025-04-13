package com.milkstore.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * 首页轮播图产品实体类
 */
@Data
public class Banner {
    private Integer id;
    private String tag;
    private String title1;
    private String title2;
    private String desc1;
    private String desc2;
    private String imageUrl;
    private String bgColor;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;
} 