package com.milkstore.service.impl;

import com.milkstore.dto.PostRequest;
import com.milkstore.entity.Post;
import com.milkstore.mapper.PostMapper;
import com.milkstore.mapper.UserMapper;
import com.milkstore.mapper.ProductMapper;
import com.milkstore.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 帖子服务实现类
 */
@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostMapper postMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private ProductMapper productMapper;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public Map<String, Object> getPosts(int page, int size, String sortBy, String userId) {
        int offset = (page - 1) * size;
        
        // 按创建时间或点赞数排序
        String orderBy = "create_time";
        if ("hot".equals(sortBy)) {
            orderBy = "likes_count";
        }
        
        // 查询帖子列表
        List<Post> posts = postMapper.findPosts(offset, size, orderBy);
        
        // 填充帖子相关信息（用户信息、商品信息、是否点赞）
        enrichPosts(posts, userId);
        
        // 查询帖子总数
        int total = postMapper.countPosts();
        
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    @Override
    public Post getPostById(String postId, String userId) {
        // 查询帖子信息
        Post post = postMapper.findById(postId);
        if (post == null) {
            return null;
        }
        
        // 填充帖子相关信息（用户信息、商品信息、是否点赞）
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        enrichPosts(posts, userId);
        
        return post;
    }
    
    @Override
    public Map<String, Object> getUserPosts(String userId, int page, int size, String currentUserId) {
        int offset = (page - 1) * size;
        
        // 查询用户帖子列表
        List<Post> posts = postMapper.findByUserId(userId, offset, size);
        
        // 填充帖子相关信息（用户信息、商品信息、是否点赞）
        enrichPosts(posts, currentUserId);
        
        // 查询用户帖子总数
        int total = postMapper.countByUserId(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    @Override
    public Map<String, Object> getProductPosts(Integer productId, int page, int size, String userId) {
        int offset = (page - 1) * size;
        
        // 查询商品相关帖子列表
        List<Post> posts = postMapper.findByProductId(productId, offset, size);
        
        // 填充帖子相关信息（用户信息、商品信息、是否点赞）
        enrichPosts(posts, userId);
        
        // 查询商品相关帖子总数
        int total = postMapper.countByProductId(productId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        
        return result;
    }
    
    @Override
    @Transactional
    public boolean createPost(PostRequest request, String userId) {
        // 生成帖子ID
        String postId = "post_" + System.currentTimeMillis();
        
        // 创建帖子对象
        Post post = new Post();
        post.setPostId(postId);
        post.setUserId(userId);
        post.setProductId(request.getProductId());
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImages(request.getImages()); // 这里会自动设置imagesStr
        post.setLikesCount(0);
        post.setCommentsCount(0);
        post.setCreateTime(new Date());
        post.setUpdateTime(new Date());
        post.setStatus(1);
        
        // 插入帖子
        int result = postMapper.insert(post);
        
        return result > 0;
    }
    
    @Override
    @Transactional
    public boolean updatePost(String postId, PostRequest request, String userId) {
        // 验证帖子是否存在以及是否属于该用户
        Post existingPost = postMapper.findById(postId);
        if (existingPost == null || !existingPost.getUserId().equals(userId)) {
            return false;
        }
        
        // 更新帖子信息
        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        existingPost.setImages(request.getImages()); // 这里会自动设置imagesStr
        existingPost.setUpdateTime(new Date());
        
        int result = postMapper.update(existingPost);
        
        return result > 0;
    }
    
    @Override
    @Transactional
    public boolean deletePost(String postId, String userId) {
        // 验证帖子是否存在以及是否属于该用户
        Post existingPost = postMapper.findById(postId);
        if (existingPost == null || !existingPost.getUserId().equals(userId)) {
            return false;
        }
        
        // 删除帖子（逻辑删除）
        int result = postMapper.delete(postId);
        
        return result > 0;
    }
    
    /**
     * 填充帖子相关信息（用户信息、商品信息、是否点赞）
     * @param posts 帖子列表
     * @param userId 当前用户ID
     */
    private void enrichPosts(List<Post> posts, String userId) {
        if (posts == null || posts.isEmpty()) {
            return;
        }
        
        // 获取帖子ID列表
        List<String> postIds = posts.stream()
                .map(Post::getPostId)
                .collect(Collectors.toList());
        
        // 查询是否点赞
        Map<String, Boolean> likedMap = new HashMap<>();
        
        if (userId != null && !userId.isEmpty()) {
            String likeSql = "SELECT target_id FROM likes WHERE user_id = ? AND target_type = 1 AND target_id IN (" +
                    String.join(",", Collections.nCopies(postIds.size(), "?")) +
                    ")";
            
            Object[] params = new Object[postIds.size() + 1];
            params[0] = userId;
            System.arraycopy(postIds.toArray(), 0, params, 1, postIds.size());
            
            jdbcTemplate.query(
                likeSql,
                params,
                (rs, rowNum) -> {
                    String postId = rs.getString("target_id");
                    likedMap.put(postId, true);
                    return null;
                }
            );
        }
        
        // 填充帖子信息
        for (Post post : posts) {
            // 填充用户信息
            post.setUser(userMapper.findById(post.getUserId()));
            
            // 填充商品信息
            post.setProduct(productMapper.findById(post.getProductId()));
            
            // 填充是否点赞
            post.setIsLiked(likedMap.getOrDefault(post.getPostId(), false));
        }
    }
} 