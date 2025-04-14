package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 勋章类型实体类
 */
@Data
public class MedalType {
    
    private String typeId;
    private String typeName;
    private String description;
    private Integer displayOrder;
    private Date createTime;
    private Date updateTime;
} 