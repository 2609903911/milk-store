package com.milkstore.controller;

import com.milkstore.common.OrderVO;
import com.milkstore.entity.Order;
import com.milkstore.service.OrderService;
import com.milkstore.utils.OrderConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单控制器
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建结果
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Order order) {
        Map<String, Object> response = orderService.createOrder(order);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取用户所有订单
     * @param userId 用户ID
     * @return 订单列表
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        List<Order> orders = orderService.getOrdersByUserId(userId);
        List<OrderVO> orderVOs = OrderConverter.toOrderVOList(orders);
        
        response.put("code", 200);
        response.put("message", "获取订单成功");
        response.put("data", orderVOs);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 获取用户指定状态的订单
     * @param userId 用户ID
     * @param status 订单状态
     * @return 订单列表
     */
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<Map<String, Object>> getUserOrdersByStatus(
            @PathVariable String userId, 
            @PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        List<Order> orders = orderService.getOrdersByUserIdAndStatus(userId, status);
        List<OrderVO> orderVOs = OrderConverter.toOrderVOList(orders);
        
        response.put("code", 200);
        response.put("message", "获取订单成功");
        response.put("data", orderVOs);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 获取订单详情
     * @param orderId 订单ID
     * @return 订单信息
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable String orderId) {
        Map<String, Object> response = new HashMap<>();
        Order order = orderService.getOrderById(orderId);
        
        if (order != null) {
            OrderVO orderVO = OrderConverter.toOrderVO(order);
            response.put("code", 200);
            response.put("message", "获取订单成功");
            response.put("data", orderVO);
        } else {
            response.put("code", 404);
            response.put("message", "订单不存在");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 取消订单
     * @param orderId 订单ID
     * @return 取消结果
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable String orderId) {
        Map<String, Object> response = new HashMap<>();
        boolean success = orderService.cancelOrder(orderId);
        
        if (success) {
            response.put("code", 200);
            response.put("message", "订单取消成功");
        } else {
            response.put("code", 400);
            response.put("message", "订单取消失败");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 支付订单
     * @param orderId 订单ID
     * @param paymentInfo 支付信息
     * @return 支付结果
     */
    @PutMapping("/{orderId}/pay")
    public ResponseEntity<Map<String, Object>> payOrder(
            @PathVariable String orderId, 
            @RequestBody Map<String, String> paymentInfo) {
        Map<String, Object> response = new HashMap<>();
        String paymentMethod = paymentInfo.get("paymentMethod");
        
        boolean success = orderService.payOrder(orderId, paymentMethod);
        
        if (success) {
            response.put("code", 200);
            response.put("message", "订单支付成功");
        } else {
            response.put("code", 400);
            response.put("message", "订单支付失败");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 完成订单
     * @param orderId 订单ID
     * @return 完成结果
     */
    @PutMapping("/{orderId}/complete")
    public ResponseEntity<Map<String, Object>> completeOrder(@PathVariable String orderId) {
        Map<String, Object> response = new HashMap<>();
        boolean success = orderService.completeOrder(orderId);
        
        if (success) {
            response.put("code", 200);
            response.put("message", "订单完成成功");
        } else {
            response.put("code", 400);
            response.put("message", "订单完成失败");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 删除订单
     * @param orderId 订单ID
     * @return 删除结果
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable String orderId) {
        Map<String, Object> response = new HashMap<>();
        boolean success = orderService.deleteOrder(orderId);
        
        if (success) {
            response.put("code", 200);
            response.put("message", "订单删除成功");
        } else {
            response.put("code", 400);
            response.put("message", "订单删除失败");
        }
        
        return ResponseEntity.ok(response);
    }
} 