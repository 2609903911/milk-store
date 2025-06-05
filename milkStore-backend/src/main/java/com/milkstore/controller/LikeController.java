package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 点赞相关API控制器
 */
@RestController
@RequestMapping("/api")
public class LikeController {

    @Autowired
    private LikeService likeService;
    
    /**
     * 点赞/取消点赞
     * @param targetId 目标ID（帖子ID或评论ID）
     * @param userId 用户ID
     * @param targetType 目标类型（1-帖子，2-评论）
     * @return 点赞结果
     */
    @PostMapping("/{targetType}/{targetId}/like")
    public Result<Object> toggleLike(
            @PathVariable String targetId,
            @RequestParam String userId,
            @PathVariable Integer targetType) {
        try {
            // 验证参数
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            if (targetId == null || targetId.isEmpty()) {
                return Result.error(400, "目标ID不能为空");
            }
            
            if (targetType == null || (targetType != 1 && targetType != 2)) {
                return Result.error(400, "目标类型无效，必须是1(帖子)或2(评论)");
            }
            
            // 执行点赞/取消点赞操作
            Map<String, Object> result = likeService.toggleLike(userId, targetId, targetType);
            
            if ((boolean) result.get("success")) {
                return Result.success((String) result.get("message"), result);
            } else {
                return Result.error(500, (String) result.get("message"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "点赞操作失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取用户点赞的帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 帖子列表及分页信息
     */
    @GetMapping("/users/{userId}/liked-posts")
    public Result<Object> getUserLikedPosts(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // 验证参数
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            // 获取用户点赞的帖子列表
            Map<String, Object> result = likeService.getUserLikedPosts(userId, page, size);
            
            return Result.success("获取用户点赞的帖子成功", result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取用户点赞的帖子失败: " + e.getMessage());
        }
    }
    
    /**
     * 检查用户是否点赞
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 是否点赞
     */
    @GetMapping("/users/check-like")
    public Result<Object> checkLike(
            @RequestParam String userId,
            @RequestParam String targetId,
            @RequestParam Integer targetType) {
        try {
            // 验证参数
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            if (targetId == null || targetId.isEmpty()) {
                return Result.error(400, "目标ID不能为空");
            }
            
            if (targetType == null || (targetType != 1 && targetType != 2)) {
                return Result.error(400, "目标类型无效，必须是1(帖子)或2(评论)");
            }
            
            // 检查用户是否点赞
            boolean isLiked = likeService.isLiked(userId, targetId, targetType);
            
            Map<String, Object> data = new HashMap<>();
            data.put("liked", isLiked);
            
            return Result.success("检查点赞状态成功", data);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "检查点赞状态失败: " + e.getMessage());
        }
    }
    
    /**
     * 批量检查用户是否点赞多个目标
     * @param userId 用户ID
     * @param request 请求体，包含targetIds和targetType
     * @return 点赞状态映射
     */
    @PostMapping("/users/batch-check-like")
    public Result<Object> batchCheckLike(
            @RequestParam String userId,
            @RequestBody Map<String, Object> request) {
        try {
            // 验证参数
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            List<String> targetIds = (List<String>) request.get("targetIds");
            Integer targetType = (Integer) request.get("targetType");
            
            if (targetIds == null || targetIds.isEmpty()) {
                return Result.error(400, "目标ID列表不能为空");
            }
            
            if (targetType == null || (targetType != 1 && targetType != 2)) {
                return Result.error(400, "目标类型无效，必须是1(帖子)或2(评论)");
            }
            
            // 批量检查用户是否点赞
            Map<String, Boolean> likeStatusMap = likeService.batchCheckLike(userId, targetIds, targetType);
            
            return Result.success("批量检查点赞状态成功", likeStatusMap);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "批量检查点赞状态失败: " + e.getMessage());
        }
    }
} 