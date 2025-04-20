package com.milkstore.mapper;

import com.milkstore.entity.TogetherDrinkInvitation;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

/**
 * 一起喝邀请数据访问接口
 */
@Mapper
public interface TogetherDrinkInvitationMapper {

    /**
     * 插入新邀请
     * @param invitation 邀请信息
     * @return 影响行数
     */
    @Insert("INSERT INTO together_drink_invitation (invite_code, creator_id, product_id, product_name, product_image, product_price, status, create_time, expire_time) " +
            "VALUES (#{inviteCode}, #{creatorId}, #{productId}, #{productName}, #{productImage}, #{productPrice}, #{status}, #{createTime}, #{expireTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(TogetherDrinkInvitation invitation);

    /**
     * 根据邀请码查询邀请
     * @param inviteCode 邀请码
     * @return 邀请信息
     */
    @Select("SELECT * FROM together_drink_invitation WHERE invite_code = #{inviteCode}")
    TogetherDrinkInvitation findByInviteCode(String inviteCode);

    /**
     * 更新邀请状态
     * @param id 邀请ID
     * @param status 新状态
     * @return 影响行数
     */
    @Update("UPDATE together_drink_invitation SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    /**
     * 加入邀请
     * @param id 邀请ID
     * @param participantId 参与者ID
     * @return 影响行数
     */
    @Update("UPDATE together_drink_invitation SET participant_id = #{participantId}, status = 'joined' WHERE id = #{id}")
    int join(@Param("id") Long id, @Param("participantId") String participantId);

    /**
     * 更新关联订单ID
     * @param id 邀请ID
     * @param orderId 订单ID
     * @return 影响行数
     */
    @Update("UPDATE together_drink_invitation SET order_id = #{orderId}, status = 'completed', complete_time = NOW() WHERE id = #{id}")
    int updateOrderId(@Param("id") Long id, @Param("orderId") String orderId);

    /**
     * 查询用户创建的邀请
     * @param userId 用户ID
     * @return 邀请列表
     */
    @Select("SELECT * FROM together_drink_invitation WHERE creator_id = #{userId} ORDER BY create_time DESC")
    List<TogetherDrinkInvitation> findByCreatorId(String userId);

    /**
     * 查询用户参与的邀请
     * @param userId 用户ID
     * @return 邀请列表
     */
    @Select("SELECT * FROM together_drink_invitation WHERE participant_id = #{userId} ORDER BY create_time DESC")
    List<TogetherDrinkInvitation> findByParticipantId(String userId);

    /**
     * 更新已过期邀请状态
     * @param now 当前时间
     * @return 影响行数
     */
    @Update("UPDATE together_drink_invitation SET status = 'expired' " +
            "WHERE status IN ('waiting', 'joined') AND expire_time < #{now}")
    int updateExpiredInvitations(Date now);

    /**
     * 根据ID查询邀请
     * @param id 邀请ID
     * @return 邀请信息
     */
    @Select("SELECT * FROM together_drink_invitation WHERE id = #{id}")
    TogetherDrinkInvitation findById(Long id);
} 