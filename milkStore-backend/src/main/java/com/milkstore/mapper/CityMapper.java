package com.milkstore.mapper;

import com.milkstore.entity.City;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 城市数据访问接口
 */
@Mapper
public interface CityMapper {
    
    /**
     * 查询所有城市
     * @return 城市列表
     */
    @Select("SELECT id, name, pinyin, code, latitude, longitude, is_hot AS isHot, created_at AS createdAt, updated_at AS updatedAt FROM city")
    List<City> findAll();
    
    /**
     * 查询热门城市
     * @return 热门城市列表
     */
    @Select("SELECT id, name, pinyin, code, latitude, longitude, is_hot AS isHot, created_at AS createdAt, updated_at AS updatedAt FROM city WHERE is_hot = 1")
    List<City> findHotCities();
    
    /**
     * 根据首字母查询城市
     * @param letter 首字母（大写）
     * @return 城市列表
     */
    @Select("SELECT id, name, pinyin, code, latitude, longitude, is_hot AS isHot, created_at AS createdAt, updated_at AS updatedAt FROM city WHERE UPPER(LEFT(pinyin, 1)) = #{letter}")
    List<City> findCitiesByLetter(String letter);
} 