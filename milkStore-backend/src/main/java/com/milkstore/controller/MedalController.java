package com.milkstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.milkstore.service.MedalService;
import com.milkstore.service.MedalTypeService;
import com.milkstore.entity.Medal;
import com.milkstore.entity.MedalType;
import com.milkstore.common.Result;

import java.util.List;
import java.util.Map;

/**
 * 勋章相关接口控制器
 */
@RestController
@RequestMapping("/api/medals")
public class MedalController {

    @Autowired
    private MedalService medalService;

    @Autowired
    private MedalTypeService medalTypeService;

    /**
     * 获取所有勋章类型
     */
    @GetMapping("/types")
    public Result<List<MedalType>> getAllMedalTypes() {
        List<MedalType> types = medalTypeService.findAllTypes();
        return Result.success("获取勋章类型成功", types);
    }

    /**
     * 获取所有勋章
     */
    @GetMapping("")
    public Result<List<Medal>> getAllMedals() {
        List<Medal> medals = medalService.findAllMedals();
        return Result.success("获取所有勋章成功", medals);
    }

    /**
     * 根据类型获取勋章
     */
    @GetMapping("/type/{typeId}")
    public Result<List<Medal>> getMedalsByType(@PathVariable String typeId) {
        List<Medal> medals = medalService.findMedalsByType(typeId);
        return Result.success("获取类型勋章成功", medals);
    }

    /**
     * 获取用户拥有的勋章
     */
    @GetMapping("/user/{userId}")
    public Result<Map<String, Object>> getUserMedals(@PathVariable String userId) {
        Map<String, Object> userMedals = medalService.findUserMedals(userId);
        return Result.success("获取用户勋章成功", userMedals);
    }
    
    /**
     * 使用点亮星激活勋章
     */
    @PostMapping("/activate")
    public Result<Map<String, Object>> activateMedal(@RequestParam String userId, @RequestParam String medalId) {
        Map<String, Object> result = medalService.activateMedalWithStar(userId, medalId);
        
        boolean success = (boolean) result.get("success");
        String message = (String) result.get("message");
        
        if (success) {
            return Result.success(message, result);
        } else {
            return Result.error(400, message);
        }
    }
} 