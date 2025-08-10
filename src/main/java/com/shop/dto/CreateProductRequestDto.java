package com.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequestDto {

    @NotBlank(message = "상품명은 필수입니다")
    private String name;

    private String description;

    @NotNull(message = "원가격은 필수입니다")
    @Positive(message = "원가격은 0보다 커야 합니다")
    private BigDecimal originalPrice;

    @NotNull(message = "할인가격은 필수입니다")
    @Positive(message = "할인가격은 0보다 커야 합니다")
    private BigDecimal price;

    @NotNull(message = "재고 수량은 필수입니다")
    @Positive(message = "재고 수량은 0보다 커야 합니다")
    private Integer stockQuantity;

    private String imageUrl;

    @NotNull(message = "카테고리는 필수입니다")
    private Long categoryId;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private Boolean isNew = false;
} 