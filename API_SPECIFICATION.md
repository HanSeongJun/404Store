# 📚 API 명세서

## 📋 목차

- [개요](#-개요)
- [공통 사항](#-공통-사항)
- [인증 API](#-인증-api)
- [사용자 API](#-사용자-api)
- [상품 API](#-상품-api)
- [장바구니 API](#-장바구니-api)
- [주문 API](#-주문-api)
- [카테고리 API](#-카테고리-api)
- [파일 업로드 API](#-파일-업로드-api)
- [에러 코드](#-에러-코드)

---

## 🎯 개요

이 문서는 E-Commerce 쇼핑몰 시스템의 REST API 명세서입니다. Spring Boot 기반으로 구현된 백엔드 API의 모든 엔드포인트와 요청/응답 형식을 상세하게 설명합니다.

### ✨ API 특징
- **RESTful 설계**: HTTP 메서드와 상태 코드를 적절히 활용
- **JWT 인증**: 토큰 기반 인증 시스템
- **JSON 응답**: 모든 응답은 JSON 형식
- **에러 처리**: 일관된 에러 응답 형식
- **페이징**: 대용량 데이터 처리를 위한 페이징 지원

---

## 🔧 공통 사항

### 기본 정보
- **Base URL**: `http://localhost:8080`
- **API Prefix**: `/api`
- **Content-Type**: `application/json`
- **인코딩**: `UTF-8`

### 인증 방식
```http
Authorization: Bearer {JWT_TOKEN}
```

### 공통 응답 형식
```json
{
  "success": true,
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": "상세 에러 정보"
  }
}
```

### HTTP 상태 코드
| 코드 | 의미 | 설명 |
|------|------|------|
| `200` | OK | 요청 성공 |
| `201` | Created | 리소스 생성 성공 |
| `400` | Bad Request | 잘못된 요청 |
| `401` | Unauthorized | 인증 실패 |
| `403` | Forbidden | 권한 부족 |
| `404` | Not Found | 리소스 없음 |
| `500` | Internal Server Error | 서버 오류 |

---

## 🔐 인증 API

### 회원가입
새로운 사용자 계정을 생성합니다.

```http
POST /api/auth/signup
```

**요청 본문:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "address": "서울시 강남구 테헤란로 123"
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00"
  },
  "message": "회원가입이 완료되었습니다."
}
```

**검증 규칙:**
- `email`: 이메일 형식, 중복 불가
- `password`: 최소 8자, 영문/숫자/특수문자 조합
- `name`: 최소 2자, 최대 100자
- `phone`: 전화번호 형식 (010-XXXX-XXXX)
- `address`: 최대 500자

### 로그인
사용자 인증 후 JWT 토큰을 발급합니다.

```http
POST /api/auth/login
```

**요청 본문:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "role": "USER"
    }
  },
  "message": "로그인이 완료되었습니다."
}
```

---

## 👤 사용자 API

### 프로필 조회
현재 로그인한 사용자의 프로필 정보를 조회합니다.

```http
GET /api/users/profile
Authorization: Bearer {token}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": "서울시 강남구 테헤란로 123",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  },
  "message": "프로필 조회가 완료되었습니다."
}
```

### 프로필 수정
사용자 프로필 정보를 수정합니다.

```http
PUT /api/users/profile
Authorization: Bearer {token}
```

**요청 본문:**
```json
{
  "name": "김철수",
  "phone": "010-9876-5432",
  "address": "서울시 서초구 강남대로 456"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "김철수",
    "phone": "010-9876-5432",
    "address": "서울시 서초구 강남대로 456",
    "role": "USER",
    "updatedAt": "2024-01-01T12:00:00"
  },
  "message": "프로필이 수정되었습니다."
}
```

---

## 📦 상품 API

### 상품 목록 조회
상품 목록을 페이징, 검색, 필터링하여 조회합니다.

```http
GET /api/products?page=0&size=10&category=1&search=노트북&sort=price,asc
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `page` | Integer | ❌ | 페이지 번호 (0부터 시작) | 0 |
| `size` | Integer | ❌ | 페이지 크기 | 10 |
| `category` | Long | ❌ | 카테고리 ID | 전체 |
| `search` | String | ❌ | 검색어 (최소 2글자) | 전체 |
| `sort` | String | ❌ | 정렬 기준 | created,desc |

**정렬 옵션:**
- `price,asc`: 가격 낮은 순
- `price,desc`: 가격 높은 순
- `created,desc`: 최신순
- `name,asc`: 이름순

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "MacBook Pro 13인치",
        "description": "M2 칩 탑재...",
        "originalPrice": 1500000,
        "price": 1200000,
        "discountRate": 20,
        "stockQuantity": 50,
        "imageUrl": "/images/macbook.jpg",
        "isFeatured": true,
        "isNew": true,
        "category": {
          "id": 1,
          "name": "전자제품"
        },
        "createdAt": "2024-01-01T00:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 25,
      "totalPages": 3
    }
  },
  "message": "상품 목록 조회가 완료되었습니다."
}
```

### 상품 상세 조회
특정 상품의 상세 정보를 조회합니다.

```http
GET /api/products/{id}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "MacBook Pro 13인치",
    "description": "M2 칩 탑재, 8GB 통합 메모리, 256GB SSD...",
    "originalPrice": 1500000,
    "price": 1200000,
    "discountRate": 20,
    "stockQuantity": 50,
    "imageUrl": "/images/macbook.jpg",
    "isFeatured": true,
    "isNew": true,
    "category": {
      "id": 1,
      "name": "전자제품",
      "description": "스마트폰, 노트북, 태블릿 등"
    },
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  },
  "message": "상품 상세 조회가 완료되었습니다."
}
```

### 인기상품 목록
인기상품으로 설정된 상품들을 조회합니다.

```http
GET /api/products/featured
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MacBook Pro 13인치",
      "price": 1200000,
      "discountRate": 20,
      "imageUrl": "/images/macbook.jpg"
    }
  ],
  "message": "인기상품 목록 조회가 완료되었습니다."
}
```

### 신상품 목록
신상품으로 설정된 상품들을 조회합니다.

```http
GET /api/products/new
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "iPhone 15 Pro",
      "price": 1080000,
      "discountRate": 10,
      "imageUrl": "/images/iphone.jpg"
    }
  ],
  "message": "신상품 목록 조회가 완료되었습니다."
}
```

---

## 🛒 장바구니 API

### 장바구니 조회
현재 로그인한 사용자의 장바구니를 조회합니다.

```http
GET /api/cart
Authorization: Bearer {token}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "MacBook Pro 13인치",
        "price": 1200000,
        "imageUrl": "/images/macbook.jpg",
        "stockQuantity": 50
      },
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "message": "장바구니 조회가 완료되었습니다."
}
```

### 상품 추가
장바구니에 상품을 추가합니다.

```http
POST /api/cart
Authorization: Bearer {token}
```

**요청 본문:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "quantity": 2,
    "product": {
      "id": 1,
      "name": "MacBook Pro 13인치",
      "price": 1200000
    }
  },
  "message": "상품이 장바구니에 추가되었습니다."
}
```

### 수량 변경
장바구니 상품의 수량을 변경합니다.

```http
PUT /api/cart/{id}
Authorization: Bearer {token}
```

**요청 본문:**
```json
{
  "quantity": 3
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "quantity": 3,
    "product": {
      "id": 1,
      "name": "MacBook Pro 13인치",
      "price": 1200000
    }
  },
  "message": "수량이 변경되었습니다."
}
```

### 상품 제거
장바구니에서 상품을 제거합니다.

```http
DELETE /api/cart/{id}
Authorization: Bearer {token}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "상품이 장바구니에서 제거되었습니다."
}
```

---

## 📋 주문 API

### 주문 생성
장바구니 상품들을 주문합니다.

```http
POST /api/orders
Authorization: Bearer {token}
```

**요청 본문:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": "서울시 강남구 테헤란로 123",
  "recipientName": "홍길동",
  "recipientPhone": "010-1234-5678",
  "paymentMethod": "virtual"
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20240101-001",
    "totalAmount": 2400000,
    "status": "PENDING",
    "shippingAddress": "서울시 강남구 테헤란로 123",
    "recipientName": "홍길동",
    "recipientPhone": "010-1234-5678",
    "paymentMethod": "virtual",
    "createdAt": "2024-01-01T00:00:00"
  },
  "message": "주문이 생성되었습니다."
}
```

### 주문 목록 조회
사용자의 주문 내역을 조회합니다.

```http
GET /api/orders?page=0&size=10&status=PENDING
Authorization: Bearer {token}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|----------|------|------|------|--------|
| `page` | Integer | ❌ | 페이지 번호 | 0 |
| `size` | Integer | ❌ | 페이지 크기 | 10 |
| `status` | String | ❌ | 주문 상태 | 전체 |

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "orderNumber": "ORD-20240101-001",
        "totalAmount": 2400000,
        "status": "PENDING",
        "shippingAddress": "서울시 강남구 테헤란로 123",
        "recipientName": "홍길동",
        "createdAt": "2024-01-01T00:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 5,
      "totalPages": 1
    }
  },
  "message": "주문 목록 조회가 완료되었습니다."
}
```

### 주문 상세 조회
특정 주문의 상세 정보를 조회합니다.

```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20240101-001",
    "totalAmount": 2400000,
    "status": "PENDING",
    "shippingAddress": "서울시 강남구 테헤란로 123",
    "recipientName": "홍길동",
    "recipientPhone": "010-1234-5678",
    "paymentMethod": "virtual",
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 1200000,
        "product": {
          "id": 1,
          "name": "MacBook Pro 13인치",
          "imageUrl": "/images/macbook.jpg"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  },
  "message": "주문 상세 조회가 완료되었습니다."
}
```

### 주문 취소
주문을 취소합니다 (PENDING 상태에서만 가능).

```http
PUT /api/orders/{id}/cancel
Authorization: Bearer {token}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "CANCELLED",
    "updatedAt": "2024-01-01T12:00:00"
  },
  "message": "주문이 취소되었습니다."
}
```

---

## 🏷️ 카테고리 API

### 카테고리 목록 조회
모든 카테고리를 조회합니다.

```http
GET /api/categories
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "전자제품",
      "description": "스마트폰, 노트북, 태블릿 등"
    },
    {
      "id": 2,
      "name": "의류",
      "description": "남성/여성 의류, 신발, 가방 등"
    }
  ],
  "message": "카테고리 목록 조회가 완료되었습니다."
}
```

---

## 📁 파일 업로드 API

### 이미지 업로드
상품 이미지를 업로드합니다 (관리자만 가능).

```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**요청 본문:**
```
file: [이미지 파일]
```

**응답 (201 Created):**
```json
{
  "success": true,
  "data": {
    "fileName": "macbook.jpg",
    "fileUrl": "/images/macbook.jpg",
    "fileSize": 1024000,
    "contentType": "image/jpeg"
  },
  "message": "파일 업로드가 완료되었습니다."
}
```

**지원 파일 형식:**
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

**파일 크기 제한:**
- 최대 10MB

---

## ❌ 에러 코드

### 공통 에러 코드
| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `INVALID_REQUEST` | 400 | 잘못된 요청 |
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `FORBIDDEN` | 403 | 권한 부족 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

### 비즈니스 에러 코드
| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `USER_NOT_FOUND` | 404 | 사용자를 찾을 수 없음 |
| `PRODUCT_NOT_FOUND` | 404 | 상품을 찾을 수 없음 |
| `INSUFFICIENT_STOCK` | 400 | 재고 부족 |
| `ORDER_NOT_FOUND` | 404 | 주문을 찾을 수 없음 |
| `ORDER_CANNOT_CANCEL` | 400 | 주문 취소 불가 |
| `DUPLICATE_EMAIL` | 400 | 중복된 이메일 |
| `INVALID_PASSWORD` | 400 | 잘못된 비밀번호 |

### 에러 응답 예시
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "재고가 부족합니다.",
    "details": "요청 수량: 5, 현재 재고: 3"
  }
}
```

---

<div align="center">

📖 **이 문서는 프로젝트의 API 명세를 상세하게 설명합니다.**

🔧 **실제 구현 시에는 프로젝트 요구사항에 맞게 조정이 필요할 수 있습니다.**

</div> 