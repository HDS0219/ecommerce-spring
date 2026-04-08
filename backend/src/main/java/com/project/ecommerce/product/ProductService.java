package com.project.ecommerce.product;

import com.project.ecommerce.product.dto.ProductRequestDto;
import com.project.ecommerce.product.dto.ProductResponseDto;

public interface ProductService {
    ProductResponseDto createProduct(ProductRequestDto dto);
}