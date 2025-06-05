package com.milkstore.mapper;

import com.milkstore.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 帖子数据访问接口
 */
@Mapper
public interface PostMapper {
    
    /**
     * 根据条件分页查询帖子列表
     * @param offset 偏移量
     * @param limit 每页条数
     * @param sortBy 排序方式 (create_time或likes_count)
     * @return 帖子列表
     */
    @Select("<script>" +
            "SELECT post_id AS postId, user_id AS userId, product_id AS productId, " +
            "title, content, images AS imagesStr, likes_count AS likesCount, comments_count AS commentsCount, " +
            "create_time AS createTime, update_time AS updateTime, status, created_at AS createdAt " +
            "FROM posts " +
            "WHERE status = 1 " +
            "ORDER BY " +
            "<if test='sortBy == \"likes_count\"'>likes_count DESC</if>" +
            "<if test='sortBy != \"likes_count\"'>create_time DESC</if>" +
            " LIMIT #{offset}, #{limit}" +
            "</script>")
    List<Post> findPosts(int offset, int limit, String sortBy);
    
    /**
     * 查询帖子总数
     * @return 帖子总数
     */
    @Select("SELECT COUNT(*) FROM posts WHERE status = 1")
    int countPosts();
    
    /**
     * 根据帖子ID查询帖子
     * @param postId 帖子ID
     * @return 帖子信息
     */
    @Select("SELECT post_id AS postId, user_id AS userId, product_id AS productId, " +
            "title, content, images AS imagesStr, likes_count AS likesCount, comments_count AS commentsCount, " +
            "create_time AS createTime, update_time AS updateTime, status, created_at AS createdAt " +
            "FROM posts WHERE post_id = #{postId} AND status = 1")
    Post findById(String postId);
    
    /**
     * 根据用户ID查询帖子列表
     * @param userId 用户ID
     * @param offset 偏移量
     * @param limit 每页条数
     * @return 帖子列表
     */
    @Select("SELECT post_id AS postId, user_id AS userId, product_id AS productId, " +
            "title, content, images AS imagesStr, likes_count AS likesCount, comments_count AS commentsCount, " +
            "create_time AS createTime, update_time AS updateTime, status, created_at AS createdAt " +
            "FROM posts WHERE user_id = #{userId} AND status = 1 " +
            "ORDER BY create_time DESC LIMIT #{offset}, #{limit}")
    List<Post> findByUserId(String userId, int offset, int limit);
    
    /**
     * 根据用户ID查询帖子总数
     * @param userId 用户ID
     * @return 帖子总数
     */
    @Select("SELECT COUNT(*) FROM posts WHERE user_id = #{userId} AND status = 1")
    int countByUserId(String userId);
    
    /**
     * 根据商品ID查询帖子列表
     * @param productId 商品ID
     * @param offset 偏移量
     * @param limit 每页条数
     * @return 帖子列表
     */
    @Select("SELECT post_id AS postId, user_id AS userId, product_id AS productId, " +
            "title, content, images AS imagesStr, likes_count AS likesCount, comments_count AS commentsCount, " +
            "create_time AS createTime, update_time AS updateTime, status, created_at AS createdAt " +
            "FROM posts WHERE product_id = #{productId} AND status = 1 " +
            "ORDER BY create_time DESC LIMIT #{offset}, #{limit}")
    List<Post> findByProductId(Integer productId, int offset, int limit);
    
    /**
     * 根据商品ID查询帖子总数
     * @param productId 商品ID
     * @return 帖子总数
     */
    @Select("SELECT COUNT(*) FROM posts WHERE product_id = #{productId} AND status = 1")
    int countByProductId(Integer productId);
    
    /**
     * 插入帖子
     * @param post 帖子信息
     * @return 影响行数
     */
    @Insert("INSERT INTO posts (post_id, user_id, product_id, title, content, images, " +
            "likes_count, comments_count, create_time, update_time, status) " +
            "VALUES (#{postId}, #{userId}, #{productId}, #{title}, #{content}, #{imagesStr}, " +
            "#{likesCount}, #{commentsCount}, #{createTime}, #{updateTime}, #{status})")
    int insert(Post post);
    
    /**
     * 更新帖子
     * @param post 帖子信息
     * @return 影响行数
     */
    @Update("UPDATE posts SET title = #{title}, content = #{content}, images = #{imagesStr}, " +
            "update_time = #{updateTime} WHERE post_id = #{postId}")
    int update(Post post);
    
    /**
     * 删除帖子（逻辑删除）
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET status = 0 WHERE post_id = #{postId}")
    int delete(String postId);
    
    /**
     * 增加点赞数
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = #{postId}")
    int increaseLikes(String postId);
    
    /**
     * 减少点赞数
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET likes_count = likes_count - 1 WHERE post_id = #{postId}")
    int decreaseLikes(String postId);
    
    /**
     * 增加评论数
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET comments_count = comments_count + 1 WHERE post_id = #{postId}")
    int increaseComments(String postId);
    
    /**
     * 减少评论数
     * @param postId 帖子ID
     * @return 影响行数
     */
    @Update("UPDATE posts SET comments_count = comments_count - 1 WHERE post_id = #{postId}")
    int decreaseComments(String postId);
} 