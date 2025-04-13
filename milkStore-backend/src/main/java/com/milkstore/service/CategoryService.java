package com.milkstore.service;

import com.milkstore.entity.Category;

import java.util.List;

public interface CategoryService {
    
    List<Category> findAllCategories();
    
    Category findById(Integer id);
} 