package com.finalproject.milkstorebackend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.finalproject.milkstorebackend", "com.milkstore"})
@MapperScan(basePackages = {"com.finalproject.milkstorebackend.repository", "com.milkstore.mapper"})
public class MilkStoreBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MilkStoreBackendApplication.class, args);
	}

}
