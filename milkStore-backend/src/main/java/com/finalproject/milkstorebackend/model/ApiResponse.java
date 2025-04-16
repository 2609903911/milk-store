package com.finalproject.milkstorebackend.model;

import lombok.Data;

/**
 * 通用API响应类
 */
@Data
public class ApiResponse<T> {
    private Integer code;
    private String message;
    private T data;
    
    public ApiResponse() {}
    
    public ApiResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return new ApiResponse<>(code, message, null);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return error(500, message);
    }
} 