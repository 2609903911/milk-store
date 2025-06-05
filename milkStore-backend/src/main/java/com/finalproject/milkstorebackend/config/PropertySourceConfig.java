package com.finalproject.milkstorebackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * 确保属性文件被正确加载的配置类
 */
@Configuration
@PropertySource("classpath:application.properties")
public class PropertySourceConfig {
    // 空实现，只为确保配置文件被加载
} 