package com.project.ecommerce.product.impl;

import com.project.ecommerce.response.ResponsePage;
import com.project.ecommerce.product.Product;
import com.project.ecommerce.product.ProductService;
import com.project.ecommerce.product.dto.ProductRequestDto;
import com.project.ecommerce.product.dto.ProductResponseDto;
import com.project.ecommerce.product.mapper.ProductMapper;
import com.project.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductResponseDto createProduct(ProductRequestDto dto) {

        Product product = ProductMapper.toEntity(dto);

        Product saved = productRepository.save(product);

        return ProductMapper.toResponse(saved);
    }

    @Override
    public ProductResponseDto getByName(String name) {
        Product product = productRepository.findFirstByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Product not found."));

        return ProductMapper.toResponse(product);
    }




    @Override
    public ResponsePage<ProductResponseDto> getAllProducts(Pageable pageable) {
        Page<Product> page = productRepository.findAll(pageable);

        List<ProductResponseDto> content = page.getContent()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();

        return ResponsePage.<ProductResponseDto>builder()
                .data(content)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .pageSize(page.getSize())
                .pageNumber(page.getNumber())
                .numberOfElements(page.getNumberOfElements())
                .build();
    }

    // WIP
    @Override
    public ProductResponseDto updateProduct(ProductResponseDto dto, UUID id) {
        return productRepository.findById(id).map(product -> {
            //
        });
    }
}