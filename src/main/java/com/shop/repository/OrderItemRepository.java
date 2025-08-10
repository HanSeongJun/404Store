package com.shop.repository;

import com.shop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // 주문별 주문 아이템 조회
    List<OrderItem> findByOrderId(Long orderId);
    
    // 상품별 판매 통계
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Integer getTotalSoldQuantityByProductId(@Param("productId") Long productId);
    
    // 특정 기간 베스트셀러 상품
    @Query("SELECT oi.product.id, SUM(oi.quantity) as totalSold " +
           "FROM OrderItem oi JOIN oi.order o " +
           "WHERE o.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.product.id " +
           "ORDER BY totalSold DESC")
    List<Object[]> findBestSellingProducts(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
} 