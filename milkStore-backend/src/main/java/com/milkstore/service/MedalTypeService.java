package com.milkstore.service;

import com.milkstore.entity.MedalType;
import java.util.List;

/**
 * 勋章类型服务接口
 */
public interface MedalTypeService {
    
    /**
     * 查找所有勋章类型
     * @return 勋章类型列表
     */
    List<MedalType> findAllTypes();
    
} 