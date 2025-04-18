package com.milkstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload.path:/upload/images}")
    private String fileUploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源映射，使/uploads/avatar/**路径可以直接访问文件系统中的图片
        registry.addResourceHandler("/uploads/avatar/**")
                .addResourceLocations("file:" + fileUploadPath + "/avatar/");
                
        System.out.println("配置了静态资源映射: /uploads/avatar/** -> file:" + fileUploadPath + "/avatar/");
    }
} 