package com.milkstore.mapper;

import com.milkstore.entity.TogetherDrinkInvitation;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 一起喝功能数据访问层接口
 */
@Mapper
public interface TogetherDrinkMapper {

    /**
     * 插入新邀请
     * @param invitation 邀请信息
     * @return 影响行数
     */
    @Insert({
        "INSERT INTO together_drink_invitation",
        "(invite_code, creator_id, creator_nickname, creator_avatar, ",
        "product_id, product_name, product_price, product_image, ",
        "status, create_time, expire_time)",
        "VALUES",
        "(#{inviteCode}, #{creatorId}, #{creatorNickname}, #{creatorAvatar}, ",
        "#{productId}, #{productName}, #{productPrice}, #{productImage}, ",
        "#{status}, #{createTime}, #{expireTime})"
    })
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(TogetherDrinkInvitation invitation);

    /**
     * 根据邀请码查询邀请
     * @param inviteCode 邀请码
     * @return 邀请信息
     */
    @Select({
        "SELECT * FROM together_drink_invitation",
        "WHERE invite_code = #{inviteCode}"
    })
    TogetherDrinkInvitation selectByInviteCode(String inviteCode);

    /**
     * 更新邀请状态
     * @param id 邀请ID
     * @param status 新状态
     * @return 影响行数
     */
    @Update({
        "UPDATE together_drink_invitation",
        "SET status = #{status}",
        "WHERE id = #{id}"
    })
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    /**
     * 更新参与者信息
     * @param invitation 包含参与者信息的邀请
     * @return 影响行数
     */
    @Update({
        "UPDATE together_drink_invitation",
        "SET participant_id = #{participantId},",
        "participant_nickname = #{participantNickname},",
        "participant_avatar = #{participantAvatar},",
        "status = #{status}",
        "WHERE id = #{id}"
    })
    int updateParticipant(TogetherDrinkInvitation invitation);

    /**
     * 更新订单信息
     * @param invitation 包含订单信息的邀请
     * @return 影响行数
     */
    @Update({
        "UPDATE together_drink_invitation",
        "SET status = #{status},",
        "order_id = #{orderId},",
        "complete_time = #{completeTime}",
        "WHERE id = #{id}"
    })
    int updateOrderInfo(TogetherDrinkInvitation invitation);

    /**
     * 查询用户相关的邀请（创建或参与）
     * @param userId 用户ID
     * @return 邀请列表
     */
    @Select({
        "SELECT * FROM together_drink_invitation",
        "WHERE creator_id = #{userId} OR participant_id = #{userId}",
        "ORDER BY create_time DESC"
    })
    List<TogetherDrinkInvitation> selectByUserId(String userId);

    /**
     * 查询已过期但状态未更新的邀请
     * @return 过期邀请列表
     */
    @Select({
        "SELECT * FROM together_drink_invitation",
        "WHERE (status = 'waiting' OR status = 'joined')",
        "AND expire_time < NOW()"
    })
    List<TogetherDrinkInvitation> selectExpired();
} 