package com.milkstore.service;

import java.util.List;
import java.util.Map;

/**
 * 用户关注服务接口
 */
public interface UserFollowService {
    
    /**
     * 关注用户
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 操作结果
     */
    Map<String, Object> followUser(String followerId, String followedId);
    
    /**
     * 取消关注
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 操作结果
     */
    Map<String, Object> unfollowUser(String followerId, String followedId);
    
    /**
     * 检查是否已关注
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 是否已关注
     */
    boolean isFollowing(String followerId, String followedId);
    
    /**
     * 获取用户关注列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 关注列表及分页信息
     */
    Map<String, Object> getFollowingList(String userId, int page, int size);
    
    /**
     * 获取用户粉丝列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 粉丝列表及分页信息
     */
    Map<String, Object> getFollowersList(String userId, int page, int size);
    
    /**
     * 批量检查是否关注
     * @param followerId 关注者ID
     * @param followedIds 被关注者ID列表
     * @return 关注状态映射，key为被关注者ID，value为是否关注
     */
    Map<String, Boolean> batchCheckFollowing(String followerId, List<String> followedIds);
    
    /**
     * 同步用户关注数和粉丝数
     * @param userId 用户ID
     */
    void syncFollowCounts(String userId);
} 