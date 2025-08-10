package com.shop.repository;

import com.shop.entity.Order;
import com.shop.entity.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 주문번호로 조회
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // 사용자별 주문 조회 (페이지네이션)
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // 사용자별 주문 조회 (페이지네이션 없음)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 주문 상태별 조회
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);
    
    // 특정 기간 주문 조회
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 사용자의 특정 상태 주문 조회
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
} 