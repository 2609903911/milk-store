package com.milkstore.controller;

import com.milkstore.common.Result;
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
import java.util.*;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/api/upload")
public class FileController {

    @Value("${file.upload.path}")
    private String fileUploadPath;

    /**
     * 上传帖子图片
     * @param files 图片文件列表
     * @return 上传结果
     */
    @PostMapping("/post/images")
    public Result<Object> uploadPostImages(@RequestParam("files") MultipartFile[] files) {
        try {
            
            if (files.length == 0) {
                return Result.error(400, "请选择至少一个文件");
            }
            
            // 创建帖子图片上传目录
            String postImagesPath = fileUploadPath + "/post";
            File uploadDir = new File(postImagesPath);
            if (!uploadDir.exists()) {
                boolean dirCreated = uploadDir.mkdirs();
                if (!dirCreated) {
                    return Result.error(500, "无法创建上传目录");
                }
            }
            
            List<String> uploadedUrls = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                String fileName = file.getOriginalFilename();
                
                // 获取文件扩展名
                String fileExtension = "";
                if (fileName != null && fileName.contains(".")) {
                    fileExtension = fileName.substring(fileName.lastIndexOf("."));
                } else {
                    // 如果没有扩展名，默认使用.jpg
                    fileExtension = ".jpg";
                }
                
                // 生成唯一文件名
                String newFileName = "post_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
                File targetFile = new File(uploadDir, newFileName);
                
                // 保存文件
                try {
                    file.transferTo(targetFile);
                } catch (IOException e) {
                    e.printStackTrace();
                    continue;
                }
                
                // 检查文件是否成功保存
                if (!targetFile.exists()) {
                    continue;
                }
                
                
                // 构建访问URL
                String imageUrl = "/uploads/post/" + newFileName;
                uploadedUrls.add(imageUrl);
            }
            
            if (uploadedUrls.isEmpty()) {
                return Result.error(500, "所有文件上传失败");
            }
            
            // 将URL列表转换为||分隔的字符串
            String imagesStr = String.join("||", uploadedUrls);
            
            // 返回上传成功的图片URL列表和字符串
            Map<String, Object> resultData = new HashMap<>();
            resultData.put("imageUrls", uploadedUrls);
            resultData.put("imagesStr", imagesStr);  // 添加字符串格式的结果
            
            return Result.success("图片上传成功", resultData);
            
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "图片上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 上传帖子图片 - 字符串版本
     * 接收已有的图片URL字符串，添加新图片后返回合并后的字符串
     * @param imagesStr 现有图片URL字符串，多个URL用||分隔
     * @param files 新上传的图片文件列表
     * @return 上传结果，返回合并后的图片URL字符串
     */
    @PostMapping("/post/images/string")
    public Result<Object> uploadPostImagesString(
            @RequestParam(value = "imagesStr", required = false, defaultValue = "") String imagesStr,
            @RequestParam("files") MultipartFile[] files) {
        try {
            
            if (files.length == 0) {
                Map<String, Object> resultData = new HashMap<>();
                resultData.put("imagesStr", imagesStr);
                return Result.success("没有新上传的文件", resultData);
            }
            
            // 创建帖子图片上传目录
            String postImagesPath = fileUploadPath + "/post";
            File uploadDir = new File(postImagesPath);
            if (!uploadDir.exists()) {
                boolean dirCreated = uploadDir.mkdirs();
                if (!dirCreated) {
                    return Result.error(500, "无法创建上传目录");
                }
            }
            
            // 解析现有的图片URL列表
            List<String> existingUrls = new ArrayList<>();
            if (imagesStr != null && !imagesStr.isEmpty()) {
                existingUrls.addAll(Arrays.asList(imagesStr.split("\\|\\|")));
            }
            
            // 处理新上传的文件
            List<String> newUploadedUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                String fileName = file.getOriginalFilename();
                
                // 获取文件扩展名
                String fileExtension = "";
                if (fileName != null && fileName.contains(".")) {
                    fileExtension = fileName.substring(fileName.lastIndexOf("."));
                } else {
                    fileExtension = ".jpg";
                }
                
                // 生成唯一文件名
                String newFileName = "post_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
                File targetFile = new File(uploadDir, newFileName);
                
                // 保存文件
                try {
                    file.transferTo(targetFile);
                } catch (IOException e) {
                    e.printStackTrace();
                    continue;
                }
                
                // 检查文件是否成功保存
                if (!targetFile.exists()) {
                    continue;
                }
                
                
                // 构建访问URL
                String imageUrl = "/uploads/post/" + newFileName;
                newUploadedUrls.add(imageUrl);
            }
            
            if (newUploadedUrls.isEmpty() && existingUrls.isEmpty()) {
                return Result.error(500, "所有文件上传失败且没有现有图片");
            }
            
            // 合并现有URL和新上传的URL
            List<String> allUrls = new ArrayList<>(existingUrls);
            allUrls.addAll(newUploadedUrls);
            
            // 生成新的图片URL字符串
            String newImagesStr = String.join("||", allUrls);
            
            // 返回结果
            Map<String, Object> resultData = new HashMap<>();
            resultData.put("imagesStr", newImagesStr);
            resultData.put("imageUrls", allUrls);
            resultData.put("newImageUrls", newUploadedUrls);
            
            return Result.success("图片上传成功", resultData);
            
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "图片上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 访问上传的帖子图片
     * @param filename 文件名
     * @return 图片资源
     */
    @GetMapping("/uploads/post/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> servePostImage(@PathVariable String filename) {
        try {
            
            // 拼接完整的文件路径
            String postImagesPath = fileUploadPath + "/post";
            File file = new File(postImagesPath, filename);
            
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
} 