package com.milkstore.service.impl;

import com.milkstore.entity.Category;
import com.milkstore.mapper.CategoryMapper;
import com.milkstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Override
    public List<Category> findAllCategories() {
        return categoryMapper.findAll();
    }
    
    @Override
    public Category findById(Integer id) {
        return categoryMapper.findById(id);
    }
} 