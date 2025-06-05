package com.milkstore.mapper;

import com.milkstore.entity.UserFollow;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用户关注数据访问接口
 */
@Mapper
public interface UserFollowMapper {
    
    /**
     * 插入关注记录
     * @param userFollow 关注记录
     * @return 影响行数
     */
    int insert(UserFollow userFollow);
    
    /**
     * 检查是否已关注
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 关注记录数量
     */
    int isFollowing(@Param("followerId") String followerId, @Param("followedId") String followedId);
    
    /**
     * 取消关注（软删除）
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 影响行数
     */
    int cancelFollow(@Param("followerId") String followerId, @Param("followedId") String followedId);
    
    /**
     * 恢复关注（恢复软删除的记录）
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 影响行数
     */
    int resumeFollow(@Param("followerId") String followerId, @Param("followedId") String followedId);
    
    /**
     * 查询用户关注列表
     * @param userId 用户ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 关注列表
     */
    List<UserFollow> findFollowingList(@Param("userId") String userId, @Param("offset") int offset, @Param("limit") int limit);
    
    /**
     * 查询用户粉丝列表
     * @param userId 用户ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 粉丝列表
     */
    List<UserFollow> findFollowersList(@Param("userId") String userId, @Param("offset") int offset, @Param("limit") int limit);
    
    /**
     * 统计用户关注数
     * @param userId 用户ID
     * @return 关注数量
     */
    int countFollowing(@Param("userId") String userId);
    
    /**
     * 统计用户粉丝数
     * @param userId 用户ID
     * @return 粉丝数量
     */
    int countFollowers(@Param("userId") String userId);
    
    /**
     * 批量检查是否关注
     * @param followerId 关注者ID
     * @param followedIds 被关注者ID列表
     * @return 已关注的用户ID列表
     */
    List<String> batchCheckFollowing(@Param("followerId") String followerId, @Param("followedIds") List<String> followedIds);
    
    /**
     * 物理删除关注记录
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 影响行数
     */
    int deleteFollow(@Param("followerId") String followerId, @Param("followedId") String followedId);
    
    /**
     * 获取关注记录
     * @param followerId 关注者ID
     * @param followedId 被关注者ID
     * @return 关注记录
     */
    UserFollow getFollow(@Param("followerId") String followerId, @Param("followedId") String followedId);
    
    /**
     * 更新用户关注数
     * @param userId 用户ID
     * @param count 关注数
     * @return 影响行数
     */
    int updateFollowingCount(@Param("userId") String userId, @Param("count") int count);
    
    /**
     * 更新用户粉丝数
     * @param userId 用户ID
     * @param count 粉丝数
     * @return 影响行数
     */
    int updateFollowersCount(@Param("userId") String userId, @Param("count") int count);
    
    /**
     * 增加用户关注数
     * @param userId 用户ID
     * @return 影响行数
     */
    int increaseFollowingCount(@Param("userId") String userId);
    
    /**
     * 减少用户关注数
     * @param userId 用户ID
     * @return 影响行数
     */
    int decreaseFollowingCount(@Param("userId") String userId);
    
    /**
     * 增加用户粉丝数
     * @param userId 用户ID
     * @return 影响行数
     */
    int increaseFollowersCount(@Param("userId") String userId);
    
    /**
     * 减少用户粉丝数
     * @param userId 用户ID
     * @return 影响行数
     */
    int decreaseFollowersCount(@Param("userId") String userId);
}
