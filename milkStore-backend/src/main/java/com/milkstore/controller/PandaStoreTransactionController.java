package com.milkstore.controller;

import com.milkstore.entity.PandaStoreTransaction;
import com.milkstore.service.PandaStoreTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class PandaStoreTransactionController {

    @Autowired
    private PandaStoreTransactionService transactionService;

    /**
     * 创建新交易
     * POST /api/transactions
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTransaction(@RequestBody PandaStoreTransaction transaction) {
        Map<String, Object> result = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(result);
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