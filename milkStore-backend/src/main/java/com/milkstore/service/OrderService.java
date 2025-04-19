package com.milkstore.service;

import com.milkstore.entity.Order;

import java.util.List;
import java.util.Map;

/**
 * 订单服务接口
 */
public interface OrderService {

    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建结果
     */
    Map<String, Object> createOrder(Order order);
    
    /**
     * 通过用户ID查询订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    List<Order> getOrdersByUserId(String userId);
    
    /**
     * 通过订单ID查询订单
     * @param orderId 订单ID
     * @return 订单信息
     */
    Order getOrderById(String orderId);
    
    /**
     * 取消订单
     * @param orderId 订单ID
     * @return 取消结果
     */
    boolean cancelOrder(String orderId);
    
    /**
     * 支付订单
     * @param orderId 订单ID
     * @param paymentMethod 支付方式
     * @return 支付结果
     */
    boolean payOrder(String orderId, String paymentMethod);
    
    /**
     * 完成订单
     * @param orderId 订单ID
     * @return 完成结果
     */
    boolean completeOrder(String orderId);
    
    /**
     * 删除订单
     * @param orderId 订单ID
     * @return 删除结果
     */
    boolean deleteOrder(String orderId);
    
    /**
     * 获取用户指定状态的订单
     * @param userId 用户ID
     * @param status 订单状态
     * @return 订单列表
     */
    List<Order> getOrdersByUserIdAndStatus(String userId, String status);
    
    /**
     * 生成订单号
     * @return 订单号
     */
    String generateOrderId();
} 