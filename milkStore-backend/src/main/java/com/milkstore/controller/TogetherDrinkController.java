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
@RequestMapping("/api/together-drink")
public class TogetherDrinkController {

    @Autowired
    private TogetherDrinkService togetherDrinkService;
    
    @Autowired
    private MilkStoreProductService productService;

    /**
     * 创建一起喝邀请
     * @param params 请求参数
     * @return 返回响应
     */
    @PostMapping("/invitations")
    public Result<Map<String, Object>> createInvitation(@RequestBody Map<String, Object> params) {
        try {
            System.out.println("收到创建邀请请求: " + params);
            
            String userId = (String) params.get("userId");
            if (userId == null) {
                return Result.error("用户ID不能为空");
            }

            Long productId;
            try {
                productId = Long.parseLong(params.get("productId").toString());
            } catch (Exception e) {
                return Result.error("商品ID格式不正确");
            }
            
            // 如果前端已提供商品详情，直接使用
            String productName = (String) params.get("productName");
            String productImage = (String) params.get("productImage");
            Double productPrice = null;
            
            try {
                if (params.get("productPrice") != null) {
                    productPrice = Double.parseDouble(params.get("productPrice").toString());
                }
            } catch (Exception e) {
                return Result.error("商品价格格式不正确");
            }
            
            // 若前端未提供完整商品信息，则从数据库获取
            if (productName == null || productImage == null || productPrice == null) {
                Map<String, Object> productInfo = productService.getProductById(productId);
                if (productInfo == null) {
                    return Result.error("商品不存在");
                }
                
                productName = productName != null ? productName : (String) productInfo.get("name");
                productImage = productImage != null ? productImage : (String) productInfo.get("image");
                productPrice = productPrice != null ? productPrice : Double.parseDouble(productInfo.get("price").toString());
            }

            System.out.println("开始创建邀请, userId=" + userId + ", productId=" + productId);
            
            // 创建邀请
            TogetherDrinkInvitation created = togetherDrinkService.createInvitation(
                userId, productId, productName, productImage, productPrice);
                
            if (created == null) {
                return Result.error("创建邀请失败");
            }

            System.out.println("邀请创建成功: id=" + created.getId() + ", code=" + created.getInviteCode());
            
            Map<String, Object> result = new HashMap<>();
            result.put("invitationId", created.getId());
            result.put("inviteCode", created.getInviteCode());
            return Result.success("创建成功", result);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("创建邀请时发生异常: " + e.getMessage());
            return Result.error("创建邀请失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取邀请详情
     * @param invitationId 邀请ID
     * @return 返回响应
     */
    @GetMapping("/invitations/{invitationId}")
    public Result<Map<String, Object>> getInvitationById(@PathVariable Long invitationId) {
        TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationById(invitationId);
        if (invitation == null) {
            return Result.error("邀请不存在");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("invitation", invitation);
        return Result.success("获取成功", result);
    }

    /**
     * 通过邀请码获取邀请信息
     * @param inviteCode 邀请码
     * @return 返回响应
     */
    @GetMapping("/invitations/code/{inviteCode}")
    public Result<Map<String, Object>> getInvitationByCode(@PathVariable String inviteCode) {
        try {
            TogetherDrinkInvitation invitation = togetherDrinkService.getInvitationByCode(inviteCode);
            if (invitation == null) {
                return Result.error("邀请不存在或已过期");
            }

            Map<String, Object> result = new HashMap<>();
            result.put("invitation", invitation);
            
            // 额外添加一些常用字段，便于前端直接访问
            result.put("invitationId", invitation.getId());
            result.put("inviteCode", invitation.getInviteCode());
            result.put("creatorId", invitation.getCreatorId());
            result.put("productId", invitation.getProductId());
            result.put("status", invitation.getStatus());
            
            // 创建者信息
            Map<String, Object> creatorInfo = new HashMap<>();
            creatorInfo.put("userId", invitation.getCreatorId());
            creatorInfo.put("nickname", invitation.getCreatorNickname());
            creatorInfo.put("avatar", invitation.getCreatorAvatar());
            result.put("creatorInfo", creatorInfo);
            
            // 产品信息
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productId", invitation.getProductId());
            productInfo.put("productName", invitation.getProductName());
            productInfo.put("productPrice", invitation.getProductPrice());
            productInfo.put("productImage", invitation.getProductImage());
            result.put("productInfo", productInfo);
            
            return Result.success("获取成功", result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取邀请信息失败: " + e.getMessage());
        }
    }

    /**
     * 加入一起喝邀请
     * @param invitationId 邀请ID
     * @param params 请求参数
     * @return 返回响应
     */
    @PostMapping("/invitations/{invitationId}/join")
    public Result<Map<String, Object>> joinInvitation(
            @PathVariable Long invitationId, 
            @RequestBody Map<String, Object> params) {
        
        String userId = (String) params.get("userId");
        if (userId == null) {
            return Result.error("用户ID不能为空");
        }

        // 加入邀请
        try {
            TogetherDrinkInvitation joinedInvitation = togetherDrinkService.joinInvitation(invitationId, userId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("invitation", joinedInvitation);
            return Result.success("加入成功", result);
        } catch (IllegalStateException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("加入邀请失败: " + e.getMessage());
        }
    }

    /**
     * 取消一起喝邀请
     * @param invitationId 邀请ID
     * @param params 请求参数
     * @return 返回响应
     */
    @PutMapping("/invitations/{invitationId}/cancel")
    public Result<Void> cancelInvitation(
            @PathVariable Long invitationId,
            @RequestBody Map<String, Object> params) {
        
        String userId = (String) params.get("userId");
        if (userId == null) {
            return Result.error("用户ID不能为空");
        }

        // 取消邀请
        boolean success = togetherDrinkService.cancelInvitation(invitationId, userId);
        if (!success) {
            return Result.error("取消邀请失败，可能您不是创建者或邀请已过期");
        }

        return Result.success("取消成功", null);
    }

    /**
     * 完成邀请并创建订单
     * @param invitationId 邀请ID
     * @param params 订单信息
     * @return 返回响应
     */
    @PostMapping("/invitations/{invitationId}/complete")
    public Result<Map<String, Object>> completeInvitation(
            @PathVariable Long invitationId,
            @RequestBody Map<String, Object> params) {
        
        String orderAddress = (String) params.get("orderAddress");
        if (orderAddress == null || orderAddress.isEmpty()) {
            return Result.error("请提供收货地址");
        }

        try {
            // 完成邀请并创建订单
            String orderId = togetherDrinkService.completeInvitation(invitationId, orderAddress);
            if (orderId == null) {
                return Result.error("创建订单失败");
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("orderId", orderId);
            return Result.success("创建订单成功", result);
        } catch (IllegalStateException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("创建订单失败: " + e.getMessage());
        }
    }

    /**
     * 获取用户参与的一起喝邀请列表
     * @param userId 用户ID
     * @return 返回响应
     */
    @GetMapping("/invitations/user/{userId}")
    public Result<Map<String, Object>> getUserInvitations(@PathVariable String userId) {
        if (userId == null) {
            return Result.error("用户ID不能为空");
        }

        List<TogetherDrinkInvitation> invitations = togetherDrinkService.getUserInvitations(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("invitations", invitations);
        return Result.success("获取成功", result);
    }
} 