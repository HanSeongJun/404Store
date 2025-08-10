package com.shop.dto;

import com.shop.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String recipientName;
    private String recipientPhone;
    private String paymentMethod;
    private String userName;
    private String userEmail;
    private List<OrderItemDto> orderItems;
    private LocalDateTime createdAt;

    public static OrderDto from(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .paymentMethod(order.getPaymentMethod())
                .userName(order.getUser() != null ? order.getUser().getName() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .orderItems(order.getOrderItems() != null ? 
                    order.getOrderItems().stream()
                        .map(OrderItemDto::from)
                        .collect(Collectors.toList()) : null)
                .createdAt(order.getCreatedAt())
                .build();
    }
} 