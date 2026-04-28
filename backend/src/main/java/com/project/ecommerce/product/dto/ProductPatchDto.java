package com.project.ecommerce.product.dto;

import com.project.ecommerce.product.ProductCategory;
import com.project.ecommerce.product.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductPatchDto{
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private ProductCategory category;
    private ProductStatus status;
    private String image;
}
