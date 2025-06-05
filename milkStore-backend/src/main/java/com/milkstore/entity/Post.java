package com.milkstore.entity;

import lombok.Data;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Data
public class Post {
    private String postId;        // 帖子唯一ID
    private String userId;        // 发帖用户ID
    private Integer productId;    // 关联的奶茶产品ID
    private String title;         // 帖子标题
    private String content;       // 帖子内容
    private String imagesStr;     // 图片URL，多个图片用||分隔，数据库字段名为images
    private Integer likesCount;   // 点赞数量
    private Integer commentsCount; // 评论数量
    private Date createTime;      // 创建时间
    private Date updateTime;      // 更新时间
    private Integer status;       // 状态：0-删除，1-正常
    private Date createdAt;       // 发布日期（对应数据库created_at字段）
    
    // 非数据库字段，用于前端展示
    private User user;            // 发帖用户信息
    private MilkProduct product;  // 关联的奶茶产品信息
    private Boolean isLiked;      // 当前登录用户是否已点赞
    private List<String> images;  // 图片列表，非数据库字段
    
    // 从数据库字符串转换为列表
    public List<String> getImages() {
        if (this.images != null) {
            return this.images;
        }
        
        if (imagesStr == null || imagesStr.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 尝试检测分隔符并处理不同情况
        if (imagesStr.contains("||")) {
            // 使用||分隔
            return Arrays.asList(imagesStr.split("\\|\\|"));
        } else if (imagesStr.contains("//")) {
            // 处理现有数据使用//作为分隔符的情况
            List<String> result = new ArrayList<>();
            for (String url : imagesStr.split("//")) {
                if (!url.isEmpty()) {
                    // 补全每个路径，因为分隔时丢失了/
                    result.add("/" + url);
                }
            }
            return result;
        } else if (imagesStr.contains(",")) {
            // 处理逗号分隔的情况
            return Arrays.asList(imagesStr.split(","));
        } else {
            // 如果没有明显的分隔符，当作单个URL处理
            return Arrays.asList(imagesStr);
        }
    }
    
    // 将列表转换为数据库存储的字符串
    public void setImages(List<String> images) {
        this.images = images;
        if (images == null || images.isEmpty()) {
            this.imagesStr = "";
        } else {
            this.imagesStr = String.join("||", images);
        }
    }
} 