package com.milkstore.entity;

import lombok.Data;
import java.util.Date;

@Data
public class User {
    private String userId;
    private String nickname;
    private String avatar;
    private String phone;
    private String password;
    private String gender;
    private Date birthday;
    private Integer pandaCoins;
    private Integer lightningStars;
    private Integer memberLevel;
    private Date createTime;
    private Date lastLoginTime;
} 