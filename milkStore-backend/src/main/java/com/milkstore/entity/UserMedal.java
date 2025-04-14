package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户勋章关联实体类
 */
@Data
public class UserMedal {
    
    private Integer id;
    private String userId;
    private Medal medal;
    private Boolean isActive;
    private Date obtainTime;
} 