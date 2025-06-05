package com.milkstore.service;

import com.milkstore.dto.PostRequest;
import com.milkstore.entity.Post;

import java.util.List;
import java.util.Map;

/**
 * 帖子服务接口
 */
public interface PostService {
    
    /**
     * 分页获取帖子列表
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序方式（最新或最热）
     * @param userId 当前登录用户ID（用于判断是否点赞）
     * @return 帖子列表和总数
     */
    Map<String, Object> getPosts(int page, int size, String sortBy, String userId);
    
    /**
     * 获取帖子详情
     * @param postId 帖子ID
     * @param userId 当前登录用户ID（用于判断是否点赞）
     * @return 帖子详情
     */
    Post getPostById(String postId, String userId);
    
    /**
     * 获取用户帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页条数
     * @param currentUserId 当前登录用户ID（用于判断是否点赞）
     * @return 帖子列表和总数
     */
    Map<String, Object> getUserPosts(String userId, int page, int size, String currentUserId);
    
    /**
     * 获取商品相关帖子列表
     * @param productId 商品ID
     * @param page 页码
     * @param size 每页条数
     * @param userId 当前登录用户ID（用于判断是否点赞）
     * @return 帖子列表和总数
     */
    Map<String, Object> getProductPosts(Integer productId, int page, int size, String userId);
    
    /**
     * 创建帖子
     * @param request 帖子信息
     * @param userId 用户ID
     * @return 创建结果
     */
    boolean createPost(PostRequest request, String userId);
    
    /**
     * 更新帖子
     * @param postId 帖子ID
     * @param request 帖子信息
     * @param userId 用户ID
     * @return 更新结果
     */
    boolean updatePost(String postId, PostRequest request, String userId);
    
    /**
     * 删除帖子
     * @param postId 帖子ID
     * @param userId 用户ID
     * @return 删除结果
     */
    boolean deletePost(String postId, String userId);
} 