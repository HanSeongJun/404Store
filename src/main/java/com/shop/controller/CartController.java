package com.shop.controller;

import com.shop.dto.CartItemDto;
import com.shop.dto.CartRequest;
import com.shop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(Authentication authentication) {
        List<CartItemDto> cartItems = cartService.getCartItems(authentication.getName());
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(@Valid @RequestBody CartRequest request, 
                                                  Authentication authentication) {
        CartItemDto cartItem = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable Long cartItemId,
                                                       @Valid @RequestBody CartRequest request,
                                                       Authentication authentication) {
        CartItemDto cartItem = cartService.updateCartItem(authentication.getName(), cartItemId, request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId,
                                               Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getCartTotal(Authentication authentication) {
        BigDecimal total = cartService.getCartTotal(authentication.getName());
        return ResponseEntity.ok(total);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getCartItemCount(Authentication authentication) {
        Integer count = cartService.getCartItemCount(authentication.getName());
        return ResponseEntity.ok(count);
    }
} 