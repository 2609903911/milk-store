package com.milkstore.service.impl;

import com.milkstore.entity.Like;
import com.milkstore.entity.Post;
import com.milkstore.mapper.CommentMapper;
import com.milkstore.mapper.LikeMapper;
import com.milkstore.mapper.PostMapper;
import com.milkstore.service.LikeService;
import com.milkstore.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 点赞服务实现类
 */
@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeMapper likeMapper;
    
    @Autowired
    private PostMapper postMapper;
    
    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private PostService postService;
    
    /**
     * 点赞/取消点赞
     * @param userId 用户ID
     * @param targetId 目标ID（帖子ID或评论ID）
     * @param targetType 目标类型（1-帖子，2-评论）
     * @return 点赞操作结果
     */
    @Override
    @Transactional
    public Map<String, Object> toggleLike(String userId, String targetId, Integer targetType) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 检查用户是否已经点赞
            boolean isLiked = isLiked(userId, targetId, targetType);
            
            if (isLiked) {
                // 已点赞，取消点赞
                int rows = likeMapper.delete(userId, targetId, targetType);
                
                if (rows > 0) {
                    // 更新目标点赞数
                    updateTargetLikesCount(targetId, targetType, false);
                    
                    result.put("success", true);
                    result.put("liked", false);
                    result.put("message", "取消点赞成功");
                } else {
                    result.put("success", false);
                    result.put("message", "取消点赞失败");
                }
            } else {
                // 未点赞，添加点赞
                Like like = new Like();
                like.setLikeId("like_" + UUID.randomUUID().toString().replace("-", "").substring(0, 26));
                like.setUserId(userId);
                like.setTargetId(targetId);
                like.setTargetType(targetType);
                like.setCreateTime(new Date());
                
                int rows = likeMapper.insert(like);
                
                if (rows > 0) {
                    // 更新目标点赞数
                    updateTargetLikesCount(targetId, targetType, true);
                    
                    result.put("success", true);
                    result.put("liked", true);
                    result.put("message", "点赞成功");
                } else {
                    result.put("success", false);
                    result.put("message", "点赞失败");
                }
            }
            
            // 统计目标当前点赞数
            int likesCount = likeMapper.countByTargetIdAndType(targetId, targetType);
            result.put("likesCount", likesCount);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "点赞操作失败: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * 检查用户是否点赞
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 是否点赞
     */
    @Override
    public boolean isLiked(String userId, String targetId, Integer targetType) {
        if (userId == null || userId.isEmpty()) {
            return false;
        }
        return likeMapper.exists(userId, targetId, targetType) > 0;
    }
    
    /**
     * 获取用户点赞的帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 帖子列表及分页信息
     */
    @Override
    public Map<String, Object> getUserLikedPosts(String userId, int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 查询用户点赞的帖子ID列表
        List<String> postIds = likeMapper.findTargetIdsByUserIdAndType(userId, 1);
        
        if (postIds.isEmpty()) {
            result.put("posts", new ArrayList<>());
            result.put("total", 0);
            result.put("page", page);
            result.put("size", size);
            return result;
        }
        
        // 分页处理
        List<String> pagedPostIds;
        if (offset >= postIds.size()) {
            pagedPostIds = new ArrayList<>();
        } else {
            int endIndex = Math.min(offset + size, postIds.size());
            pagedPostIds = postIds.subList(offset, endIndex);
        }
        
        // 查询帖子详情
        List<Post> posts = new ArrayList<>();
        for (String postId : pagedPostIds) {
            Post post = postService.getPostById(postId, userId);
            if (post != null) {
                posts.add(post);
            }
        }
        
        // 构建结果
        result.put("posts", posts);
        result.put("total", postIds.size());
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    /**
     * 批量检查用户是否点赞多个目标
     * @param userId 用户ID
     * @param targetIds 目标ID列表
     * @param targetType 目标类型
     * @return 点赞状态映射，key为目标ID，value为是否点赞
     */
    @Override
    public Map<String, Boolean> batchCheckLike(String userId, List<String> targetIds, Integer targetType) {
        if (userId == null || userId.isEmpty() || targetIds == null || targetIds.isEmpty()) {
            return new HashMap<>();
        }
        
        // 查询用户点赞的所有目标ID
        List<String> likedTargetIds = likeMapper.findTargetIdsByUserIdAndType(userId, targetType);
        
        // 构建点赞状态映射
        Map<String, Boolean> likeStatusMap = new HashMap<>();
        for (String targetId : targetIds) {
            likeStatusMap.put(targetId, likedTargetIds.contains(targetId));
        }
        
        return likeStatusMap;
    }
    
    /**
     * 更新目标点赞数
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @param isIncrease 是否增加点赞数
     */
    private void updateTargetLikesCount(String targetId, Integer targetType, boolean isIncrease) {
        if (targetType == 1) {
            // 更新帖子点赞数
            if (isIncrease) {
                postMapper.increaseLikes(targetId);
            } else {
                postMapper.decreaseLikes(targetId);
            }
        } else if (targetType == 2) {
            // 更新评论点赞数
            if (isIncrease) {
                commentMapper.increaseLikes(targetId);
            } else {
                commentMapper.decreaseLikes(targetId);
            }
        }
    }
} 