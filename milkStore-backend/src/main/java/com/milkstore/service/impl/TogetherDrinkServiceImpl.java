package com.milkstore.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.milkstore.entity.Order;
import com.milkstore.entity.TogetherDrinkInvitation;
import com.milkstore.mapper.TogetherDrinkInvitationMapper;
import com.milkstore.mapper.OrderMapper;
import com.milkstore.service.OrderService;
import com.milkstore.service.TogetherDrinkService;

/**
 * 一起喝功能服务实现类
 */
@Service
public class TogetherDrinkServiceImpl implements TogetherDrinkService {

    @Autowired
    private TogetherDrinkInvitationMapper invitationMapper;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderMapper orderMapper;
    
    private static final String[] INVITE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".split("");
    private static final int INVITE_CODE_LENGTH = 8;
    private static final Random random = new Random();

    @Override
    @Transactional
    public TogetherDrinkInvitation createInvitation(String creatorId, Long productId, String productName, String productImage, Double productPrice) {
        // 生成唯一的邀请码
        String inviteCode = generateInviteCode();
        
        // 创建邀请对象
        TogetherDrinkInvitation invitation = new TogetherDrinkInvitation();
        invitation.setInviteCode(inviteCode);
        invitation.setCreatorId(creatorId);
        invitation.setProductId(productId);
        invitation.setStatus("created");
        invitation.setCreateTime(LocalDateTime.now());
        invitation.setExpireTime(LocalDateTime.now().plusHours(24)); // 设置24小时后过期
        
        // 设置总金额（商品价格）
        BigDecimal totalAmount = BigDecimal.valueOf(productPrice);
        invitation.setTotalAmount(totalAmount);
        
        // 设置非数据库字段，用于返回数据
        invitation.setProductName(productName);
        invitation.setProductImage(productImage);
        invitation.setProductPrice(productPrice);
        
        // 保存到数据库
        invitationMapper.insert(invitation);
        
        return invitation;
    }

    @Override
    public TogetherDrinkInvitation getInvitationById(Long invitationId) {
        return invitationMapper.findById(invitationId);
    }

    @Override
    public TogetherDrinkInvitation getInvitationByCode(String inviteCode) {
        return invitationMapper.findByInviteCode(inviteCode);
    }

    @Override
    @Transactional
    public TogetherDrinkInvitation joinInvitation(Long invitationId, String participantId) {
        TogetherDrinkInvitation invitation = invitationMapper.findById(invitationId);
        
        // 修改状态检查逻辑，只允许状态为'created'的邀请被加入
        if (invitation == null || !"created".equals(invitation.getStatus())) {
            throw new IllegalStateException("邀请不存在或已不可加入");
        }
        
        if (invitation.getCreatorId().equals(participantId)) {
            throw new IllegalStateException("不能加入自己创建的邀请");
        }
        
        // 更新邀请状态为"joined"
        invitation.setParticipantId(participantId);
        invitation.setStatus("joined");
        
        // 更新数据库
        invitationMapper.join(invitation.getId(), participantId);
        
        return invitation;
    }

    @Override
    @Transactional
    public boolean cancelInvitation(Long invitationId, String userId) {
        TogetherDrinkInvitation invitation = invitationMapper.findById(invitationId);
        
        if (invitation == null) {
            return false;
        }
        
        // 只有创建者可以取消
        if (!invitation.getCreatorId().equals(userId)) {
            return false;
        }
        
        // 只有在created状态或joined状态可以取消
        if (!"created".equals(invitation.getStatus()) && !"joined".equals(invitation.getStatus())) {
            return false;
        }
        
        // 更新状态为"cancelled"
        invitationMapper.updateStatus(invitationId, "cancelled");
        
        return true;
    }

    @Override
    @Transactional
    public String completeInvitation(Long invitationId, String orderAddress) {
        TogetherDrinkInvitation invitation = invitationMapper.findById(invitationId);
        
        if (invitation == null || !"joined".equals(invitation.getStatus())) {
            throw new IllegalStateException("邀请不存在或状态不正确");
        }
        
        // 生成订单ID
        String orderId = "TD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4);
        
        // 创建共享订单
        double totalAmount = invitation.getProductPrice() * 2 * 0.8; // 两杯打8折
        
        // 订单项信息（简化处理为JSON字符串）
        String orderItems = "[{\"productId\":" + invitation.getProductId() + 
                           ",\"productName\":\"" + invitation.getProductName() + 
                           "\",\"productImage\":\"" + invitation.getProductImage() + 
                           "\",\"price\":" + invitation.getProductPrice() + 
                           ",\"quantity\":2,\"remark\":\"一起喝活动商品\"}]";
        
        // 创建订单对象
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUserId(invitation.getCreatorId());
        order.setOrderStatus("pending");
        order.setDeliveryAddress(orderAddress);
        order.setOrderItems(orderItems);
        order.setRemark("一起喝活动订单，参与用户：" + invitation.getCreatorId() + "，" + invitation.getParticipantId());
        order.setTotalAmount(new BigDecimal(String.valueOf(invitation.getProductPrice() * 2)));
        order.setDiscountAmount(new BigDecimal(String.valueOf(invitation.getProductPrice() * 2 * 0.2))); // 8折优惠的金额
        order.setActualAmount(new BigDecimal(String.valueOf(totalAmount)));
        order.setCreateTime(LocalDateTime.now());
        
        // 创建订单
        Map<String, Object> result = orderService.createOrder(order);
        
        // 更新邀请状态为"paid"
        invitationMapper.updateOrderId(invitationId, orderId);
        
        return orderId;
    }

    @Override
    public List<TogetherDrinkInvitation> getUserInvitations(String userId) {
        List<TogetherDrinkInvitation> creatorInvitations = invitationMapper.findByCreatorId(userId);
        List<TogetherDrinkInvitation> participantInvitations = invitationMapper.findByParticipantId(userId);
        
        // 合并两个列表
        creatorInvitations.addAll(participantInvitations);
        return creatorInvitations;
    }

    @Override
    @Transactional
    public void handleExpiredInvitations() {
        // 将LocalDateTime转换为Date
        Date now = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
        invitationMapper.updateExpiredInvitations(now);
    }
    
    @Override
    public Order createTogetherOrder(String inviteCode, Map<String, Object> orderInfo) {
        TogetherDrinkInvitation invitation = getInvitationByCode(inviteCode);
        if (invitation == null || !"joined".equals(invitation.getStatus())) {
            return null;
        }
        
        String orderAddress = (String) orderInfo.get("address");
        if (orderAddress == null || orderAddress.isEmpty()) {
            return null;
        }
        
        String orderId = completeInvitation(invitation.getId(), orderAddress);
        if (orderId == null) {
            return null;
        }
        
        // 获取创建的订单
        return orderService.getOrderById(orderId);
    }
    
    @Override
    public boolean isInvitationValid(String inviteCode) {
        TogetherDrinkInvitation invitation = getInvitationByCode(inviteCode);
        if (invitation == null) {
            return false;
        }
        
        // 检查是否过期
        if (invitation.isExpired()) {
            return false;
        }
        
        // 检查状态是否为created（等待加入）
        return "created".equals(invitation.getStatus());
    }
    
    /**
     * 生成随机邀请码
     */
    private String generateInviteCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
            code.append(INVITE_CODE_CHARS[random.nextInt(INVITE_CODE_CHARS.length)]);
        }
        
        // 验证唯一性，如果已存在则重新生成
        TogetherDrinkInvitation existing = invitationMapper.findByInviteCode(code.toString());
        if (existing != null) {
            return generateInviteCode();
        }
        
        return code.toString();
    }
} 