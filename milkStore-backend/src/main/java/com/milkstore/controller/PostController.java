package com.milkstore.controller;

import com.milkstore.dto.PostRequest;
import com.milkstore.entity.Post;
import com.milkstore.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 帖子前端控制器
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;
    
    @Value("${file.upload.path:/upload/images}")
    private String fileUploadPath;
    
    /**
     * 分页获取帖子列表
     * @param page 页码
     * @param size 每页条数
     * @param sortBy 排序方式（最新或最热）
     * @param userId 当前登录用户ID
     * @return 帖子列表和分页信息
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sortBy,
            @RequestParam(required = false) String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> result = postService.getPosts(page, size, sortBy, userId);
            
            response.put("code", 200);
            response.put("message", "获取帖子列表成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取帖子列表失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取帖子详情
     * @param postId 帖子ID
     * @param userId 当前登录用户ID
     * @return 帖子详情
     */
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPostDetail(
            @PathVariable String postId,
            @RequestParam(required = false) String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Post post = postService.getPostById(postId, userId);
            
            if (post == null) {
                response.put("code", 404);
                response.put("message", "帖子不存在");
                response.put("data", null);
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("code", 200);
            response.put("message", "获取帖子详情成功");
            response.put("data", post);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取帖子详情失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取用户发布的帖子
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页条数
     * @param currentUserId 当前登录用户ID
     * @return 用户帖子列表和分页信息
     */
    @GetMapping("/users/{userId}/posts")
    public ResponseEntity<Map<String, Object>> getUserPosts(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String currentUserId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> result = postService.getUserPosts(userId, page, size, currentUserId);
            
            response.put("code", 200);
            response.put("message", "获取用户帖子成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取用户帖子失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取商品相关帖子
     * @param productId 商品ID
     * @param page 页码
     * @param size 每页条数
     * @param userId 当前登录用户ID
     * @return 商品相关帖子列表和分页信息
     */
    @GetMapping("/products/{productId}/posts")
    public ResponseEntity<Map<String, Object>> getProductPosts(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> result = postService.getProductPosts(productId, page, size, userId);
            
            response.put("code", 200);
            response.put("message", "获取商品相关帖子成功");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "获取商品相关帖子失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 上传帖子图片
     * @param files 图片文件列表
     * @return 上传结果，包含图片URL列表
     */
    @PostMapping("/upload/images")
    public ResponseEntity<Map<String, Object>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            
            if (files == null || files.length == 0) {
                response.put("code", 400);
                response.put("message", "请选择要上传的图片");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // 创建上传目录 (添加post子目录)
            String postUploadPath = fileUploadPath + "/post";
            File uploadDir = new File(postUploadPath);
            if (!uploadDir.exists()) {
                boolean dirCreated = uploadDir.mkdirs();
                if (!dirCreated) {
                    response.put("code", 500);
                    response.put("message", "无法创建上传目录");
                    response.put("data", null);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            
            // 生成日期子文件夹
            String dateFolder = new SimpleDateFormat("yyyyMMdd").format(new Date());
            File dateDirFile = new File(uploadDir, dateFolder);
            if (!dateDirFile.exists()) {
                boolean dateDirCreated = dateDirFile.mkdir();
                if (!dateDirCreated) {
                    response.put("code", 500);
                    response.put("message", "无法创建日期目录");
                    response.put("data", null);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            
            // 处理上传的文件
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                // 获取文件名和扩展名
                String originalFilename = file.getOriginalFilename();
                
                // 获取文件扩展名
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                } else {
                    // 如果没有扩展名，默认使用.jpg
                    fileExtension = ".jpg";
                }
                
                // 验证文件类型
                if (!isValidImageExtension(fileExtension)) {
                    continue;
                }
                
                // 生成唯一文件名
                String newFileName = "post_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
                File targetFile = new File(dateDirFile, newFileName);
                
                // 保存文件
                try {
                    // 使用transferTo方法保存文件
                    file.transferTo(targetFile);
                } catch (IOException e) {
                    e.printStackTrace();
                    continue;
                }
                
                // 检查文件是否成功保存
                if (!targetFile.exists()) {
                    continue;
                }
                
                
                // 生成访问URL
                String imageUrl = "/uploads/post/" + dateFolder + "/" + newFileName;
                imageUrls.add(imageUrl);
            }
            
            if (imageUrls.isEmpty()) {
                response.put("code", 400);
                response.put("message", "没有成功上传任何图片");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            response.put("code", 200);
            response.put("message", "图片上传成功");
            response.put("data", imageUrls);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("code", 500);
            response.put("message", "图片上传失败: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 访问上传的帖子图片
     * @param dateFolder 日期文件夹
     * @param filename 文件名
     * @return 图片资源
     */
    @GetMapping("/uploads/post/{dateFolder}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> servePostImage(
            @PathVariable String dateFolder,
            @PathVariable String filename) {
        try {
            
            // 拼接完整的文件路径
            String imagePath = fileUploadPath + "/post/" + dateFolder;
            File file = new File(imagePath, filename);
            
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            // 将文件转换为资源
            Resource resource = new FileSystemResource(file);
            
            if (resource.exists() && resource.isReadable()) {
                // 确定内容类型
                String contentType = determineContentType(filename);
                
                // 不设置Content-Disposition头，以允许浏览器直接显示图片
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 根据文件名确定内容类型
     * @param filename 文件名
     * @return 内容类型
     */
    private String determineContentType(String filename) {
        if (filename == null) {
            return "application/octet-stream";
        }
        
        filename = filename.toLowerCase();
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else if (filename.endsWith(".webp")) {
            return "image/webp";
        } else if (filename.endsWith(".bmp")) {
            return "image/bmp";
        } else {
            return "application/octet-stream";
        }
    }
    
    /**
     * 验证文件扩展名是否为有效的图片类型
     * @param extension 文件扩展名
     * @return 是否为有效的图片类型
     */
    private boolean isValidImageExtension(String extension) {
        if (extension == null) {
            return false;
        }
        
        extension = extension.toLowerCase();
        return extension.equals(".jpg") || 
               extension.equals(".jpeg") || 
               extension.equals(".png") || 
               extension.equals(".gif") || 
               extension.equals(".webp") || 
               extension.equals(".bmp");
    }
    
    /**
     * 创建帖子
     * @param request 帖子信息
     * @param userId 用户ID
     * @return 创建结果
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestBody PostRequest request,
            @RequestParam String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean result = postService.createPost(request, userId);
            
            if (result) {
                response.put("code", 200);
                response.put("message", "发布帖子成功");
                response.put("data", true);
                
                return ResponseEntity.ok(response);
            } else {
                response.put("code", 400);
                response.put("message", "发布帖子失败");
                response.put("data", false);
                
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "发布帖子失败: " + e.getMessage());
            response.put("data", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 更新帖子
     * @param postId 帖子ID
     * @param request 帖子信息
     * @param userId 用户ID
     * @return 更新结果
     */
    @PutMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable String postId,
            @RequestBody PostRequest request,
            @RequestParam String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean result = postService.updatePost(postId, request, userId);
            
            if (result) {
                response.put("code", 200);
                response.put("message", "更新帖子成功");
                response.put("data", true);
                
                return ResponseEntity.ok(response);
            } else {
                response.put("code", 400);
                response.put("message", "更新帖子失败，可能是帖子不存在或您没有权限修改");
                response.put("data", false);
                
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "更新帖子失败: " + e.getMessage());
            response.put("data", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 删除帖子
     * @param postId 帖子ID
     * @param userId 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @PathVariable String postId,
            @RequestParam String userId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean result = postService.deletePost(postId, userId);
            
            if (result) {
                response.put("code", 200);
                response.put("message", "删除帖子成功");
                response.put("data", true);
                
                return ResponseEntity.ok(response);
            } else {
                response.put("code", 400);
                response.put("message", "删除帖子失败，可能是帖子不存在或您没有权限删除");
                response.put("data", false);
                
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "删除帖子失败: " + e.getMessage());
            response.put("data", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 