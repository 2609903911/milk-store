package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.User;
import com.milkstore.entity.UserCoupon;
import com.milkstore.mapper.UserMapper;
import com.milkstore.service.MedalService;
import com.milkstore.service.UserCouponService;
import com.milkstore.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AuthController {
    
    @Autowired
    private VerificationCodeService verificationCodeService;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private MedalService medalService;
    
    @Autowired
    private UserCouponService userCouponService;
    
    @Value("${file.upload.path:/upload/images}")
    private String fileUploadPath;
    
    /**
     * 发送验证码
     * @param phone 手机号
     * @param type 验证码类型
     * @return 发送结果
     */
    @RequestMapping(value = "/auth/code/send", method = {RequestMethod.POST, RequestMethod.GET})
    public Result<Object> sendVerificationCode(
            @RequestParam("phone") String phone,
            @RequestParam(value = "type", defaultValue = "login") String type) {
        
        // 1. 简单的手机号格式校验
        if (phone == null || phone.length() < 11) {
            return Result.error(400, "无效的手机号");
        }
        
        // 2. 发送验证码
        boolean success = verificationCodeService.sendCode(phone, type);
        
        if (success) {
            return Result.success("验证码发送成功", null);
        } else {
            return Result.error(429, "发送验证码过于频繁，请稍后再试");
        }
    }
    
    /**
     * 使用验证码登录
     * @param phone 手机号
     * @param code 验证码
     * @return 登录结果，包括用户信息、勋章、优惠券和token
     */
    @PostMapping("/auth/login/code")
    public Result<Object> loginWithCode(
            @RequestParam("phone") String phone,
            @RequestParam("code") String code) {
        
        try {
            // 1. 验证验证码
            boolean isValid = verificationCodeService.verifyCode(phone, code, "login");
            
            if (!isValid) {
                return Result.error(400, "验证码错误");
            }
            
            // 2. 查询用户是否存在
            User user = userMapper.findByPhone(phone);
            
            // 3. 用户不存在，自动注册
            if (user == null) {
                user = createNewUser(phone);
            } else {
                // 更新最后登录时间仅在内存中更新，不持久化到数据库
                user.setLastLoginTime(new Date());
            }
            
            // 4. 生成登录令牌
            String token = UUID.randomUUID().toString().replace("-", "");
            
            // 5. 获取用户勋章 - 处理可能的异常
            List<Map<String, Object>> medals = new ArrayList<>();
            try {
                Map<String, Object> userMedals = medalService.findUserMedals(user.getUserId());
                if (userMedals != null && userMedals.containsKey("medals")) {
                    medals = (List<Map<String, Object>>) userMedals.get("medals");
                }
            } catch (Exception e) {
                System.err.println("获取用户勋章时出错: " + e.getMessage());
            }
            
            // 6. 获取用户优惠券 - 处理可能的异常
            List<UserCoupon> userCoupons = new ArrayList<>();
            try {
                userCoupons = userCouponService.findByUserIdWithTemplate(user.getUserId());
            } catch (Exception e) {
                System.err.println("获取用户优惠券时出错: " + e.getMessage());
            }
            
            // 7. 构建包含完整用户数据的响应
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("nickname", user.getNickname());
            userData.put("avatar", user.getAvatar());
            userData.put("phone", user.getPhone());
            userData.put("gender", user.getGender());
            userData.put("birthday", user.getBirthday());
            userData.put("pandaCoins", user.getPandaCoins());
            userData.put("lightningStars", user.getLightningStars());
            userData.put("memberLevel", user.getMemberLevel());
            userData.put("createTime", user.getCreateTime());
            userData.put("lastLoginTime", user.getLastLoginTime());
            userData.put("medals", medals);
            userData.put("coupons", userCoupons);
            userData.put("addresses", new ArrayList<>()); // 返回空地址列表
            
            // 8. 返回用户信息和令牌
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("user", userData);
            resultMap.put("token", token);
            
            return Result.success("登录成功", resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "登录失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新用户信息
     * @param userData 用户要更新的数据
     * @return 更新结果
     */
    @PostMapping("/user/update-info")
    public Result<Object> updateUserProfile(@RequestBody Map<String, Object> userData) {
        try {
            // 1. 获取用户ID并查询用户是否存在
            String userId = (String) userData.get("userId");
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            User existingUser = userMapper.findById(userId);
            if (existingUser == null) {
                return Result.error(404, "用户不存在");
            }
            
            // 2. 更新用户信息
            if (userData.containsKey("nickname")) {
                existingUser.setNickname((String) userData.get("nickname"));
            }
            
            if (userData.containsKey("gender")) {
                existingUser.setGender((String) userData.get("gender"));
            }
            
            if (userData.containsKey("birthday")) {
                // 前端传来的是字符串格式的日期 (YYYY-MM-DD)
                String birthdayStr = (String) userData.get("birthday");
                if (birthdayStr != null && !birthdayStr.isEmpty()) {
                    try {
                        // 将字符串日期转换为java.sql.Date格式
                        java.sql.Date birthday = java.sql.Date.valueOf(birthdayStr);
                        existingUser.setBirthday(birthday);
                    } catch (IllegalArgumentException e) {
                        return Result.error(400, "生日格式不正确，请使用YYYY-MM-DD格式");
                    }
                }
            }
            
            if (userData.containsKey("avatar")) {
                existingUser.setAvatar((String) userData.get("avatar"));
            }
            
            // 3. 更新用户信息到数据库
            int rows = userMapper.updateUser(existingUser);
            
            if (rows > 0) {
                // 4. 构建用户数据响应
                Map<String, Object> updatedUserData = new HashMap<>();
                updatedUserData.put("userId", existingUser.getUserId());
                updatedUserData.put("nickname", existingUser.getNickname());
                updatedUserData.put("avatar", existingUser.getAvatar());
                updatedUserData.put("phone", existingUser.getPhone());
                updatedUserData.put("gender", existingUser.getGender());
                updatedUserData.put("birthday", existingUser.getBirthday());
                updatedUserData.put("pandaCoins", existingUser.getPandaCoins());
                updatedUserData.put("lightningStars", existingUser.getLightningStars());
                updatedUserData.put("memberLevel", existingUser.getMemberLevel());
                
                return Result.success("用户信息更新成功", updatedUserData);
            } else {
                return Result.error(500, "用户信息更新失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "更新用户信息失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取用户个人资料
     * @param userId 用户ID
     * @return 用户个人资料
     */
    @GetMapping("/user/profile-info")
    public Result<Object> getUserProfile(@RequestParam("userId") String userId) {
        try {
            if (userId == null || userId.isEmpty()) {
                return Result.error(400, "用户ID不能为空");
            }
            
            User user = userMapper.findById(userId);
            if (user == null) {
                return Result.error(404, "用户不存在");
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("nickname", user.getNickname());
            userData.put("avatar", user.getAvatar());
            userData.put("phone", user.getPhone());
            userData.put("gender", user.getGender());
            userData.put("birthday", user.getBirthday());
            userData.put("pandaCoins", user.getPandaCoins());
            userData.put("lightningStars", user.getLightningStars());
            userData.put("memberLevel", user.getMemberLevel());
            userData.put("createTime", user.getCreateTime());
            userData.put("lastLoginTime", user.getLastLoginTime());
            
            return Result.success("获取用户信息成功", userData);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取用户信息失败: " + e.getMessage());
        }
    }
    
    /**
     * 创建新用户
     * @param phone 手机号
     * @return 新用户信息
     */
    private User createNewUser(String phone) {
        User user = new User();
        String userId = "user_" + System.currentTimeMillis();
        user.setUserId(userId);
        user.setNickname("用户" + phone.substring(phone.length() - 4));
        user.setPhone(phone);
        user.setGender("unknown"); // 使用表中的enum值
        user.setPandaCoins(0);
        user.setLightningStars(0);
        user.setMemberLevel(1);
        // 设置默认头像
        user.setAvatar("/static/images/avatar.png");
        // 设置创建时间和最后登录时间
        Date now = new Date();
        user.setCreateTime(now);
        user.setLastLoginTime(now);
        
        try {
            userMapper.insert(user);
        } catch (Exception e) {
            System.err.println("创建用户失败: " + e.getMessage());
            throw e; // 重新抛出异常，让上层捕获
        }
        
        return user;
    }
    
    /**
     * 更新用户手机号
     * @param requestBody 请求参数，包含phone和code
     * @return 更新结果
     */
    @PostMapping("/user/update-phone")
    public Result<Object> updateUserPhone(@RequestBody Map<String, Object> requestBody) {
        try {
            // 1. 获取请求参数
            String phone = (String) requestBody.get("phone");
            String code = (String) requestBody.get("code");
            
            if (phone == null || phone.isEmpty() || code == null || code.isEmpty()) {
                return Result.error(400, "手机号或验证码不能为空");
            }
            
            // 2. 验证验证码
            boolean isValid = verificationCodeService.verifyCode(phone, code, "update_phone");
            
            if (!isValid) {
                return Result.error(400, "验证码错误或已过期");
            }
            
            // 3. 获取当前登录用户信息
            String userIdFromSession = ""; // 实际项目中从会话中获取当前登录用户ID
            
            // 这里为了演示，从请求中获取用户ID
            // 注意：实际项目应该从安全会话中获取已登录用户的ID
            Object userIdObj = requestBody.get("userId");
            if (userIdObj != null) {
                userIdFromSession = userIdObj.toString();
            } else {
                // 从请求头或cookie中获取用户ID
                // userIdFromSession = ... 
            }
            
            if (userIdFromSession.isEmpty()) {
                return Result.error(401, "未登录或登录已过期");
            }
            
            // 4. 检查新手机号是否已被注册
            User existingUserWithPhone = userMapper.findByPhone(phone);
            if (existingUserWithPhone != null && !existingUserWithPhone.getUserId().equals(userIdFromSession)) {
                return Result.error(400, "该手机号已被其他账号使用");
            }
            
            // 5. 更新用户手机号
            User currentUser = userMapper.findById(userIdFromSession);
            if (currentUser == null) {
                return Result.error(404, "用户不存在");
            }
            
            // 保存旧手机号，用于日志记录
            String oldPhone = currentUser.getPhone();
            
            // 更新手机号
            currentUser.setPhone(phone);
            int rows = userMapper.updateUserPhone(currentUser.getUserId(), phone);
            
            if (rows > 0) {
                // 6. 构建用户数据响应
                Map<String, Object> updatedUserData = new HashMap<>();
                updatedUserData.put("userId", currentUser.getUserId());
                updatedUserData.put("phone", phone);
                
                // 7. 记录手机号变更日志（可选）
                // logService.recordPhoneChange(currentUser.getUserId(), oldPhone, phone);
                
                return Result.success("手机号更新成功", updatedUserData);
            } else {
                return Result.error(500, "手机号更新失败");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "更新手机号失败: " + e.getMessage());
        }
    }
    
    /**
     * 上传用户头像
     * @param avatarFile 头像文件
     * @param userId 用户ID
     * @return 上传结果
     */
    @PostMapping("/user/upload-avatar")
    public Result<Object> uploadAvatar(
            @RequestParam("avatarFile") MultipartFile avatarFile,
            @RequestParam("userId") String userId) {
        try {
            System.out.println("开始处理头像上传: 用户ID=" + userId);
            
            if (avatarFile == null || avatarFile.isEmpty()) {
                System.out.println("上传失败: 头像文件为空");
                return Result.error(400, "头像文件不能为空");
            }
            
            // 查询用户是否存在
            User existingUser = userMapper.findById(userId);
            if (existingUser == null) {
                System.out.println("上传失败: 用户不存在，ID=" + userId);
                return Result.error(404, "用户不存在");
            }
            
            String fileName = avatarFile.getOriginalFilename();
            System.out.println("原始文件名: " + fileName);
            
            // 获取文件扩展名
            String fileExtension = "";
            if (fileName != null && fileName.contains(".")) {
                fileExtension = fileName.substring(fileName.lastIndexOf("."));
            } else {
                // 如果没有扩展名，默认使用.jpg
                fileExtension = ".jpg";
            }
            
            // 创建上传目录 (添加avatar子目录)
            String avatarUploadPath = fileUploadPath + "/avatar";
            File uploadDir = new File(avatarUploadPath);
            if (!uploadDir.exists()) {
                System.out.println("创建目录: " + avatarUploadPath);
                boolean dirCreated = uploadDir.mkdirs();
                if (!dirCreated) {
                    System.out.println("目录创建失败: " + avatarUploadPath);
                    return Result.error(500, "无法创建上传目录");
                }
            }
            
            // 生成唯一文件名
            String newFileName = "avatar_" + userId + "_" + System.currentTimeMillis() + fileExtension;
            File targetFile = new File(uploadDir, newFileName);
            System.out.println("保存文件到: " + targetFile.getAbsolutePath());
            
            // 保存文件
            try {
                // 使用文件流直接保存
                avatarFile.transferTo(targetFile);
            } catch (IOException e) {
                System.out.println("文件保存失败: " + e.getMessage());
                e.printStackTrace();
                return Result.error(500, "文件保存失败: " + e.getMessage());
            }
            
            // 检查文件是否成功保存
            if (!targetFile.exists()) {
                System.out.println("文件保存后检查失败，文件不存在");
                return Result.error(500, "文件保存失败");
            }
            
            System.out.println("文件保存成功，大小: " + targetFile.length() + " 字节");
            
            // 构建正确的访问URL (不含api前缀)
            String avatarUrl = "/uploads/avatar/" + newFileName;
            System.out.println("头像URL: " + avatarUrl);
            
            // 更新用户头像URL
            existingUser.setAvatar(avatarUrl);
            int rows = userMapper.updateUser(existingUser);
            
            if (rows > 0) {
                // 返回头像URL
                Map<String, Object> resultData = new HashMap<>();
                resultData.put("avatarUrl", avatarUrl);
                
                System.out.println("头像上传成功");
                return Result.success("头像上传成功", resultData);
            } else {
                System.out.println("用户信息更新失败");
                return Result.error(500, "用户信息更新失败");
            }
        } catch (Exception e) {
            System.out.println("上传过程中发生异常: " + e.getMessage());
            e.printStackTrace();
            return Result.error(500, "头像上传失败: " + e.getMessage());
        }
    }
    
    /**
     * 访问上传的图片
     * @param filename 文件名
     * @return 图片资源
     */
    @GetMapping("/uploads/avatar/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveAvatarFile(@PathVariable String filename) {
        try {
            System.out.println("请求访问头像文件: " + filename);
            
            // 拼接完整的文件路径 (添加avatar子目录)
            String avatarPath = fileUploadPath + "/avatar";
            File file = new File(avatarPath, filename);
            System.out.println("完整文件路径: " + file.getAbsolutePath());
            
            if (!file.exists()) {
                System.out.println("文件不存在: " + file.getAbsolutePath());
                return ResponseEntity.notFound().build();
            }
            
            // 将文件转换为资源
            Resource resource = new FileSystemResource(file);
            
            if (resource.exists() && resource.isReadable()) {
                // 确定内容类型
                String contentType = determineContentType(filename);
                System.out.println("文件存在，返回内容类型: " + contentType);
                
                // 不设置Content-Disposition头，以允许浏览器直接显示图片
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
            } else {
                System.out.println("文件不可读: " + file.getAbsolutePath());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            System.out.println("访问文件时发生异常: " + e.getMessage());
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