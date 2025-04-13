package com.milkstore.controller;

import com.milkstore.entity.MilkProduct;
import com.milkstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/milk-products")
public class MilkStoreProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<MilkProduct>> getAllProducts() {
        return ResponseEntity.ok(productService.findAllActiveProducts());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<MilkProduct>> getAllProductsIncludingInactive() {
        return ResponseEntity.ok(productService.findAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MilkProduct> getProductById(@PathVariable Integer id) {
        MilkProduct product = productService.findById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MilkProduct>> getProductsByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(productService.findByCategoryId(categoryId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MilkProduct>> searchProductsByName(@RequestParam String name) {
        return ResponseEntity.ok(productService.findByName(name));
    }
} 