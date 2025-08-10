package com.shop.repository;

import com.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // 카테고리별 상품 조회
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    // 상품명으로 검색
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // 상품명과 카테고리로 검색
    Page<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);
    
    // 가격 범위로 검색
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // 재고가 있는 상품만 조회
    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0")
    Page<Product> findAvailableProducts(Pageable pageable);
    
    // 카테고리와 가격 범위로 검색
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByCategoryAndPriceRange(
        @Param("categoryId") Long categoryId, 
        @Param("minPrice") BigDecimal minPrice, 
        @Param("maxPrice") BigDecimal maxPrice, 
        Pageable pageable
    );
    
    // 인기 상품 (주문 수량 기준)
    @Query("SELECT p FROM Product p JOIN p.orderItems oi GROUP BY p ORDER BY SUM(oi.quantity) DESC")
    List<Product> findPopularProducts(Pageable pageable);
    
    // 관리자가 지정한 인기상품 조회
    Page<Product> findByIsFeaturedTrue(Pageable pageable);
    
    // 관리자가 지정한 신상품 조회
    Page<Product> findByIsNewTrue(Pageable pageable);
} 