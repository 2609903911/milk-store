package com.milkstore.service.impl;

import com.milkstore.entity.Comment;
import com.milkstore.entity.User;
import com.milkstore.mapper.CommentMapper;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 评论服务实现类
 */
@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public Map<String, Object> getCommentsByPostId(String postId, int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 获取评论列表
        List<Comment> comments = commentMapper.findByPostId(postId, offset, size);
        
        // 获取评论总数
        int total = commentMapper.countByPostId(postId);
        
        // 处理评论的额外信息（被回复用户信息等）
        for (Comment comment : comments) {
            if (comment.getReplyToUserId() != null && !comment.getReplyToUserId().isEmpty()) {
                User replyToUser = userMapper.findById(comment.getReplyToUserId());
                comment.setReplyToUser(replyToUser);
            }
        }
        
        // 构建分页结果
        result.put("comments", comments);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        result.put("pages", (total + size - 1) / size); // 总页数
        
        return result;
    }
    
    @Override
    @Transactional
    public Map<String, Object> addComment(Comment comment) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 设置初始值
            // 生成评论ID (使用更短的格式)
            String commentId = "c" + System.currentTimeMillis() % 10000000 + "" + (int)(Math.random() * 10000);
            comment.setCommentId(commentId);
            comment.setLikesCount(0);
            comment.setStatus(1); // 正常状态
            comment.setCreateTime(new Date());
            
            // 插入评论
            int rows = commentMapper.insert(comment);
            
            if (rows > 0) {
                // 更新帖子评论数
                commentMapper.updatePostCommentCount(comment.getPostId());
                
                // 如果是回复评论，获取被回复用户信息
                if (comment.getReplyToUserId() != null && !comment.getReplyToUserId().isEmpty()) {
                    User replyToUser = userMapper.findById(comment.getReplyToUserId());
                    comment.setReplyToUser(replyToUser);
                }
                
                // 获取评论用户信息
                User user = userMapper.findById(comment.getUserId());
                comment.setUser(user);
                
                result.put("success", true);
                result.put("message", "评论成功");
                result.put("comment", comment);
            } else {
                result.put("success", false);
                result.put("message", "评论失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "评论失败: " + e.getMessage());
        }
        
        return result;
    }
    
    @Override
    @Transactional
    public Map<String, Object> deleteComment(String commentId, String userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取评论所属的帖子ID
            String postId = commentMapper.findPostIdByCommentId(commentId);
            
            if (postId == null) {
                result.put("success", false);
                result.put("message", "评论不存在");
                return result;
            }
            
            // 删除评论
            int rows = commentMapper.deleteComment(commentId, userId);
            
            if (rows > 0) {
                // 更新帖子评论数
                commentMapper.updatePostCommentCount(postId);
                
                result.put("success", true);
                result.put("message", "删除评论成功");
            } else {
                result.put("success", false);
                result.put("message", "删除评论失败，可能没有权限");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "删除评论失败: " + e.getMessage());
        }
        
        return result;
    }
} 