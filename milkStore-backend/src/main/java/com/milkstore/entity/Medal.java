package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 勋章实体类
 */
@Data
public class Medal {
    
    private String medalId;
    private MedalType type;
    private String medalName;
    private String iconPath;
    private String description;
    private String obtainCondition;
    private Integer sortOrder;
    private Date createTime;
} 