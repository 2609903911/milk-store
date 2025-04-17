package com.finalproject.milkstorebackend;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.milkstore")
@MapperScan(basePackages = "com.milkstore.mapper")
public class MilkStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(MilkStoreApplication.class, args);
	}

}
