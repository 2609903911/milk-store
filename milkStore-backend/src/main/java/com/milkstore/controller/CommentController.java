package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.Comment;
import com.milkstore.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 评论相关API控制器
 */
@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;
    
    /**
     * 获取帖子评论列表
     * @param postId 帖子ID
     * @param page 页码
     * @param size 每页数量
     * @return 评论列表及分页信息
     */
    @GetMapping("/posts/{postId}/comments")
    public Result<Object> getPostComments(
            @PathVariable String postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Map<String, Object> commentData = commentService.getCommentsByPostId(postId, page, size);
            return Result.success("获取评论成功", commentData);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取评论失败: " + e.getMessage());
        }
    }
    
    /**
     * 发表评论
     * @param comment 评论信息
     * @return 发表结果
     */
    @PostMapping("/comments")
    public Result<Object> addComment(@RequestBody Comment comment) {
        try {
            // 基本参数检查
            if (comment.getPostId() == null || comment.getPostId().isEmpty()) {
                return Result.error(400, "帖子ID不能为空");
            }
            
            if (comment.getUserId() == null || comment.getUserId().isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            if (comment.getContent() == null || comment.getContent().isEmpty()) {
                return Result.error(400, "评论内容不能为空");
            }
            
            // 调用服务添加评论
            Map<String, Object> result = commentService.addComment(comment);
            
            if ((boolean) result.get("success")) {
                return Result.success((String) result.get("message"), result.get("comment"));
            } else {
                return Result.error(500, (String) result.get("message"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "添加评论失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除评论
     * @param commentId 评论ID
     * @param userId 当前用户ID（从请求参数中获取，实际应该从会话中获取）
     * @return 删除结果
     */
    @DeleteMapping("/comments/{commentId}")
    public Result<Object> deleteComment(
            @PathVariable String commentId,
            @RequestParam String userId) {
        try {
            // 基本参数检查
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            // 调用服务删除评论
            Map<String, Object> result = commentService.deleteComment(commentId, userId);
            
            if ((boolean) result.get("success")) {
                return Result.success((String) result.get("message"), null);
            } else {
                return Result.error(500, (String) result.get("message"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "删除评论失败: " + e.getMessage());
        }
    }
} 