package com.milkstore.mapper;

import com.milkstore.entity.Like;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 点赞数据访问接口
 */
@Repository
@Mapper
public interface LikeMapper {
    
    /**
     * 添加点赞
     * @param like 点赞信息
     * @return 影响行数
     */
    @Insert("INSERT INTO likes(like_id, user_id, target_id, target_type, create_time) " +
            "VALUES(#{likeId}, #{userId}, #{targetId}, #{targetType}, #{createTime})")
    int insert(Like like);
    
    /**
     * 取消点赞
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 影响行数
     */
    @Delete("DELETE FROM likes WHERE user_id = #{userId} AND target_id = #{targetId} AND target_type = #{targetType}")
    int delete(@Param("userId") String userId, @Param("targetId") String targetId, @Param("targetType") Integer targetType);
    
    /**
     * 查询用户是否点赞
     * @param userId 用户ID
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 是否点赞
     */
    @Select("SELECT COUNT(*) FROM likes WHERE user_id = #{userId} AND target_id = #{targetId} AND target_type = #{targetType}")
    int exists(@Param("userId") String userId, @Param("targetId") String targetId, @Param("targetType") Integer targetType);
    
    /**
     * 获取用户点赞列表
     * @param userId 用户ID
     * @param targetType 目标类型
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 点赞列表
     */
    @Select("SELECT l.*, u.nickname, u.avatar " +
            "FROM likes l " +
            "LEFT JOIN users u ON l.user_id = u.user_id " +
            "WHERE l.user_id = #{userId} AND l.target_type = #{targetType} " +
            "ORDER BY l.create_time DESC " +
            "LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "likeId", column = "like_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "targetId", column = "target_id"),
        @Result(property = "targetType", column = "target_type"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "user.userId", column = "user_id"),
        @Result(property = "user.nickname", column = "nickname"),
        @Result(property = "user.avatar", column = "avatar")
    })
    List<Like> findByUserIdAndType(@Param("userId") String userId, @Param("targetType") Integer targetType, 
                                  @Param("offset") int offset, @Param("limit") int limit);
    
    /**
     * 获取用户点赞总数
     * @param userId 用户ID
     * @param targetType 目标类型
     * @return 点赞总数
     */
    @Select("SELECT COUNT(*) FROM likes WHERE user_id = #{userId} AND target_type = #{targetType}")
    int countByUserIdAndType(@Param("userId") String userId, @Param("targetType") Integer targetType);
    
    /**
     * 获取目标被点赞数量
     * @param targetId 目标ID
     * @param targetType 目标类型
     * @return 被点赞数量
     */
    @Select("SELECT COUNT(*) FROM likes WHERE target_id = #{targetId} AND target_type = #{targetType}")
    int countByTargetIdAndType(@Param("targetId") String targetId, @Param("targetType") Integer targetType);
    
    /**
     * 查询点赞的目标ID列表
     * @param userId 用户ID
     * @param targetType 目标类型
     * @return 目标ID列表
     */
    @Select("SELECT target_id FROM likes WHERE user_id = #{userId} AND target_type = #{targetType}")
    List<String> findTargetIdsByUserIdAndType(@Param("userId") String userId, @Param("targetType") Integer targetType);
} 