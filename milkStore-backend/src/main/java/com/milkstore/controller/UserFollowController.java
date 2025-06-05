package com.milkstore.controller;

import com.milkstore.service.UserFollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户关注控制器
 */
@RestController
@RequestMapping("/api/follow")
public class UserFollowController {

    @Autowired
    private UserFollowService userFollowService;

    /**
     * 关注用户
     * @param followedId 被关注用户ID
     * @param followerId 关注者ID
     * @return 操作结果
     */
    @PostMapping("/{followedId}")
    public Map<String, Object> followUser(@PathVariable String followedId, @RequestParam("follower_id") String followerId) {
        return userFollowService.followUser(followerId, followedId);
    }

    /**
     * 取消关注
     * @param followedId 被关注用户ID
     * @param followerId 关注者ID
     * @return 操作结果
     */
    @DeleteMapping("/{followedId}")
    public Map<String, Object> unfollowUser(@PathVariable String followedId, @RequestParam("follower_id") String followerId) {
        return userFollowService.unfollowUser(followerId, followedId);
    }

    /**
     * 检查是否已关注
     * @param followedId 被关注用户ID
     * @param followerId 关注者ID
     * @return 关注状态
     */
    @GetMapping("/check/{followedId}")
    public Map<String, Object> checkFollowStatus(@PathVariable String followedId, @RequestParam("follower_id") String followerId) {
        Map<String, Object> result = new HashMap<>();
        boolean isFollowing = userFollowService.isFollowing(followerId, followedId);
        result.put("code", 200);
        result.put("message", "查询成功");
        
        Map<String, Boolean> data = new HashMap<>();
        data.put("isFollowing", isFollowing);
        result.put("data", data);
        
        return result;
    }

    /**
     * 批量检查是否已关注
     * @param followedIds 被关注用户ID列表
     * @param followerId 关注者ID
     * @return 关注状态映射
     */
    @PostMapping("/check/batch")
    public Map<String, Object> batchCheckFollowStatus(@RequestBody List<String> followedIds, @RequestParam("follower_id") String followerId) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Boolean> followingMap = userFollowService.batchCheckFollowing(followerId, followedIds);
        
        result.put("code", 200);
        result.put("message", "查询成功");
        
        Map<String, Object> data = new HashMap<>();
        data.put("followingMap", followingMap);
        result.put("data", data);
        
        return result;
    }

    /**
     * 获取用户关注列表
     * @param userId 目标用户ID
     * @param page 页码
     * @param size 每页数量
     * @param currentUserId 当前用户ID，用于判断是否关注了列表中的用户（可选）
     * @return 关注列表及分页信息
     */
    @GetMapping("/following/{userId}")
    public Map<String, Object> getFollowingList(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(value = "current_user_id", required = false) String currentUserId) {
        
        Map<String, Object> result = userFollowService.getFollowingList(userId, page, size);
        if (currentUserId != null && !currentUserId.isEmpty()) {
            // 如果提供了当前用户ID，可以标记列表中哪些用户已被当前用户关注
            // 这里需要在service中增加相应的逻辑
        }
        return result;
    }

    /**
     * 获取用户粉丝列表
     * @param userId 目标用户ID
     * @param page 页码
     * @param size 每页数量
     * @param currentUserId 当前用户ID，用于判断是否关注了列表中的用户（可选）
     * @return 粉丝列表及分页信息
     */
    @GetMapping("/followers/{userId}")
    public Map<String, Object> getFollowersList(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(value = "current_user_id", required = false) String currentUserId) {
        
        Map<String, Object> result = userFollowService.getFollowersList(userId, page, size);
        if (currentUserId != null && !currentUserId.isEmpty()) {
            // 如果提供了当前用户ID，可以标记列表中哪些用户已被当前用户关注
            // 这里需要在service中增加相应的逻辑
        }
        return result;
    }
} 