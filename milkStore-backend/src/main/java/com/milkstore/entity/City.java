package com.milkstore.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * 城市实体类
 */
@Data
public class City {
    private Integer id;
    private String name;
    private String pinyin;
    private String code;
    private Double latitude;
    private Double longitude;
    private Boolean isHot;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;
} 