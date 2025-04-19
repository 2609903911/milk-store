package com.milkstore.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.milkstore.common.OrderVO;
import com.milkstore.entity.Order;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单转换工具类
 */
public class OrderConverter {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 将订单实体转换为VO对象
     * @param order 订单实体
     * @return 订单VO
     */
    public static OrderVO toOrderVO(Order order) {
        if (order == null) {
            return null;
        }
        
        OrderVO orderVO = new OrderVO();
        // 复制基本属性
        BeanUtils.copyProperties(order, orderVO);
        
        // 设置状态显示文本
        orderVO.setOrderStatusText(getOrderStatusText(order.getOrderStatus()));
        
        // 设置支付方式显示文本
        orderVO.setPaymentMethodText(getPaymentMethodText(order.getPaymentMethod()));
        
        // 设置配送方式显示文本
        orderVO.setDeliveryTypeText("self".equals(order.getDeliveryType()) ? "自取" : "外卖");
        
        // 解析订单商品JSON
        try {
            if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                List<Map<String, Object>> itemMaps = objectMapper.readValue(
                        order.getOrderItems(), 
                        new TypeReference<List<Map<String, Object>>>() {});
                
                List<OrderVO.OrderItemVO> orderItems = new ArrayList<>();
                
                for (Map<String, Object> itemMap : itemMaps) {
                    OrderVO.OrderItemVO itemVO = new OrderVO.OrderItemVO();
                    
                    // 设置商品信息
                    if (itemMap.containsKey("product_id")) {
                        itemVO.setProductId(Integer.valueOf(itemMap.get("product_id").toString()));
                    }
                    if (itemMap.containsKey("name")) {
                        itemVO.setName(itemMap.get("name").toString());
                    }
                    if (itemMap.containsKey("price")) {
                        itemVO.setPrice(new java.math.BigDecimal(itemMap.get("price").toString()));
                    }
                    if (itemMap.containsKey("quantity")) {
                        itemVO.setQuantity(Integer.valueOf(itemMap.get("quantity").toString()));
                    }
                    if (itemMap.containsKey("specs")) {
                        itemVO.setSpecs(itemMap.get("specs").toString());
                    }
                    if (itemMap.containsKey("image")) {
                        itemVO.setImage(itemMap.get("image").toString());
                    }
                    
                    orderItems.add(itemVO);
                }
                
                orderVO.setOrderItems(orderItems);
            }
        } catch (JsonProcessingException e) {
            // 解析失败，设置空列表
            orderVO.setOrderItems(new ArrayList<>());
        }
        
        return orderVO;
    }
    
    /**
     * 将多个订单实体转换为VO列表
     * @param orders 订单实体列表
     * @return 订单VO列表
     */
    public static List<OrderVO> toOrderVOList(List<Order> orders) {
        if (orders == null) {
            return new ArrayList<>();
        }
        
        List<OrderVO> orderVOs = new ArrayList<>();
        for (Order order : orders) {
            OrderVO orderVO = toOrderVO(order);
            if (orderVO != null) {
                orderVOs.add(orderVO);
            }
        }
        
        return orderVOs;
    }
    
    /**
     * 获取订单状态显示文本
     * @param status 状态代码
     * @return 状态文本
     */
    private static String getOrderStatusText(String status) {
        if (status == null) {
            return "未知状态";
        }
        
        switch (status) {
            case "pending":
                return "待支付";
            case "paid":
                return "已支付";
            case "completed":
                return "已完成";
            case "cancelled":
                return "已取消";
            case "refunded":
                return "已退款";
            default:
                return "未知状态";
        }
    }
    
    /**
     * 获取支付方式显示文本
     * @param paymentMethod 支付方式代码
     * @return 支付方式文本
     */
    private static String getPaymentMethodText(String paymentMethod) {
        if (paymentMethod == null) {
            return "未支付";
        }
        
        switch (paymentMethod) {
            case "wechat":
                return "微信支付";
            case "alipay":
                return "支付宝";
            case "balance":
                return "余额支付";
            case "cash":
                return "现金支付";
            default:
                return paymentMethod;
        }
    }
} 