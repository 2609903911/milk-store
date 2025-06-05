package com.milkstore.service;

import com.milkstore.entity.Comment;
import java.util.Map;

/**
 * 评论服务接口
 */
public interface CommentService {
    
    /**
     * 获取帖子评论列表
     * @param postId 帖子ID
     * @param page 页码
     * @param size 每页数量
     * @return 评论列表及分页信息
     */
    Map<String, Object> getCommentsByPostId(String postId, int page, int size);
    
    /**
     * 添加评论
     * @param comment 评论信息
     * @return 添加结果
     */
    Map<String, Object> addComment(Comment comment);
    
    /**
     * 删除评论
     * @param commentId 评论ID
     * @param userId 用户ID
     * @return 删除结果
     */
    Map<String, Object> deleteComment(String commentId, String userId);
} 