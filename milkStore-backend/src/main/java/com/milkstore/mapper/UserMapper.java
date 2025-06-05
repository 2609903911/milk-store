package com.milkstore.mapper;

import com.milkstore.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

/**
 * 用户数据访问接口
 */
@Mapper
public interface UserMapper {
    
    /**
     * 根据ID查询用户
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
    
    /**
     * 更新用户简介
     * @param userId 用户ID
     * @param bio 新简介
     * @return 影响行数
     */
    @Update("UPDATE users SET bio = #{bio} WHERE user_id = #{userId}")
    int updateUserBio(@Param("userId") String userId, @Param("bio") String bio);
    
    /**
     * 增加用户关注数
     * @param userId 用户ID
     * @return 影响行数
     */
    @Update("UPDATE users SET following_count = following_count + 1 WHERE user_id = #{userId}")
    int increaseFollowingCount(@Param("userId") String userId);
    
    /**
     * 减少用户关注数
     * @param userId 用户ID
     * @return 影响行数
     */
    @Update("UPDATE users SET following_count = following_count - 1 WHERE user_id = #{userId} AND following_count > 0")
    int decreaseFollowingCount(@Param("userId") String userId);
    
    /**
     * 增加用户粉丝数
     * @param userId 用户ID
     * @return 影响行数
     */
    @Update("UPDATE users SET followers_count = followers_count + 1 WHERE user_id = #{userId}")
    int increaseFollowersCount(@Param("userId") String userId);
    
    /**
     * 减少用户粉丝数
     * @param userId 用户ID
     * @return 影响行数
     */
    @Update("UPDATE users SET followers_count = followers_count - 1 WHERE user_id = #{userId} AND followers_count > 0")
    int decreaseFollowersCount(@Param("userId") String userId);
    
    /**
     * 设置用户关注数
     * @param userId 用户ID
     * @param count 关注数
     * @return 影响行数
     */
    @Update("UPDATE users SET following_count = #{count} WHERE user_id = #{userId}")
    int setFollowingCount(@Param("userId") String userId, @Param("count") int count);
    
    /**
     * 设置用户粉丝数
     * @param userId 用户ID
     * @param count 粉丝数
     * @return 影响行数
     */
    @Update("UPDATE users SET followers_count = #{count} WHERE user_id = #{userId}")
    int setFollowersCount(@Param("userId") String userId, @Param("count") int count);
} 