package com.milkstore.service.impl;

import com.milkstore.entity.Medal;
import com.milkstore.entity.UserMedal;
import com.milkstore.service.MedalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 勋章服务实现类
 */
@Service
public class MedalServiceImpl implements MedalService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Medal行映射器
     */
    private final RowMapper<Medal> medalRowMapper = (ResultSet rs, int rowNum) -> {
        Medal medal = new Medal();
        medal.setMedalId(rs.getString("medal_id"));
        medal.setMedalName(rs.getString("medal_name"));
        medal.setIconPath(rs.getString("icon_path"));
        medal.setDescription(rs.getString("description"));
        medal.setObtainCondition(rs.getString("obtain_condition"));
        medal.setSortOrder(rs.getInt("sort_order"));
        medal.setCreateTime(rs.getTimestamp("create_time"));
        
        // 设置勋章类型
        com.milkstore.entity.MedalType type = new com.milkstore.entity.MedalType();
        type.setTypeId(rs.getString("type_id"));
        type.setTypeName(rs.getString("type_name"));
        medal.setType(type);
        
        return medal;
    };
    
    @Override
    public List<Medal> findAllMedals() {
        String sql = "SELECT m.*, t.type_name FROM medals m " +
                     "JOIN medal_types t ON m.type_id = t.type_id " +
                     "ORDER BY m.sort_order";
        return jdbcTemplate.query(sql, medalRowMapper);
    }
    
    @Override
    public List<Medal> findMedalsByType(String typeId) {
        String sql = "SELECT m.*, t.type_name FROM medals m " +
                     "JOIN medal_types t ON m.type_id = t.type_id " +
                     "WHERE m.type_id = ? " +
                     "ORDER BY m.sort_order";
        return jdbcTemplate.query(sql, medalRowMapper, typeId);
    }
    
    @Override
    public Map<String, Object> findUserMedals(String userId) {
        // 查询用户勋章
        String sql = "SELECT um.id, um.user_id, um.is_active, um.obtain_time, " +
                     "m.medal_id, m.medal_name, m.icon_path, m.description, m.sort_order, " +
                     "t.type_id, t.type_name " +
                     "FROM user_medals um " +
                     "JOIN medals m ON um.medal_id = m.medal_id " +
                     "JOIN medal_types t ON m.type_id = t.type_id " +
                     "WHERE um.user_id = ?";
        
        List<UserMedal> userMedals = jdbcTemplate.query(sql, (rs, rowNum) -> {
            UserMedal userMedal = new UserMedal();
            userMedal.setId(rs.getInt("id"));
            userMedal.setUserId(rs.getString("user_id"));
            userMedal.setIsActive(rs.getBoolean("is_active"));
            userMedal.setObtainTime(rs.getTimestamp("obtain_time"));
            
            Medal medal = new Medal();
            medal.setMedalId(rs.getString("medal_id"));
            medal.setMedalName(rs.getString("medal_name"));
            medal.setIconPath(rs.getString("icon_path"));
            medal.setDescription(rs.getString("description"));
            medal.setSortOrder(rs.getInt("sort_order"));
            
            com.milkstore.entity.MedalType type = new com.milkstore.entity.MedalType();
            type.setTypeId(rs.getString("type_id"));
            type.setTypeName(rs.getString("type_name"));
            medal.setType(type);
            
            userMedal.setMedal(medal);
            
            return userMedal;
        }, userId);
        
        // 按类型分组
        Map<String, List<UserMedal>> medalsByType = userMedals.stream()
                .collect(Collectors.groupingBy(um -> um.getMedal().getType().getTypeId()));
        
        // 统计激活数量
        long activeCount = userMedals.stream().filter(UserMedal::getIsActive).count();
        
        // 构建结果
        Map<String, Object> result = new HashMap<>();
        result.put("totalCount", userMedals.size());
        result.put("activeCount", activeCount);
        result.put("medals", userMedals);
        result.put("byType", medalsByType);
        
        return result;
    }
} 