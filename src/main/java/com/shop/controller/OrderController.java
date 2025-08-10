package com.shop.controller;

import com.shop.dto.OrderDto;
import com.shop.dto.OrderRequest;
import com.shop.dto.OrderStatusUpdateRequest;
import com.shop.entity.Order;
import com.shop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest request,
                                                 Authentication authentication) {
        // 디버깅을 위한 로그 추가
        System.out.println("주문 요청 데이터: " + request);
        System.out.println("deliveryInfo: " + request.getDeliveryInfo());
        System.out.println("deliveryInfo.address: " + (request.getDeliveryInfo() != null ? request.getDeliveryInfo().getAddress() : "null"));
        System.out.println("인증된 사용자: " + authentication.getName());
        
        OrderDto order = orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<Page<OrderDto>> getUserOrders(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         Authentication authentication) {
        Page<OrderDto> orders = orderService.getUserOrders(authentication.getName(), page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrdersWithoutPagination(Authentication authentication) {
        List<OrderDto> orders = orderService.getUserOrdersWithoutPagination(authentication.getName());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId,
                                              Authentication authentication) {
        OrderDto order = orderService.getOrder(authentication.getName(), orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(@PathVariable String orderNumber,
                                                      Authentication authentication) {
        OrderDto order = orderService.getOrderByNumber(authentication.getName(), orderNumber);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId,
                                                 Authentication authentication) {
        OrderDto order = orderService.cancelOrder(authentication.getName(), orderId);
        return ResponseEntity.ok(order);
    }

    // 관리자용 엔드포인트
    @GetMapping("/admin/all")
    public ResponseEntity<Page<OrderDto>> getAllOrders(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        Page<OrderDto> orders = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/admin/status/{status}")
    public ResponseEntity<Page<OrderDto>> getOrdersByStatus(@PathVariable Order.OrderStatus status,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "20") int size) {
        Page<OrderDto> orders = orderService.getOrdersByStatus(status, page, size);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId,
                                                       @RequestBody OrderStatusUpdateRequest request) {
        // 디버깅을 위한 로그 추가
        System.out.println("주문 상태 업데이트 요청: orderId=" + orderId + ", status=" + request.getStatus());
        
        try {
            OrderDto order = orderService.updateOrderStatus(orderId, request.getStatus());
            System.out.println("주문 상태 업데이트 성공: " + order);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.err.println("주문 상태 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
} 