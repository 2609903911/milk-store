package com.milkstore.mapper;

import com.milkstore.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {
    
    /**
     * 根据用户ID查询用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    User findById(@Param("userId") String userId);
    
    /**
     * 根据手机号查询用户信息
     * @param phone 手机号
     * @return 用户信息
     */
    User findByPhone(@Param("phone") String phone);
    
    /**
     * 新增用户
     * @param user 用户信息
     * @return 影响行数
     */
    int insert(User user);

    /**
     * 更新用户基本信息
     * @param user 用户信息
     * @return 影响行数
     */
    int updateUser(User user);

    @Update("UPDATE users SET panda_coins = #{pandaCoins} WHERE user_id = #{userId}")
    int updateCoins(@Param("userId") String userId, @Param("pandaCoins") int pandaCoins);
    
    @Update("UPDATE users SET panda_coins = #{pandaCoins}, lightning_stars = #{lightningStars} WHERE user_id = #{userId}")
    int updateCoinsAndStars(@Param("userId") String userId, @Param("pandaCoins") int pandaCoins, @Param("lightningStars") int lightningStars);
    
    /**
     * 更新用户手机号
     * @param userId 用户ID
     * @param phone 新手机号
     * @return 影响行数
     */
    @Update("UPDATE users SET phone = #{phone} WHERE user_id = #{userId}")
    int updateUserPhone(@Param("userId") String userId, @Param("phone") String phone);
} 