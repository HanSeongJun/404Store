package com.shop.dto;

import com.shop.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {

    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
    private String productName;
    private ProductDto product;

    public static OrderItemDto from(OrderItem orderItem) {
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .totalPrice(orderItem.getTotalPrice())
                .productName(orderItem.getProduct() != null ? orderItem.getProduct().getName() : null)
                .product(ProductDto.from(orderItem.getProduct()))
                .build();
    }
} 