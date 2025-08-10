-- 카테고리 초기 데이터
INSERT INTO category (name, description) VALUES 
('전자제품', '스마트폰, 노트북, 태블릿 등'),
('의류', '남성복, 여성복, 아동복'),
('도서', '소설, 전문서적, 만화'),
('스포츠', '운동용품, 스포츠웨어'),
('생활용품', '주방용품, 욕실용품, 청소용품');

-- 관리자 계정 (비밀번호: admin123 - 올바른 BCrypt 암호화)
INSERT INTO users (email, password, name, role, created_at) VALUES 
('admin@shop.com', '$2a$10$5f1Up2qS2B3MPp3XN/WnLecX.N16A8EohLHL8qO3IyzfuS4LHi3.i', '관리자', 'ADMIN', NOW());

-- 테스트 관리자 계정 (비밀번호: password - BCrypt 암호화)
INSERT INTO users (email, password, name, role, created_at) VALUES 
('test@admin.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '테스트관리자', 'ADMIN', NOW());

-- 테스트 일반 사용자 계정 (비밀번호: user123 - BCrypt 암호화)
INSERT INTO users (email, password, name, role, created_at) VALUES 
('user@shop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '테스트사용자', 'USER', NOW());

-- 테스트 상품 데이터 (original_price, discount_rate 컬럼 포함)
INSERT INTO product (name, description, original_price, price, discount_rate, stock_quantity, category_id, is_featured, is_new, created_at) VALUES 
('iPhone 15', '최신 아이폰 15', 1500000, 1200000, 20, 50, 1, true, true, NOW()),
('맥북 프로', '애플 맥북 프로 M3', 3000000, 2500000, 17, 30, 1, true, false, NOW()),
('나이키 에어맥스', '나이키 운동화', 180000, 150000, 17, 100, 4, false, true, NOW()),
('Java 완벽 가이드', 'Java 프로그래밍 서적', 40000, 35000, 13, 200, 3, false, false, NOW()),
('무선 이어폰', '블루투스 무선 이어폰', 100000, 80000, 20, 150, 1, true, false, NOW()); 