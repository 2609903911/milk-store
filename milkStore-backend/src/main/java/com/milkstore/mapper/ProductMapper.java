package com.milkstore.mapper;

import com.milkstore.entity.MilkProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductMapper {
    
    @Select("SELECT * FROM products")
    List<MilkProduct> findAllActive();
    
    @Select("SELECT * FROM products")
    List<MilkProduct> findAll();
    
    @Select("SELECT * FROM products WHERE id = #{id}")
    MilkProduct findById(Integer id);
    
    @Select("SELECT * FROM products WHERE category_id = #{categoryId}")
    List<MilkProduct> findByCategoryId(Integer categoryId);
    
    @Select("SELECT * FROM products WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<MilkProduct> findByName(String name);
} 