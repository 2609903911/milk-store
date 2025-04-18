package com.milkstore.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_address")
public class UserAddress {
    @TableId(type = IdType.ASSIGN_ID)
    private String id;
    private String userId;
    private String contactName;
    private String gender;
    private String phone;
    private String address;
    private Boolean isDefault;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
} 