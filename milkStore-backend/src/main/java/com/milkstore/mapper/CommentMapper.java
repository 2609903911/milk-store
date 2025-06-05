package com.milkstore.mapper;

import com.milkstore.entity.Comment;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论数据访问接口
 */
@Repository
@Mapper
public interface CommentMapper {
    
    /**
     * 根据帖子ID获取评论列表
     * @param postId 帖子ID
     * @param offset 偏移量
     * @param limit 每页数量
     * @return 评论列表
     */
    @Select("SELECT c.*, u.nickname as user_nickname, u.avatar as user_avatar " +
           "FROM comments c " +
           "LEFT JOIN users u ON c.user_id = u.user_id " +
           "WHERE c.post_id = #{postId} AND c.status = 1 " +
           "ORDER BY c.create_time DESC " +
           "LIMIT #{limit} OFFSET #{offset}")
    @Results({
        @Result(property = "commentId", column = "comment_id"),
        @Result(property = "postId", column = "post_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "content", column = "content"),
        @Result(property = "parentId", column = "parent_id"),
        @Result(property = "replyToUserId", column = "reply_to_user_id"),
        @Result(property = "likesCount", column = "likes_count"),
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "status", column = "status"),
        @Result(property = "user.userId", column = "user_id"),
        @Result(property = "user.nickname", column = "user_nickname"),
        @Result(property = "user.avatar", column = "user_avatar")
    })
    List<Comment> findByPostId(@Param("postId") String postId, @Param("offset") int offset, @Param("limit") int limit);
    
    /**
     * 获取帖子评论总数
     * @param postId 帖子ID
     * @return 评论总数
     */
    @Select("SELECT COUNT(*) FROM comments WHERE post_id = #{postId} AND status = 1")
    int countByPostId(@Param("postId") String postId);
    
    /**
     * 插入评论
     * @param comment 评论信息
     * @return 影响行数
     */
    @Insert("INSERT INTO comments(comment_id, post_id, user_id, content, parent_id, reply_to_user_id, likes_count, create_time, status) " +
           "VALUES(#{commentId}, #{postId}, #{userId}, #{content}, #{parentId}, #{replyToUserId}, 0, NOW(), 1)")
    int insert(Comment comment);
    
    /**
     * 更新帖子评论数
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = #{postId} AND status = 1) WHERE post_id = #{postId}")
    int updatePostCommentCount(@Param("postId") String postId);
    
    /**
     * 逻辑删除评论（将状态设为0）
     * @param commentId 评论ID
     * @param userId 用户ID（确保只能删除自己的评论）
     * @return 影响行数
     */
    @Update("UPDATE comments SET status = 0 WHERE comment_id = #{commentId} AND user_id = #{userId}")
    int deleteComment(@Param("commentId") String commentId, @Param("userId") String userId);
    
    /**
     * 根据评论ID查询帖子ID
     * @param commentId 评论ID
     * @return 帖子ID
     */
    @Select("SELECT post_id FROM comments WHERE comment_id = #{commentId}")
    String findPostIdByCommentId(@Param("commentId") String commentId);
    
    /**
     * 增加评论点赞数
     * @param commentId 评论ID
     * @return 影响行数
     */
    @Update("UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = #{commentId}")
    int increaseLikes(@Param("commentId") String commentId);
    
    /**
     * 减少评论点赞数
     * @param commentId 评论ID
     * @return 影响行数
     */
    @Update("UPDATE comments SET likes_count = likes_count - 1 WHERE comment_id = #{commentId}")
    int decreaseLikes(@Param("commentId") String commentId);
} 