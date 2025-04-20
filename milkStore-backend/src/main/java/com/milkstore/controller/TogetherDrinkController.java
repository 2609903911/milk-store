package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.TogetherDrinkInvitation;
import com.milkstore.service.TogetherDrinkService;
import com.milkstore.service.MilkStoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 一起喝功能控制器
 */
@RestController
@RequestMapping("/together-drink")
public class TogetherDrinkController {

    @Autowired
    private TogetherDrinkService togetherDrinkService;
    
    @Autowired
    private MilkStoreProductService productService;

    /**
     * 创建一起喝邀请
     * @param params 请求参数
     * @param session 会话信息
     * @return 返回响应
     */
    @PostMapping("/create")
    public Result<Map<String, Object>> createInvitation(@RequestBody Map<String, Object> params, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("用户未登录");
        }

        Long productId;
        try {
            productId = Long.parseLong(params.get("productId").toString());
        } catch (Exception e) {
            return Result.error("商品ID格式不正确");
        }
        
        // 获取商品信息
        Map<String, Object> productInfo = productService.getProductById(productId);
        if (productInfo == null) {
            return Result.error("商品不存在");
        }
        
        String productName = (String) productInfo.get("name");
        String productImage = (String) productInfo.get("image");
        Double productPrice = Double.parseDouble(productInfo.get("price").toString());

        // 创建邀请
        TogetherDrinkInvitation created = togetherDrinkService.createInvitation(
            userId, productId, productName, productImage, productPrice);
            
        if (created == null) {
            return Result.error("创建邀请失败");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("invitation", created);
        return Result.success("创建成功", result);
    }

    /**
     * 通过邀请码获取邀请信息
     * @param inviteCode 邀请码
     * @return 返回响应
     */
    @GetMapping("/invitation/{inviteCode}")
    public Result<Map<String, Object>> getInvitation(@PathVariable String inviteCode) {
        TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationByCode(inviteCode);
        if (invitation == null) {
            return Result.error("邀请不存在或已过期");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("invitation", invitation);
        return Result.success("获取成功", result);
    }

    /**
     * 加入一起喝邀请
     * @param inviteCode 邀请码
     * @param session 会话信息
     * @return 返回响应
     */
    @PostMapping("/join/{inviteCode}")
    public Result<Map<String, Object>> joinInvitation(@PathVariable String inviteCode, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("用户未登录");
        }

        // 检查邀请是否有效
        if (!togetherDrinkService.isInvitationValid(inviteCode)) {
            return Result.error("邀请不存在或已过期");
        }
        
        // 先获取邀请信息
        TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationByCode(inviteCode);
        if (invitation == null) {
            return Result.error("邀请不存在");
        }

        // 加入邀请
        TogetherDrinkInvitation joinedInvitation = togetherDrinkService.joinInvitation(invitation.getId(), userId);
        if (joinedInvitation == null) {
            return Result.error("加入邀请失败");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("invitation", joinedInvitation);
        return Result.success("加入成功", result);
    }

    /**
     * 取消一起喝邀请
     * @param inviteCode 邀请码
     * @param session 会话信息
     * @return 返回响应
     */
    @PostMapping("/cancel/{inviteCode}")
    public Result<Map<String, Object>> cancelInvitation(@PathVariable String inviteCode, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("用户未登录");
        }
        
        // 先获取邀请信息
        TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationByCode(inviteCode);
        if (invitation == null) {
            return Result.error("邀请不存在");
        }

        // 取消邀请
        boolean success = togetherDrinkService.cancelInvitation(invitation.getId(), userId);
        if (!success) {
            return Result.error("取消邀请失败，可能您不是创建者或邀请已过期");
        }

        return Result.success("取消成功", null);
    }

    /**
     * 创建共享订单
     * @param inviteCode 邀请码
     * @param params 订单信息
     * @param session 会话信息
     * @return 返回响应
     */
    @PostMapping("/create-order/{inviteCode}")
    public Result<Map<String, Object>> createTogetherOrder(
            @PathVariable String inviteCode,
            @RequestBody Map<String, Object> params,
            HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("用户未登录");
        }

        // 获取邀请信息
        TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationByCode(inviteCode);
        if (invitation == null) {
            return Result.error("邀请不存在或已过期");
        }

        // 验证用户是否为创建者或参与者
        if (!userId.equals(invitation.getCreatorId()) && !userId.equals(invitation.getParticipantId())) {
            return Result.error("您不是该邀请的参与者，无法创建订单");
        }

        // 检查邀请是否已加入且未过期
        if (!invitation.isReadyForOrder()) {
            return Result.error("邀请状态不正确，无法创建订单");
        }
        
        // 获取地址信息
        String orderAddress = (String) params.get("address");
        if (orderAddress == null || orderAddress.isEmpty()) {
            return Result.error("请提供收货地址");
        }

        // 完成邀请并创建订单
        String orderId = togetherDrinkService.completeInvitation(invitation.getId(), orderAddress);
        if (orderId == null) {
            return Result.error("创建订单失败");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderId);
        return Result.success("创建订单成功", result);
    }

    /**
     * 获取用户相关的一起喝邀请列表
     * @param session 会话信息
     * @return 返回响应
     */
    @GetMapping("/my-invitations")
    public Result<Map<String, Object>> getUserInvitations(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("用户未登录");
        }

        List<TogetherDrinkInvitation> invitations = togetherDrinkService.getUserInvitations(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("invitations", invitations);
        return Result.success("获取成功", result);
    }
} 