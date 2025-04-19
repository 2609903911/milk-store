package com.milkstore.mapper;

import com.milkstore.entity.Order;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 订单Mapper接口
 */
@Mapper
public interface OrderMapper {

    /**
     * 通过用户ID查询所有订单
     * @param userId 用户ID
     * @return 订单列表
     */
    @Select("SELECT * FROM orders WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<Order> findByUserId(String userId);
    
    /**
     * 通过订单ID查询订单
     * @param orderId 订单ID
     * @return 订单
     */
    @Select("SELECT * FROM orders WHERE order_id = #{orderId}")
    Order findByOrderId(String orderId);
    
    /**
     * 创建订单
     * @param order 订单对象
     * @return 影响的行数
     */
    @Insert("INSERT INTO orders(order_id, user_id, order_status, total_amount, " +
            "discount_amount, actual_amount, coupon_id, payment_method, delivery_type, " +
            "store_name, store_address, contact_name, contact_phone, delivery_address, " +
            "order_items, create_time, pay_time, complete_time, remark) " +
            "VALUES(#{orderId}, #{userId}, #{orderStatus}, #{totalAmount}, " +
            "#{discountAmount}, #{actualAmount}, #{couponId}, #{paymentMethod}, #{deliveryType}, " +
            "#{storeName}, #{storeAddress}, #{contactName}, #{contactPhone}, #{deliveryAddress}, " +
            "#{orderItems}, #{createTime}, #{payTime}, #{completeTime}, #{remark})")
    int insert(Order order);
    
    /**
     * 更新订单状态
     * @param orderId 订单ID
     * @param orderStatus 订单状态
     * @return 影响的行数
     */
    @Update("UPDATE orders SET order_status = #{orderStatus} WHERE order_id = #{orderId}")
    int updateStatus(@Param("orderId") String orderId, @Param("orderStatus") String orderStatus);
    
    /**
     * 更新支付信息
     * @param orderId 订单ID
     * @param paymentMethod 支付方式
     * @return 影响的行数
     */
    @Update("UPDATE orders SET order_status = 'paid', payment_method = #{paymentMethod}, " +
            "pay_time = NOW() WHERE order_id = #{orderId}")
    int updatePayment(@Param("orderId") String orderId, @Param("paymentMethod") String paymentMethod);
    
    /**
     * 删除订单
     * @param orderId 订单ID
     * @return 影响的行数
     */
    @Delete("DELETE FROM orders WHERE order_id = #{orderId}")
    int delete(String orderId);
    
    /**
     * 查询用户指定状态的订单
     * @param userId 用户ID
     * @param orderStatus 订单状态
     * @return 订单列表
     */
    @Select("SELECT * FROM orders WHERE user_id = #{userId} AND order_status = #{orderStatus} " +
            "ORDER BY create_time DESC")
    List<Order> findByUserIdAndStatus(@Param("userId") String userId, @Param("orderStatus") String orderStatus);
} 