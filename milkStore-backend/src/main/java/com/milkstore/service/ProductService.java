package com.milkstore.service;

import com.milkstore.entity.MilkProduct;

import java.util.List;

public interface ProductService {
    
    List<MilkProduct> findAllProducts();
    
    List<MilkProduct> findAllActiveProducts();
    
    MilkProduct findById(Integer id);
    
    List<MilkProduct> findByCategoryId(Integer categoryId);
    
    List<MilkProduct> findByName(String name);
} 