package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

@Data
public class VerificationCode {
    private Long id;
    private String phone;
    private String code;
    private String type;
    private Date expireTime;
    private Boolean isUsed;
    private Date createTime;
    private Date updateTime;
} 