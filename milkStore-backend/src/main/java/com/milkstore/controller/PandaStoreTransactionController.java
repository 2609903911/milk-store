package com.milkstore.controller;

import com.milkstore.entity.PandaStoreTransaction;
import com.milkstore.entity.UserCoupon;
import com.milkstore.entity.StoreProduct;
import com.milkstore.service.PandaStoreTransactionService;
import com.milkstore.service.StoreProductService;
import com.milkstore.mapper.CouponTemplateMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "false", maxAge = 3600)
public class PandaStoreTransactionController {

    @Autowired
    private PandaStoreTransactionService transactionService;
    
    @Autowired
    private StoreProductService storeProductService;
    
    @Autowired
    private CouponTemplateMapper couponTemplateMapper;

    /**
     * 创建新交易
     * POST /api/transactions
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTransaction(@RequestBody PandaStoreTransaction transaction) {
        // 判断交易类型
        if ("coupon".equals(transaction.getTransactionType())) {
            // 从商品表中查找商品信息
            StoreProduct product = storeProductService.findProductById(transaction.getProductId());
            if (product == null) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("message", "商品不存在");
                return ResponseEntity.ok(errorResult);
            }
            
            // 查找对应的优惠券模板ID
            Long couponTemplateId = null;
            
            // 先尝试按code查找优惠券模板
            if (product.getId() != null) {
                // 使用产品的ID作为模板的code去查找
                var template = couponTemplateMapper.findByCode(product.getId());
                if (template != null) {
                    couponTemplateId = template.getId();
                }
            }
            
            // 如果通过code找不到，则使用用户传递的couponId
            if (couponTemplateId == null && transaction.getCouponId() != null) {
                couponTemplateId = transaction.getCouponId();
            }
            
            // 如果还是找不到，则抛出错误
            if (couponTemplateId == null) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("message", "无法找到对应的优惠券模板");
                return ResponseEntity.ok(errorResult);
            }
            
            // 创建用户优惠券对象
            UserCoupon userCoupon = new UserCoupon();
            userCoupon.setCouponTemplateId(couponTemplateId);
            userCoupon.setUserId(transaction.getUserId());
            userCoupon.setStatus("valid");
            userCoupon.setClaimTime(new Date());
            userCoupon.setCouponCode("USER_" + transaction.getUserId() + "_" + product.getId() + "_" + System.currentTimeMillis());
            
            // 调用优惠券交易服务
            Map<String, Object> result = transactionService.createCouponTransaction(transaction, userCoupon);
            return ResponseEntity.ok(result);
        } else if ("lightstar".equals(transaction.getTransactionType())) {
            // 调用点亮星交易服务
            Map<String, Object> result = transactionService.createLightstarTransaction(transaction);
            return ResponseEntity.ok(result);
        } else {
            // 默认交易处理
            Map<String, Object> result = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(result);
        }
    }
    
    /**
     * 专门用于优惠券兑换的接口
     * POST /api/transactions/coupon
     */
    @PostMapping("/coupon")
    public ResponseEntity<Map<String, Object>> createCouponTransaction(
            @RequestBody Map<String, Object> requestData) {
        
        try {
            // 从请求中提取交易信息
            PandaStoreTransaction transaction = new PandaStoreTransaction();
            transaction.setUserId((String) requestData.get("userId"));
            transaction.setProductId((String) requestData.get("productId"));
            transaction.setTransactionType("coupon");
            transaction.setCoinsSpent((Integer) requestData.get("coinsSpent"));
            transaction.setQuantity(1);
            
            // 从商品表中查找商品信息
            StoreProduct product = storeProductService.findProductById(transaction.getProductId());
            if (product == null) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("message", "商品不存在");
                return ResponseEntity.ok(errorResult);
            }
            
            // 从请求中提取优惠券信息
            UserCoupon userCoupon = new UserCoupon();
            // 尝试使用请求中的couponTemplateId
            Long couponTemplateId = null;
            if (requestData.containsKey("couponTemplateId")) {
                try {
                    couponTemplateId = Long.valueOf(requestData.get("couponTemplateId").toString());
                } catch (Exception e) {
                    // 解析失败，尝试其他方式
                }
            }
            
            // 如果请求中没有提供有效的couponTemplateId，尝试通过code查找
            if (couponTemplateId == null && product.getId() != null) {
                var template = couponTemplateMapper.findByCode(product.getId());
                if (template != null) {
                    couponTemplateId = template.getId();
                }
            }
            
            // 如果还是找不到，返回错误
            if (couponTemplateId == null) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("message", "无法找到对应的优惠券模板");
                return ResponseEntity.ok(errorResult);
            }
            
            userCoupon.setCouponTemplateId(couponTemplateId);
            userCoupon.setUserId(transaction.getUserId());
            userCoupon.setStatus("valid");
            userCoupon.setClaimTime(new Date());
            
            // 获取优惠券代码
            String couponCode;
            if (requestData.containsKey("couponCode") && requestData.get("couponCode") != null) {
                couponCode = requestData.get("couponCode").toString();
            } else {
                couponCode = product.getId();
            }
            
            // 生成短优惠券代码，防止超出数据库限制
            String shortUserId = transaction.getUserId().length() > 8 ? 
                transaction.getUserId().substring(0, 8) : transaction.getUserId();
            String shortCode = couponCode.length() > 10 ? 
                couponCode.substring(0, 10) : couponCode;
            String shortTimestamp = String.valueOf(System.currentTimeMillis() % 10000000); // 只取7位
            
            userCoupon.setCouponCode("U" + shortUserId + "C" + shortCode + "T" + shortTimestamp);
            
            // 调用优惠券交易服务
            Map<String, Object> result = transactionService.createCouponTransaction(transaction, userCoupon);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("message", "创建优惠券交易失败: " + e.getMessage());
            return ResponseEntity.ok(errorResult);
        }
    }
    
    /**
     * 专门用于点亮星兑换的接口
     * POST /api/transactions/lightstar
     */
    @PostMapping("/lightstar")
    public ResponseEntity<Map<String, Object>> createLightstarTransaction(
            @RequestBody Map<String, Object> requestData) {
        
        try {
            // 从请求中提取交易信息
            PandaStoreTransaction transaction = new PandaStoreTransaction();
            transaction.setUserId((String) requestData.get("userId"));
            transaction.setProductId((String) requestData.get("productId"));
            transaction.setTransactionType("lightstar");
            transaction.setCoinsSpent((Integer) requestData.get("coinsSpent"));
            transaction.setQuantity(1);
            transaction.setLightstarAmount((Integer) requestData.get("lightstarAmount"));
            
            // 调用点亮星交易服务
            Map<String, Object> result = transactionService.createLightstarTransaction(transaction);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("message", "创建点亮星交易失败: " + e.getMessage());
            return ResponseEntity.ok(errorResult);
        }
    }

    /**
     * 获取交易详情
     * GET /api/transactions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTransaction(@PathVariable("id") String transactionId) {
        PandaStoreTransaction transaction = transactionService.getTransactionById(transactionId);
        
        Map<String, Object> result = new HashMap<>();
        if (transaction != null) {
            result.put("success", true);
            result.put("transaction", transaction);
        } else {
            result.put("success", false);
            result.put("message", "交易记录不存在");
        }
        
        return ResponseEntity.ok(result);
    }

    /**
     * 获取用户的交易历史
     * GET /api/transactions/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserTransactions(@PathVariable("userId") String userId) {
        List<PandaStoreTransaction> transactions = transactionService.getUserTransactions(userId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("transactions", transactions);
        result.put("total", transactions.size());
        
        return ResponseEntity.ok(result);
    }

    /**
     * 分页获取所有交易记录
     * GET /api/transactions?page=1&size=10
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransactions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> result = transactionService.getAllTransactions(page, size);
        result.put("success", true);
        
        return ResponseEntity.ok(result);
    }

    /**
     * 更新交易状态
     * PUT /api/transactions/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateTransactionStatus(
            @PathVariable("id") String transactionId,
            @RequestParam String status) {
        
        boolean updated = transactionService.updateTransactionStatus(transactionId, status);
        
        Map<String, Object> result = new HashMap<>();
        if (updated) {
            result.put("success", true);
            result.put("message", "交易状态更新成功");
        } else {
            result.put("success", false);
            result.put("message", "交易状态更新失败");
        }
        
        return ResponseEntity.ok(result);
    }
} 