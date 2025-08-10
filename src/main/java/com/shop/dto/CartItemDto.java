package com.shop.dto;

import com.shop.entity.CartItem;
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
public class CartItemDto {

    private Long id;
    private Integer quantity;
    private ProductDto product;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;

    public static CartItemDto from(CartItem cartItem) {
        return CartItemDto.builder()
                .id(cartItem.getId())
                .quantity(cartItem.getQuantity())
                .product(ProductDto.from(cartItem.getProduct()))
                .totalPrice(cartItem.getTotalPrice())
                .createdAt(cartItem.getCreatedAt())
                .build();
    }
} 