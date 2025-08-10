package com.shop.repository;

import com.shop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    // 사용자별 장바구니 조회
    List<CartItem> findByUserId(Long userId);
    
    // 특정 사용자의 특정 상품 장바구니 아이템 조회
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
    
    // 사용자의 장바구니 비우기
    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    
    // 사용자 장바구니 총 수량
    @Query("SELECT SUM(c.quantity) FROM CartItem c WHERE c.user.id = :userId")
    Integer getTotalQuantityByUserId(@Param("userId") Long userId);
} 