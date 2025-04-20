package com.milkstore.service.impl;

import com.milkstore.entity.Order;
import com.milkstore.mapper.OrderMapper;
import com.milkstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    @Transactional
    public Map<String, Object> createOrder(Order order) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 设置订单号
            if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
                order.setOrderId(generateOrderId());
            }
            
            // 设置初始状态为待支付
            if (order.getOrderStatus() == null || order.getOrderStatus().isEmpty()) {
                order.setOrderStatus("completed");
            }
            
            // 设置创建时间
            if (order.getCreateTime() == null) {
                order.setCreateTime(LocalDateTime.now());
            }
            
            // 执行插入
            int rows = orderMapper.insert(order);
            
            if (rows > 0) {
                result.put("success", true);
                result.put("orderId", order.getOrderId());
                result.put("message", "订单创建成功");
            } else {
                result.put("success", false);
                result.put("message", "订单创建失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "订单创建异常: " + e.getMessage());
        }
        
        return result;
    }

    @Override
    public List<Order> getOrdersByUserId(String userId) {
        return orderMapper.findByUserId(userId);
    }

    @Override
    public Order getOrderById(String orderId) {
        return orderMapper.findByOrderId(orderId);
    }

    @Override
    @Transactional
    public boolean cancelOrder(String orderId) {
        return orderMapper.updateStatus(orderId, "cancelled") > 0;
    }

    @Override
    @Transactional
    public boolean payOrder(String orderId, String paymentMethod) {
        return orderMapper.updatePayment(orderId, paymentMethod) > 0;
    }

    @Override
    @Transactional
    public boolean completeOrder(String orderId) {
        // 更新订单状态为已完成，并设置完成时间
        Order order = new Order();
        order.setOrderId(orderId);
        order.setOrderStatus("completed");
        order.setCompleteTime(LocalDateTime.now());
        
        return orderMapper.updateStatus(orderId, "completed") > 0;
    }

    @Override
    @Transactional
    public boolean deleteOrder(String orderId) {
        return orderMapper.delete(orderId) > 0;
    }

    @Override
    public List<Order> getOrdersByUserIdAndStatus(String userId, String status) {
        return orderMapper.findByUserIdAndStatus(userId, status);
    }

    @Override
    public String generateOrderId() {
        // 生成格式为：ORD + 年月日 + 6位随机数
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String dateStr = LocalDateTime.now().format(formatter);
        
        // 生成6位随机数
        Random random = new Random();
        int randomNum = 100000 + random.nextInt(900000);
        
        return "ORD" + dateStr + randomNum;
    }
} 