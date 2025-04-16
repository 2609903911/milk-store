package com.milkstore.service;

import com.milkstore.entity.Medal;
import java.util.List;
import java.util.Map;

/**
 * 勋章服务接口
 */
public interface MedalService {
    
    /**
     * 查找所有勋章
     * @return 勋章列表
     */
    List<Medal> findAllMedals();
    
    /**
     * 根据类型查找勋章
     * @param typeId 类型ID
     * @return 勋章列表
     */
    List<Medal> findMedalsByType(String typeId);
    
    /**
     * 查找用户拥有的勋章
     * @param userId 用户ID
     * @return 勋章数据，包含用户拥有的勋章和统计信息
     */
    Map<String, Object> findUserMedals(String userId);
    
    /**
     * 使用点亮星点亮用户勋章
     * @param userId 用户ID
     * @param medalId 勋章ID
     * @return 点亮结果，包含更新后的用户和勋章信息
     */
    Map<String, Object> activateMedalWithStar(String userId, String medalId);
} 