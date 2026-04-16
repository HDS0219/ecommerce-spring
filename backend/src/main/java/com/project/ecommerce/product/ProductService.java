package com.project.ecommerce.product;

import com.project.ecommerce.product.dto.ProductRequestDto;
import com.project.ecommerce.product.dto.ProductResponseDto;
import com.project.ecommerce.response.ResponsePage;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {
    ProductResponseDto createProduct(ProductRequestDto dto);
    ProductResponseDto getById(UUID id);
    ResponsePage<ProductResponseDto> getAllProducts(Pageable pageable);
}