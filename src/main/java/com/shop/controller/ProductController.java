package com.shop.controller;

import com.shop.dto.CreateProductRequestDto;
import com.shop.dto.ProductDto;
import com.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category) {
        
        Page<ProductDto> products = productService.getAllProducts(page, size, sortBy, sortDir, search, category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductDto> products = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductDto> products = productService.searchProducts(keyword, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductDto>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductDto> products = productService.getProductsByPriceRange(minPrice, maxPrice, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/available")
    public ResponseEntity<Page<ProductDto>> getAvailableProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductDto> products = productService.getAvailableProducts(page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<ProductDto>> getPopularProducts(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<ProductDto> products = productService.getPopularProducts(limit);
        return ResponseEntity.ok(products);
    }

    // 관리자가 지정한 인기상품 조회
    @GetMapping("/featured")
    public ResponseEntity<Page<ProductDto>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<ProductDto> products = productService.getFeaturedProducts(page, size);
        return ResponseEntity.ok(products);
    }

    // 관리자가 지정한 신상품 조회
    @GetMapping("/new")
    public ResponseEntity<Page<ProductDto>> getNewProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<ProductDto> products = productService.getNewProducts(page, size);
        return ResponseEntity.ok(products);
    }

    // 홈페이지용 인기상품 (제한된 개수)
    @GetMapping("/featured/home")
    public ResponseEntity<List<ProductDto>> getFeaturedProductsForHome(
            @RequestParam(defaultValue = "6") int limit) {
        
        List<ProductDto> products = productService.getFeaturedProductsForHome(limit);
        return ResponseEntity.ok(products);
    }

    // 홈페이지용 신상품 (제한된 개수)
    @GetMapping("/new/home")
    public ResponseEntity<List<ProductDto>> getNewProductsForHome(
            @RequestParam(defaultValue = "6") int limit) {
        
        List<ProductDto> products = productService.getNewProductsForHome(limit);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody CreateProductRequestDto request) {
        ProductDto createdProduct = productService.createProduct(request);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = productService.updateProduct(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
} 