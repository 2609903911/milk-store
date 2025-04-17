package com.milkstore.controller;

import com.milkstore.common.Result;
import com.milkstore.entity.StoreProduct;
import com.milkstore.service.StoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 熊猫商城控制器
 */
@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "false", maxAge = 3600)
public class StoreController {

    @Autowired
    private StoreProductService storeProductService;

    /**
     * 获取所有商城商品
     */
    @GetMapping("/products")
    public Result<Object> getAllProducts() {
        try {
            List<StoreProduct> products = storeProductService.findAllProducts();
            return Result.success("获取商城商品成功", products);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取商城商品失败: " + e.getMessage());
        }
    }

    /**
     * 根据分类获取商城商品
     */
    @GetMapping("/products/category/{category}")
    public Result<Object> getProductsByCategory(@PathVariable String category) {
        try {
            List<StoreProduct> products = storeProductService.findProductsByCategory(category);
            return Result.success("获取分类商品成功", products);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取分类商品失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取商城商品
     */
    @GetMapping("/products/{id}")
    public Result<Object> getProductById(@PathVariable String id) {
        try {
            StoreProduct product = storeProductService.findProductById(id);
            if (product == null) {
                return Result.error(404, "商品不存在");
            }
            return Result.success("获取商品成功", product);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取商品失败: " + e.getMessage());
        }
    }

    /**
     * 添加商城商品（管理员接口）
     */
    @PostMapping("/admin/products")
    public Result<Object> addProduct(@RequestBody StoreProduct storeProduct) {
        try {
            boolean success = storeProductService.addProduct(storeProduct);
            if (success) {
                return Result.success("添加商品成功", storeProduct);
            } else {
                return Result.error(500, "添加商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "添加商品失败: " + e.getMessage());
        }
    }

    /**
     * 更新商城商品（管理员接口）
     */
    @PutMapping("/admin/products/{id}")
    public Result<Object> updateProduct(@PathVariable String id, @RequestBody StoreProduct storeProduct) {
        try {
            storeProduct.setId(id);
            boolean success = storeProductService.updateProduct(storeProduct);
            if (success) {
                return Result.success("更新商品成功", storeProduct);
            } else {
                return Result.error(500, "更新商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "更新商品失败: " + e.getMessage());
        }
    }

    /**
     * 删除商城商品（管理员接口）
     */
    @DeleteMapping("/admin/products/{id}")
    public Result<Object> deleteProduct(@PathVariable String id) {
        try {
            boolean success = storeProductService.deleteProduct(id);
            if (success) {
                return Result.success("删除商品成功", null);
            } else {
                return Result.error(500, "删除商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "删除商品失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取商城主页所需数据，包括分类和商品
     */
    @GetMapping("/home")
    public Result<Object> getStoreHome() {
        try {
            // 获取所有商品
            List<StoreProduct> allProducts = storeProductService.findAllProducts();
            
            // 获取按分类分组的商品
            Map<String, List<StoreProduct>> groupedProducts = new HashMap<>();
            
            // 分类：折扣券
            List<StoreProduct> discountProducts = storeProductService.findProductsByCategory("discount");
            if (!discountProducts.isEmpty()) {
                groupedProducts.put("discount", discountProducts);
            }
            
            // 分类：现金券
            List<StoreProduct> cashProducts = storeProductService.findProductsByCategory("cash");
            if (!cashProducts.isEmpty()) {
                groupedProducts.put("cash", cashProducts);
            }
            
            // 分类：免单券
            List<StoreProduct> freeProducts = storeProductService.findProductsByCategory("free");
            if (!freeProducts.isEmpty()) {
                groupedProducts.put("free", freeProducts);
            }
            
            // 分类：点亮星
            List<StoreProduct> lightStarProducts = storeProductService.findProductsByCategory("lightStar");
            if (!lightStarProducts.isEmpty()) {
                groupedProducts.put("lightStar", lightStarProducts);
            }
            
            // 分类：免运费券
            List<StoreProduct> shippingProducts = storeProductService.findProductsByCategory("shipping");
            if (!shippingProducts.isEmpty()) {
                groupedProducts.put("shipping", shippingProducts);
            }
            
            // 构建返回数据
            Map<String, Object> result = new HashMap<>();
            result.put("allProducts", allProducts);
            result.put("groupedProducts", groupedProducts);
            
            return Result.success("获取商城首页数据成功", result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(500, "获取商城首页数据失败: " + e.getMessage());
        }
    }
} 