package com.milkstore.service.impl;

import com.milkstore.entity.User;
import com.milkstore.entity.UserFollow;
import com.milkstore.mapper.UserFollowMapper;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.UserFollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 用户关注服务实现类
 */
@Service
public class UserFollowServiceImpl implements UserFollowService {

    @Autowired
    private UserFollowMapper userFollowMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    /**
     * 关注用户
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 操作结果
     */
    @Override
    @Transactional
    public Map<String, Object> followUser(String followerId, String followedId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 不能关注自己
            if (followerId.equals(followedId)) {
                result.put("success", false);
                result.put("message", "不能关注自己");
                return result;
            }
            
            // 检查用户是否存在
            User follower = userMapper.findById(followerId);
            User followed = userMapper.findById(followedId);
            
            if (follower == null || followed == null) {
                result.put("success", false);
                result.put("message", "用户不存在");
                return result;
            }
            
            // 检查是否已关注
            int isFollowing = userFollowMapper.isFollowing(followerId, followedId);
            
            if (isFollowing > 0) {
                result.put("success", false);
                result.put("message", "已经关注该用户");
                result.put("isFollowing", true);
                return result;
            }
            
            // 检查是否曾经关注过（软删除）
            UserFollow userFollow = new UserFollow();
            userFollow.setFollowerId(followerId);
            userFollow.setFollowedId(followedId);
            
            // 尝试恢复关注
            int resumeRows = userFollowMapper.resumeFollow(followerId, followedId);
            
            if (resumeRows == 0) {
                // 没有恢复记录，创建新的关注关系
                userFollowMapper.insert(userFollow);
            }
            
            // 更新关注数和粉丝数
            userMapper.increaseFollowingCount(followerId);
            userMapper.increaseFollowersCount(followedId);
            
            result.put("success", true);
            result.put("message", "关注成功");
            result.put("isFollowing", true);
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "关注失败: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * 取消关注
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 操作结果
     */
    @Override
    @Transactional
    public Map<String, Object> unfollowUser(String followerId, String followedId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 检查是否已关注
            int isFollowing = userFollowMapper.isFollowing(followerId, followedId);
            
            if (isFollowing == 0) {
                result.put("success", false);
                result.put("message", "未关注该用户");
                result.put("isFollowing", false);
                return result;
            }
            
            // 取消关注（软删除）
            int rows = userFollowMapper.cancelFollow(followerId, followedId);
            
            if (rows > 0) {
                // 更新关注数和粉丝数
                userMapper.decreaseFollowingCount(followerId);
                userMapper.decreaseFollowersCount(followedId);
                
                result.put("success", true);
                result.put("message", "取消关注成功");
                result.put("isFollowing", false);
            } else {
                result.put("success", false);
                result.put("message", "取消关注失败");
                result.put("isFollowing", true);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "取消关注失败: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * 检查是否已关注
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 是否已关注
     */
    @Override
    public boolean isFollowing(String followerId, String followedId) {
        if (followerId == null || followedId == null) {
            return false;
        }
        return userFollowMapper.isFollowing(followerId, followedId) > 0;
    }
    
    /**
     * 获取用户关注列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 关注列表及分页信息
     */
    @Override
    public Map<String, Object> getFollowingList(String userId, int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 查询关注列表
        List<UserFollow> followingList = userFollowMapper.findFollowingList(userId, offset, size);
        
        // 转换为用户信息列表
        List<Map<String, Object>> userList = new ArrayList<>();
        for (UserFollow follow : followingList) {
            if (follow.getFollowed() != null) {
                Map<String, Object> userInfo = new HashMap<>();
                User user = follow.getFollowed();
                userInfo.put("userId", user.getUserId());
                userInfo.put("nickname", user.getNickname());
                userInfo.put("avatar", user.getAvatar());
                userInfo.put("bio", user.getBio());
                userInfo.put("followingCount", user.getFollowingCount());
                userInfo.put("followersCount", user.getFollowersCount());
                userInfo.put("isFollowing", true); // 已关注
                userInfo.put("followTime", follow.getCreateTime());
                userList.add(userInfo);
            }
        }
        
        // 统计总数
        int total = userFollowMapper.countFollowing(userId);
        
        // 构建结果
        result.put("users", userList);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    /**
     * 获取用户粉丝列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页数量
     * @return 粉丝列表及分页信息
     */
    @Override
    public Map<String, Object> getFollowersList(String userId, int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        // 计算偏移量
        int offset = (page - 1) * size;
        
        // 查询粉丝列表
        List<UserFollow> followersList = userFollowMapper.findFollowersList(userId, offset, size);
        
        // 获取粉丝ID列表，用于批量检查当前用户是否关注了这些粉丝
        List<String> followerIds = followersList.stream()
                .map(UserFollow::getFollowerId)
                .collect(Collectors.toList());
        
        // 批量检查当前用户是否关注了这些粉丝
        Map<String, Boolean> followingMap = new HashMap<>();
        if (!followerIds.isEmpty()) {
            List<String> followingIds = userFollowMapper.batchCheckFollowing(userId, followerIds);
            for (String id : followerIds) {
                followingMap.put(id, followingIds.contains(id));
            }
        }
        
        // 转换为用户信息列表
        List<Map<String, Object>> userList = new ArrayList<>();
        for (UserFollow follow : followersList) {
            if (follow.getFollower() != null) {
                Map<String, Object> userInfo = new HashMap<>();
                User user = follow.getFollower();
                userInfo.put("userId", user.getUserId());
                userInfo.put("nickname", user.getNickname());
                userInfo.put("avatar", user.getAvatar());
                userInfo.put("bio", user.getBio());
                userInfo.put("followingCount", user.getFollowingCount());
                userInfo.put("followersCount", user.getFollowersCount());
                userInfo.put("isFollowing", followingMap.getOrDefault(user.getUserId(), false)); // 是否互相关注
                userInfo.put("followTime", follow.getCreateTime());
                userList.add(userInfo);
            }
        }
        
        // 统计总数
        int total = userFollowMapper.countFollowers(userId);
        
        // 构建结果
        result.put("users", userList);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    /**
     * 批量检查是否关注
     * @param followerId 关注者ID
     * @param followedIds 被关注者ID列表
     * @return 关注状态映射，key为被关注者ID，value为是否关注
     */
    @Override
    public Map<String, Boolean> batchCheckFollowing(String followerId, List<String> followedIds) {
        if (followerId == null || followedIds == null || followedIds.isEmpty()) {
            return new HashMap<>();
        }
        
        // 查询已关注的用户ID列表
        List<String> followingIds = userFollowMapper.batchCheckFollowing(followerId, followedIds);
        
        // 构建关注状态映射
        Map<String, Boolean> followingMap = new HashMap<>();
        for (String id : followedIds) {
            followingMap.put(id, followingIds.contains(id));
        }
        
        return followingMap;
    }
    
    /**
     * 同步用户关注数和粉丝数
     * @param userId 用户ID
     */
    @Override
    @Transactional
    public void syncFollowCounts(String userId) {
        // 统计实际关注数
        int followingCount = userFollowMapper.countFollowing(userId);
        // 统计实际粉丝数
        int followersCount = userFollowMapper.countFollowers(userId);
        
        // 更新用户关注数和粉丝数
        userMapper.setFollowingCount(userId, followingCount);
        userMapper.setFollowersCount(userId, followersCount);
    }
} 