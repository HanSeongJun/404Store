package com.shop.service;

import com.shop.dto.CartItemDto;
import com.shop.dto.CartRequest;
import com.shop.entity.CartItem;
import com.shop.entity.Product;
import com.shop.entity.User;
import com.shop.repository.CartItemRepository;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public List<CartItemDto> getCartItems(String userEmail) {
        User user = (User) userService.loadUserByUsername(userEmail);
        return cartItemRepository.findByUserId(user.getId())
                .stream()
                .map(CartItemDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(String userEmail, CartRequest request) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + request.getProductId()));

        // 재고 확인
        if (!product.isInStock(request.getQuantity())) {
            throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
        }

        // 이미 장바구니에 있는 상품인지 확인
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            // 기존 아이템 수량 업데이트
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            
            if (!product.isInStock(newQuantity)) {
                throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
            }
            
            cartItem.updateQuantity(newQuantity);
        } else {
            // 새 아이템 추가
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        CartItem savedItem = cartItemRepository.save(cartItem);
        return CartItemDto.from(savedItem);
    }

    @Transactional
    public CartItemDto updateCartItem(String userEmail, Long cartItemId, Integer quantity) {
        User user = (User) userService.loadUserByUsername(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템을 찾을 수 없습니다: " + cartItemId));

        // 본인의 장바구니 아이템인지 확인
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        // 재고 확인
        if (!cartItem.getProduct().isInStock(quantity)) {
            throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + cartItem.getProduct().getStockQuantity());
        }

        cartItem.updateQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(cartItem);
        return CartItemDto.from(savedItem);
    }

    @Transactional
    public void removeFromCart(String userEmail, Long cartItemId) {
        User user = (User) userService.loadUserByUsername(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템을 찾을 수 없습니다: " + cartItemId));

        // 본인의 장바구니 아이템인지 확인
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = (User) userService.loadUserByUsername(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    public BigDecimal getCartTotal(String userEmail) {
        User user = (User) userService.loadUserByUsername(userEmail);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        
        return cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Integer getCartItemCount(String userEmail) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Integer count = cartItemRepository.getTotalQuantityByUserId(user.getId());
        return count != null ? count : 0;
    }
} 