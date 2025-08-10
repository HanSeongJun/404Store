package com.shop.dto;

import com.shop.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Long id;
    private String name;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal price;
    private Integer discountRate;
    private Integer stockQuantity;
    private String imageUrl;
    private Boolean isFeatured;
    private Boolean isNew;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CategoryDto category;

    public static ProductDto from(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .originalPrice(product.getOriginalPrice())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .isFeatured(product.getIsFeatured())
                .isNew(product.getIsNew())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .category(product.getCategory() != null ? CategoryDto.from(product.getCategory()) : null)
                .build();
    }
} 