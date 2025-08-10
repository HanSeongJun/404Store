package com.shop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotEmpty(message = "주문 상품은 필수입니다")
    private List<OrderItemRequest> items;

    @NotNull(message = "배송 정보는 필수입니다")
    @Valid
    private DeliveryInfoRequest deliveryInfo;

    @NotBlank(message = "결제 방법은 필수입니다")
    private String paymentMethod;

    @NotNull(message = "총 금액은 필수입니다")
    private Long totalAmount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull(message = "상품 ID는 필수입니다")
        private Long productId;
        
        @NotNull(message = "수량은 필수입니다")
        private Integer quantity;
        
        @NotNull(message = "가격은 필수입니다")
        private Long price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryInfoRequest {
        @NotBlank(message = "수령인 이름은 필수입니다")
        private String name;
        
        @NotBlank(message = "배송 주소는 필수입니다")
        private String address;
        
        @NotBlank(message = "연락처는 필수입니다")
        private String phone;
    }
} 