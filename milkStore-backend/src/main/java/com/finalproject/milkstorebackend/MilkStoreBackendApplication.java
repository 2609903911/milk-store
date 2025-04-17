package com.finalproject.milkstorebackend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 牛奶商城后端应用入口类
 */
@SpringBootApplication(scanBasePackages = {"com.finalproject.milkstorebackend", "com.milkstore"})
@MapperScan({"com.finalproject.milkstorebackend.mapper", "com.milkstore.mapper"})
@EnableTransactionManagement
public class MilkStoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MilkStoreBackendApplication.class, args);
    }
}