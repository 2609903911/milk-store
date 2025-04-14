package com.milkstore.service.impl;

import com.milkstore.entity.MedalType;
import com.milkstore.service.MedalTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * 勋章类型服务实现类
 */
@Service
public class MedalTypeServiceImpl implements MedalTypeService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * 勋章类型行映射器
     */
    private final RowMapper<MedalType> medalTypeRowMapper = (ResultSet rs, int rowNum) -> {
        MedalType type = new MedalType();
        type.setTypeId(rs.getString("type_id"));
        type.setTypeName(rs.getString("type_name"));
        type.setDescription(rs.getString("description"));
        type.setDisplayOrder(rs.getInt("display_order"));
        type.setCreateTime(rs.getTimestamp("create_time"));
        type.setUpdateTime(rs.getTimestamp("update_time"));
        return type;
    };
    
    @Override
    public List<MedalType> findAllTypes() {
        String sql = "SELECT * FROM medal_types ORDER BY display_order";
        return jdbcTemplate.query(sql, medalTypeRowMapper);
    }
} 