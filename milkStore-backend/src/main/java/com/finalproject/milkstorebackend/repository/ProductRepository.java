package com.finalproject.milkstorebackend.repository;

import com.finalproject.milkstorebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // 可以在这里添加自定义查询方法
} 