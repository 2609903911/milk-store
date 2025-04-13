package com.milkstore.service.impl;

import com.milkstore.entity.MilkProduct;
import com.milkstore.mapper.ProductMapper;
import com.milkstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductMapper productMapper;
    
    @Override
    public List<MilkProduct> findAllProducts() {
        return productMapper.findAll();
    }
    
    @Override
    public List<MilkProduct> findAllActiveProducts() {
        return productMapper.findAllActive();
    }
    
    @Override
    public MilkProduct findById(Integer id) {
        return productMapper.findById(id);
    }
    
    @Override
    public List<MilkProduct> findByCategoryId(Integer categoryId) {
        return productMapper.findByCategoryId(categoryId);
    }
    
    @Override
    public List<MilkProduct> findByName(String name) {
        return productMapper.findByName(name);
    }
} 