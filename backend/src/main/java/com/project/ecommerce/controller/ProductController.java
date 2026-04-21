package com.project.ecommerce.controller;

import com.project.ecommerce.product.ProductService;
import com.project.ecommerce.product.dto.ProductRequestDto;
import com.project.ecommerce.product.dto.ProductResponseDto;
import com.project.ecommerce.response.ResponsePage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/products")
public class ProductController {

    private final ProductService productService;

    // Create product
    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(
            @RequestBody @Valid ProductRequestDto dto
    ) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    // Get product by name
    @GetMapping("/search")
    public ResponseEntity<ProductResponseDto> getByName(@RequestParam String name){
        return ResponseEntity.ok(productService.getByName(name));
    }

    // Get all products
    @GetMapping
    public ResponseEntity<ResponsePage<ProductResponseDto>> getAllProducts(Pageable pageable){
        return ResponseEntity.ok(
            productService.getAllProducts(pageable)
        );
    }


}
