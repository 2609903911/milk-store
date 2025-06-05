package com.milkstore.service.impl;

import com.milkstore.entity.Order;
import com.milkstore.entity.User;
import com.milkstore.mapper.OrderMapper;
import com.milkstore.mapper.UserMapper;
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
    
    @Autowired
    private UserMapper userMapper;

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
                // 订单创建成功后，增加用户熊猫币
                String userId = order.getUserId();
                User user = userMapper.findById(userId);
                
                if (user != null) {
                    // 计算新的熊猫币余额 = 当前余额 + 订单总金额
                    int currentCoins = user.getPandaCoins();
                    int addCoins = order.getTotalAmount().intValue();
                    int newCoins = currentCoins + addCoins;
                    
                    // 更新用户熊猫币余额
                    userMapper.updateCoins(userId, newCoins);
                }
                
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
        // 获取订单信息
        Order order = orderMapper.findByOrderId(orderId);
        if (order != null) {
            // 更新订单支付状态
            boolean updateSuccess = orderMapper.updatePayment(orderId, paymentMethod) > 0;
            
            if (updateSuccess) {
                // 获取用户信息
                User user = userMapper.findById(order.getUserId());
                if (user != null) {
                    // 计算新的熊猫币余额 = 当前余额 + 实付金额
                    int currentCoins = user.getPandaCoins();
                    int addCoins = order.getActualAmount().intValue();
                    int newCoins = currentCoins + addCoins;
                    
                    // 更新用户熊猫币余额
                    userMapper.updateCoins(order.getUserId(), newCoins);
                }
            }
            
            return updateSuccess;
        }
        return false;
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