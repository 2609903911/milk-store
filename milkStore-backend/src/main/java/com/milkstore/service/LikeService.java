package com.milkstore.service;

import java.util.Map;
import java.util.List;

/**
 * 点赞服务接口
 */
public interface LikeService {
    
    /**
     * 点赞/取消点赞
     * @param userId 用户ID
     * @param targetId 目标ID（帖子ID或评论ID）
     * @param targetType 目标类型（1-帖子，2-评论）
     * @return 点赞操作结果
     */
    Map<String, Object> toggleLike(String userId, String targetId, Integer targetType);
    
    /**
     * 检查用户是否点赞
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 是否点赞
     */
    boolean isLiked(String userId, String targetId, Integer targetType);
    
    /**
     * 获取用户点赞的帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 帖子列表及分页信息
     */
    Map<String, Object> getUserLikedPosts(String userId, int page, int size);
    
    /**
     * 批量检查用户是否点赞多个目标
     * @param userId 用户ID
     * @param targetIds 目标ID列表
     * @param targetType 目标类型
     * @return 点赞状态映射，key为目标ID，value为是否点赞
     */
    Map<String, Boolean> batchCheckLike(String userId, List<String> targetIds, Integer targetType);
} 