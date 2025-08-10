# 🗄️ E-Commerce 쇼핑몰 ERD 다이어그램

## 📊 시각적 ERD 다이어그램

### Mermaid 다이어그램

```mermaid
erDiagram
    USERS {
        bigint id PK "Primary Key (Auto Increment)"
        varchar email UK "이메일 (Unique, Not Null)"
        varchar password "암호화된 비밀번호 (Not Null)"
        varchar name "사용자 이름 (Not Null)"
        varchar phone "전화번호"
        varchar address "주소"
        enum role "권한 (USER/ADMIN, Default: USER)"
        timestamp created_at "생성일시 (Auto)"
        timestamp updated_at "수정일시 (Auto Update)"
    }
    
    CATEGORY {
        bigint id PK "Primary Key (Auto Increment)"
        varchar name "카테고리명 (Unique, Not Null)"
        varchar description "카테고리 설명"
    }
    
    PRODUCT {
        bigint id PK "Primary Key (Auto Increment)"
        varchar name "상품명 (Not Null)"
        text description "상품 설명 (TEXT)"
        decimal original_price "원가격 (10,2, Not Null)"
        decimal price "할인가격 (10,2, Not Null)"
        integer discount_rate "할인율 (%) (Default: 0)"
        integer stock_quantity "재고 수량 (Not Null, Default: 0)"
        varchar image_url "상품 이미지 URL"
        boolean is_featured "인기상품 여부 (Default: false)"
        boolean is_new "신상품 여부 (Default: false)"
        bigint category_id FK "카테고리 외래키 (Not Null)"
        timestamp created_at "생성일시 (Auto)"
        timestamp updated_at "수정일시 (Auto Update)"
    }
    
    CART_ITEM {
        bigint id PK "Primary Key (Auto Increment)"
        integer quantity "수량 (Not Null, > 0)"
        bigint user_id FK "사용자 외래키 (Not Null)"
        bigint product_id FK "상품 외래키 (Not Null)"
        timestamp created_at "생성일시 (Auto)"
    }
    
    ORDERS {
        bigint id PK "Primary Key (Auto Increment)"
        varchar order_number UK "주문번호 (Unique, Not Null)"
        decimal total_amount "총 주문금액 (12,2, Not Null)"
        enum status "주문상태 (Default: PENDING)"
        varchar shipping_address "배송지 주소 (Not Null)"
        varchar recipient_name "수령인 이름"
        varchar recipient_phone "수령인 연락처"
        varchar payment_method "결제 방법"
        bigint user_id FK "사용자 외래키 (Not Null)"
        timestamp created_at "주문일시 (Auto)"
        timestamp updated_at "수정일시 (Auto Update)"
    }
    
    ORDER_ITEM {
        bigint id PK "Primary Key (Auto Increment)"
        integer quantity "주문 수량 (Not Null, > 0)"
        decimal price "주문 당시 가격 (10,2, Not Null)"
        bigint order_id FK "주문 외래키 (Not Null)"
        bigint product_id FK "상품 외래키 (Not Null)"
    }
    
    %% 관계 정의 (실제 JPA 구현 기반)
    USERS ||--o{ CART_ITEM : "1:N - OneToMany (mappedBy='user')"
    USERS ||--o{ ORDERS : "1:N - OneToMany (mappedBy='user')"
    CATEGORY ||--o{ PRODUCT : "1:N - OneToMany (mappedBy='category')"
    PRODUCT ||--o{ CART_ITEM : "1:N - OneToMany (mappedBy='product')"
    PRODUCT ||--o{ ORDER_ITEM : "1:N - OneToMany (mappedBy='product')"
    ORDERS ||--o{ ORDER_ITEM : "1:N - OneToMany (mappedBy='order')"
```

### PlantUML 다이어그램

```plantuml
@startuml E-Commerce ERD
!define table(x) class x << (T,#FFAAAA) >>
!define primary_key(x) <u>x</u>
!define foreign_key(x) <i>x</i>
!define not_null(x) <b>x</b>
!define unique(x) <b><u>x</u></b>

title E-Commerce 쇼핑몰 데이터베이스 설계 (ERD)

table(USERS) {
    primary_key(id) : BIGINT
    unique(email) : VARCHAR(255)
    not_null(password) : VARCHAR(255)
    not_null(name) : VARCHAR(100)
    phone : VARCHAR(20)
    address : VARCHAR(500)
    role : ENUM('USER','ADMIN')
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

table(CATEGORY) {
    primary_key(id) : BIGINT
    unique(name) : VARCHAR(100)
    description : VARCHAR(500)
}

table(PRODUCT) {
    primary_key(id) : BIGINT
    not_null(name) : VARCHAR(200)
    description : TEXT
    not_null(original_price) : DECIMAL(10,2)
    not_null(price) : DECIMAL(10,2)
    discount_rate : INTEGER
    not_null(stock_quantity) : INTEGER
    image_url : VARCHAR(500)
    is_featured : BOOLEAN
    is_new : BOOLEAN
    foreign_key(category_id) : BIGINT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

table(CART_ITEM) {
    primary_key(id) : BIGINT
    not_null(quantity) : INTEGER
    foreign_key(user_id) : BIGINT
    foreign_key(product_id) : BIGINT
    created_at : TIMESTAMP
}

table(ORDERS) {
    primary_key(id) : BIGINT
    unique(order_number) : VARCHAR(50)
    not_null(total_amount) : DECIMAL(12,2)
    status : ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED')
    not_null(shipping_address) : VARCHAR(500)
    recipient_name : VARCHAR(100)
    recipient_phone : VARCHAR(20)
    payment_method : VARCHAR(50)
    foreign_key(user_id) : BIGINT
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

table(ORDER_ITEM) {
    primary_key(id) : BIGINT
    not_null(quantity) : INTEGER
    not_null(price) : DECIMAL(10,2)
    foreign_key(order_id) : BIGINT
    foreign_key(product_id) : BIGINT
}

' 관계 정의
USERS ||--o{ CART_ITEM : "사용자 장바구니"
USERS ||--o{ ORDERS : "사용자 주문"
CATEGORY ||--o{ PRODUCT : "카테고리 상품"
PRODUCT ||--o{ CART_ITEM : "상품 장바구니"
PRODUCT ||--o{ ORDER_ITEM : "상품 주문"
ORDERS ||--o{ ORDER_ITEM : "주문 상품"

note right of USERS
  • Spring Security UserDetails 구현
  • JWT 인증 지원
  • 권한 기반 접근 제어
end note

note right of PRODUCT
  • 재고 관리 기능
  • 할인율 자동 계산
  • 이미지 URL 관리
end note

note right of ORDERS
  • 주문 상태 관리
  • 배송 정보 관리
  • 결제 방법 추적
end note

@enduml
```

## 🔗 테이블 관계 상세

### 1. USERS (사용자)
- **주요 기능**: 사용자 인증, 권한 관리
- **특징**: Spring Security UserDetails 구현
- **관계**: 
  - `1:N` → `CART_ITEM` (장바구니 아이템)
  - `1:N` → `ORDERS` (주문)

### 2. CATEGORY (카테고리)
- **주요 기능**: 상품 분류
- **특징**: 계층적 구조 지원 가능
- **관계**: 
  - `1:N` → `PRODUCT` (상품)

### 3. PRODUCT (상품)
- **주요 기능**: 상품 정보, 재고 관리
- **특징**: 할인율, 인기상품, 신상품 플래그
- **관계**: 
  - `N:1` ← `CATEGORY` (카테고리)
  - `1:N` → `CART_ITEM` (장바구니)
  - `1:N` → `ORDER_ITEM` (주문 상품)

### 4. CART_ITEM (장바구니)
- **주요 기능**: 사용자별 장바구니 관리
- **특징**: 수량 관리, 중복 상품 방지
- **관계**: 
  - `N:1` ← `USERS` (사용자)
  - `N:1` ← `PRODUCT` (상품)

### 5. ORDERS (주문)
- **주요 기능**: 주문 정보, 상태 관리
- **특징**: 주문번호, 배송 정보, 결제 방법
- **관계**: 
  - `N:1` ← `USERS` (사용자)
  - `1:N` → `ORDER_ITEM` (주문 상품)

### 6. ORDER_ITEM (주문 상품)
- **주요 기능**: 주문별 상품 상세 정보
- **특징**: 주문 당시 가격 보존
- **관계**: 
  - `N:1` ← `ORDERS` (주문)
  - `N:1` ← `PRODUCT` (상품)

## 📋 주요 제약사항

### 데이터 무결성
- **외래키 제약**: 모든 관계는 CASCADE DELETE 지원
- **NOT NULL**: 필수 필드 보장
- **UNIQUE**: 이메일, 카테고리명, 주문번호 중복 방지
- **CHECK**: 가격, 수량, 할인율 범위 검증

### 비즈니스 규칙
- **재고 관리**: 주문 시 자동 재고 차감
- **주문 상태**: 상태 변경 순서 제한
- **할인율**: 0~100% 범위 제한
- **가격**: 할인가 ≤ 원가 보장

## 🚀 성능 최적화

### 인덱스 전략
- **Primary Key**: 자동 인덱스
- **Unique Key**: 이메일, 주문번호
- **Composite Index**: 사용자+상품, 카테고리+가격
- **Full-Text Index**: 상품명 검색

### 쿼리 최적화
- **Lazy Loading**: JPA FetchType.LAZY 활용
- **Pagination**: 대용량 데이터 처리
- **Caching**: 자주 조회되는 데이터 캐싱

---

<div align="center">

🎯 **이 ERD는 실제 구현된 Java 엔티티와 완벽하게 일치합니다**

🔧 **Spring Boot + JPA + MySQL 환경에서 최적화되어 있습니다**

📊 **Mermaid와 PlantUML 다이어그램을 모두 제공합니다**

</div>
