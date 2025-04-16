package com.milkstore.service.impl;

import com.milkstore.entity.Medal;
import com.milkstore.entity.UserMedal;
import com.milkstore.entity.User;
import com.milkstore.service.MedalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public Map<String, Object> activateMedalWithStar(String userId, String medalId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 1. 检查用户是否存在
            String userSql = "SELECT * FROM users WHERE user_id = ?";
            List<User> users = jdbcTemplate.query(userSql, (rs, rowNum) -> {
                User user = new User();
                user.setUserId(rs.getString("user_id"));
                user.setNickname(rs.getString("nickname"));
                user.setLightningStars(rs.getInt("lightning_stars"));
                return user;
            }, userId);
            
            if (users.isEmpty()) {
                result.put("success", false);
                result.put("message", "用户不存在");
                return result;
            }
            
            User user = users.get(0);
            
            // 2. 检查用户点亮星是否足够
            if (user.getLightningStars() == null || user.getLightningStars() < 1) {
                result.put("success", false);
                result.put("message", "点亮星不足");
                return result;
            }
            
            // 3. 检查勋章是否存在 - 修改查询，连接medal_types表获取type_name
            String medalSql = "SELECT m.*, t.type_name FROM medals m " +
                             "JOIN medal_types t ON m.type_id = t.type_id " +
                             "WHERE m.medal_id = ?";
            List<Medal> medals = jdbcTemplate.query(medalSql, medalRowMapper, medalId);
            
            if (medals.isEmpty()) {
                result.put("success", false);
                result.put("message", "勋章不存在");
                return result;
            }
            
            // 4. 检查用户是否已拥有该勋章
            String userMedalSql = "SELECT * FROM user_medals WHERE user_id = ? AND medal_id = ?";
            List<Map<String, Object>> userMedals = jdbcTemplate.queryForList(userMedalSql, userId, medalId);
            
            if (!userMedals.isEmpty()) {
                // 如果已有记录但未激活，则激活该勋章
                boolean isActive = (boolean) userMedals.get(0).get("is_active");
                int userMedalId = (int) userMedals.get(0).get("id");
                
                if (isActive) {
                    result.put("success", false);
                    result.put("message", "勋章已激活，无需重复操作");
                    return result;
                }
                
                // 激活已有勋章
                String updateSql = "UPDATE user_medals SET is_active = true WHERE id = ?";
                jdbcTemplate.update(updateSql, userMedalId);
            } else {
                // 新增用户勋章记录
                String insertSql = "INSERT INTO user_medals (user_id, medal_id, is_active, obtain_time) VALUES (?, ?, true, ?)";
                jdbcTemplate.update(insertSql, userId, medalId, new Date());
            }
            
            // 5. 扣除用户点亮星
            String updateUserSql = "UPDATE users SET lightning_stars = lightning_stars - 1 WHERE user_id = ?";
            jdbcTemplate.update(updateUserSql, userId);
            
            // 6. 查询更新后的用户信息和勋章信息
            Map<String, Object> updatedUser = jdbcTemplate.queryForMap("SELECT * FROM users WHERE user_id = ?", userId);
            Map<String, Object> userMedalsData = findUserMedals(userId);
            
            result.put("success", true);
            result.put("message", "勋章点亮成功");
            result.put("user", updatedUser);
            result.put("medals", userMedalsData);
            
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "点亮勋章失败: " + e.getMessage());
            return result;
        }
    }
} 