package com.milkstore.service;

import java.util.List;
import java.util.Map;

import com.milkstore.entity.TogetherDrinkInvitation;
import com.milkstore.entity.Order;

/**
 * 一起喝服务接口
 */
public interface TogetherDrinkService {
    
    /**
     * 创建邀请
     * @param creatorId 创建者用户ID
     * @param productId 商品ID
     * @param productName 商品名称
     * @param productImage 商品图片
     * @param productPrice 商品价格
     * @return 邀请对象
     */
    TogetherDrinkInvitation createInvitation(String creatorId, Long productId, String productName, String productImage, Double productPrice);
    
    /**
     * 根据ID获取邀请信息
     * @param invitationId 邀请ID
     * @return 邀请对象
     */
    TogetherDrinkInvitation getInvitationById(Long invitationId);
    
    /**
     * 获取邀请信息
     * @param inviteCode 邀请码
     * @return 邀请对象
     */
    TogetherDrinkInvitation getInvitationByCode(String inviteCode);
    
    /**
     * 加入邀请
     * @param invitationId 邀请ID
     * @param participantId 参与者用户ID
     * @return 更新后的邀请对象
     */
    TogetherDrinkInvitation joinInvitation(Long invitationId, String participantId);
    
    /**
     * 取消邀请
     * @param invitationId 邀请ID
     * @param userId 请求取消的用户ID（必须是创建者）
     * @return 是否成功取消
     */
    boolean cancelInvitation(Long invitationId, String userId);
    
    /**
     * 完成邀请并创建订单
     * @param invitationId 邀请ID
     * @param orderAddress 订单地址
     * @return 创建的订单ID
     */
    String completeInvitation(Long invitationId, String orderAddress);
    
    /**
     * 获取用户参与的邀请
     * @param userId 用户ID
     * @return 邀请列表
     */
    List<TogetherDrinkInvitation> getUserInvitations(String userId);
    
    /**
     * 创建共享订单
     * @param inviteCode 邀请码
     * @param orderInfo 订单信息
     * @return 创建的订单
     */
    Order createTogetherOrder(String inviteCode, Map<String, Object> orderInfo);
    
    /**
     * 检查邀请码是否有效
     * @param inviteCode 邀请码
     * @return 是否有效
     */
    boolean isInvitationValid(String inviteCode);
    
    /**
     * 处理过期邀请
     * 定时任务调用，将过期的邀请状态更新为"expired"
     */
    void handleExpiredInvitations();
} 