package com.milkstore.mapper;

import com.milkstore.entity.Banner;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 轮播图产品数据访问接口
 */
@Mapper
public interface BannerMapper {
    
    /**
     * 查询所有轮播图产品
     * @return 轮播图产品列表
     */
    @Select("SELECT id, tag, title1, title2, desc1, desc2, image_url AS imageUrl, bg_color AS bgColor, " +
            "created_at AS createdAt, updated_at AS updatedAt FROM banner_products")
    List<Banner> findAll();
} 