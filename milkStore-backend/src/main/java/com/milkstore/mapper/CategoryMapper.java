package com.milkstore.mapper;

import com.milkstore.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper {
    
    @Select("SELECT * FROM product_categories")
    List<Category> findAll();
    
    @Select("SELECT * FROM product_categories WHERE id = #{id}")
    Category findById(Integer id);
} 