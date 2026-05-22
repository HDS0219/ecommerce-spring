package com.project.ecommerce.product.impl;

import com.project.ecommerce.product.dto.ProductPatchDto;
import com.project.ecommerce.response.ResponsePage;
import com.project.ecommerce.product.Product;
import com.project.ecommerce.product.ProductService;
import com.project.ecommerce.product.dto.ProductRequestDto;
import com.project.ecommerce.product.dto.ProductResponseDto;
import com.project.ecommerce.product.mapper.ProductMapper;
import com.project.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
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

    @Override
    public ProductResponseDto updateProduct(UUID id, @Valid ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found."));

            product.setName(dto.getName());
            product.setPrice(dto.getPrice());
            product.setDescription(dto.getDescription());
            product.setStock(dto.getStock());
            product.setStatus(dto.getStatus());
            product.setCategory(dto.getCategory());
            product.setImage(dto.getImage());

            Product updated = productRepository.save(product);

            return ProductMapper.toResponse(updated);
    }

    @Override
    public ProductResponseDto patchProduct(UUID id, ProductPatchDto dto) {
        var product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found."));

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());
        if (dto.getImage() != null) product.setImage(dto.getImage());

        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found."));
        productRepository.delete(product);
    }
}