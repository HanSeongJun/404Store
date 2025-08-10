package com.shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_item")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 사용자 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 상품 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // 총 가격 계산
    public BigDecimal getTotalPrice() {
        return product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    // 수량 업데이트
    public void updateQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }
        this.quantity = quantity;
    }
} 