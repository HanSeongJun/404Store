package com.shop.service;

import com.shop.dto.OrderDto;
import com.shop.dto.OrderRequest;
import com.shop.entity.*;
import com.shop.repository.CartItemRepository;
import com.shop.repository.OrderItemRepository;
import com.shop.repository.OrderRepository;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    @Transactional
    public OrderDto createOrder(String userEmail, OrderRequest request) {
        // 디버깅을 위한 로그 추가
        System.out.println("OrderService.createOrder 호출됨");
        System.out.println("request: " + request);
        System.out.println("deliveryInfo: " + request.getDeliveryInfo());
        System.out.println("address: " + (request.getDeliveryInfo() != null ? request.getDeliveryInfo().getAddress() : "null"));
        
        User user = (User) userService.loadUserByUsername(userEmail);
        
        // 요청된 상품 정보로 주문 생성
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 상품이 없습니다.");
        }

        // 재고 확인 및 총 금액 계산
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + itemRequest.getProductId()));
            
            int quantity = itemRequest.getQuantity();
            
            if (!product.isInStock(quantity)) {
                throw new IllegalArgumentException("상품 '" + product.getName() + "'의 재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
            }
            
            totalAmount = totalAmount.add(BigDecimal.valueOf(itemRequest.getPrice() * quantity));
        }

        // 주문 생성
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .totalAmount(totalAmount)
                .shippingAddress(request.getDeliveryInfo().getAddress())
                .recipientName(request.getDeliveryInfo().getName())
                .recipientPhone(request.getDeliveryInfo().getPhone())
                .paymentMethod(request.getPaymentMethod())
                .status(Order.OrderStatus.PENDING)
                .orderItems(new ArrayList<>()) // 명시적으로 초기화
                .build();
        
        System.out.println("생성된 Order 객체: " + order);

        Order savedOrder = orderRepository.save(order);

        // 주문 아이템 생성 및 재고 감소
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + itemRequest.getProductId()));
            
            int quantity = itemRequest.getQuantity();
            
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(quantity)
                    .price(BigDecimal.valueOf(itemRequest.getPrice())) // 주문 당시 가격 저장
                    .build();
            
            // OrderItem을 데이터베이스에 저장
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            
            // Order의 orderItems 리스트에 추가 (null 체크 추가)
            if (savedOrder.getOrderItems() == null) {
                savedOrder.setOrderItems(new ArrayList<>());
            }
            savedOrder.addOrderItem(savedOrderItem);
            
            // 재고 감소
            product.decreaseStock(quantity);
        }

        // 장바구니 비우기
        cartItemRepository.deleteByUserId(user.getId());

        return OrderDto.from(savedOrder);
    }

    public Page<OrderDto> getUserOrders(String userEmail, int page, int size) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Pageable pageable = PageRequest.of(page, size);
        
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(OrderDto::from);
    }

    public List<OrderDto> getUserOrdersWithoutPagination(String userEmail) {
        User user = (User) userService.loadUserByUsername(userEmail);
        
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(OrderDto::from)
                .collect(Collectors.toList());
    }

    public OrderDto getOrder(String userEmail, Long orderId) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        // 본인의 주문인지 확인
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        
        return OrderDto.from(order);
    }

    public OrderDto getOrderByNumber(String userEmail, String orderNumber) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNumber));
        
        // 본인의 주문인지 확인
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        
        return OrderDto.from(order);
    }

    @Transactional
    public OrderDto cancelOrder(String userEmail, Long orderId) {
        User user = (User) userService.loadUserByUsername(userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        // 본인의 주문인지 확인
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        
        // 주문 취소
        order.cancel();
        
        // 재고 복구
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.increaseStock(orderItem.getQuantity());
        }
        
        Order savedOrder = orderRepository.save(order);
        return OrderDto.from(savedOrder);
    }

    // 관리자용 메서드들
    public Page<OrderDto> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAll(pageable)
                .map(OrderDto::from);
    }

    public Page<OrderDto> getOrdersByStatus(Order.OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(OrderDto::from);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        order.updateStatus(status);
        Order savedOrder = orderRepository.save(order);
        return OrderDto.from(savedOrder);
    }

    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD" + timestamp + String.format("%03d", (int)(Math.random() * 1000));
    }
} 