package com.shop.service;

import com.shop.dto.CreateProductRequestDto;
import com.shop.dto.ProductDto;
import com.shop.entity.Category;
import com.shop.entity.Product;
import com.shop.repository.CategoryRepository;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir, String search, Long category) {
        Sort sort = Sort.by(sortDir.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products;
        
        if (search != null && !search.trim().isEmpty() && category != null) {
            // 검색어와 카테고리 모두 있는 경우
            products = productRepository.findByNameContainingIgnoreCaseAndCategoryId(search.trim(), category, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // 검색어만 있는 경우
            products = productRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        } else if (category != null) {
            // 카테고리만 있는 경우
            products = productRepository.findByCategoryId(category, pageable);
        } else {
            // 필터링 없음
            products = productRepository.findAll(pageable);
        }
        
        return products.map(ProductDto::from);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + id));
        return ProductDto.from(product);
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryId(categoryId, pageable)
                .map(ProductDto::from);
    }

    public Page<ProductDto> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(ProductDto::from);
    }

    public Page<ProductDto> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByPriceBetween(minPrice, maxPrice, pageable)
                .map(ProductDto::from);
    }

    public Page<ProductDto> getAvailableProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAvailableProducts(pageable)
                .map(ProductDto::from);
    }

    public List<ProductDto> getPopularProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findPopularProducts(pageable)
                .stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    // 인기상품 조회 (관리자가 지정한)
    public Page<ProductDto> getFeaturedProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findByIsFeaturedTrue(pageable)
                .map(ProductDto::from);
    }

    // 신상품 조회 (관리자가 지정한)
    public Page<ProductDto> getNewProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findByIsNewTrue(pageable)
                .map(ProductDto::from);
    }

    // 홈페이지용 인기상품 (제한된 개수)
    public List<ProductDto> getFeaturedProductsForHome(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findByIsFeaturedTrue(pageable)
                .getContent()
                .stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    // 홈페이지용 신상품 (제한된 개수)
    public List<ProductDto> getNewProductsForHome(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findByIsNewTrue(pageable)
                .getContent()
                .stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    // 할인율 계산 헬퍼 메서드
    private Integer calculateDiscountRate(BigDecimal originalPrice, BigDecimal discountPrice) {
        if (originalPrice == null || discountPrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        
        if (discountPrice.compareTo(originalPrice) >= 0) {
            return 0; // 할인가격이 원가격보다 크거나 같으면 할인율 0%
        }
        
        BigDecimal discountAmount = originalPrice.subtract(discountPrice);
        BigDecimal discountRate = discountAmount.divide(originalPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        
        return discountRate.intValue(); // 소수점 제거하고 정수로 반환
    }

    @Transactional
    public ProductDto createProduct(CreateProductRequestDto request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + request.getCategoryId()));

        // 할인율 계산
        Integer discountRate = calculateDiscountRate(request.getOriginalPrice(), request.getPrice());

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .originalPrice(request.getOriginalPrice())
                .price(request.getPrice())
                .discountRate(discountRate)
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isNew(request.getIsNew() != null ? request.getIsNew() : false)
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        return ProductDto.from(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + id));

        if (productDto.getCategory() != null) {
            Category category = categoryRepository.findById(productDto.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));
            product.setCategory(category);
        }

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setOriginalPrice(productDto.getOriginalPrice());
        product.setPrice(productDto.getPrice());
        
        // 할인율 재계산
        Integer discountRate = calculateDiscountRate(productDto.getOriginalPrice(), productDto.getPrice());
        product.setDiscountRate(discountRate);
        
        product.setStockQuantity(productDto.getStockQuantity());
        product.setImageUrl(productDto.getImageUrl());
        product.setIsFeatured(productDto.getIsFeatured() != null ? productDto.getIsFeatured() : false);
        product.setIsNew(productDto.getIsNew() != null ? productDto.getIsNew() : false);

        Product savedProduct = productRepository.save(product);
        return ProductDto.from(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("상품을 찾을 수 없습니다: " + id);
        }
        productRepository.deleteById(id);
    }
} 