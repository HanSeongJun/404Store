# 쇼핑몰 프론트엔드

React와 Tailwind CSS로 구현된 쇼핑몰 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **React** 18 - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - CSS 프레임워크  
- **React Router** - 클라이언트 사이드 라우팅
- **Axios** - HTTP 클라이언트

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   └── Header.jsx  # 헤더 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── Home.jsx    # 홈 페이지
│   │   ├── Login.jsx   # 로그인 페이지
│   │   ├── Register.jsx # 회원가입 페이지
│   │   ├── Products.jsx # 상품 목록 페이지
│   │   └── Cart.jsx    # 장바구니 페이지
│   ├── services/       # API 서비스
│   │   ├── api.js      # Axios 설정
│   │   ├── authService.js     # 인증 API
│   │   ├── productService.js  # 상품 API
│   │   └── cartService.js     # 장바구니 API
│   ├── App.jsx         # 메인 앱 컴포넌트
│   └── main.jsx        # 앱 진입점
├── package.json
└── README.md
```

## 🎯 주요 기능

### 🏠 홈페이지
- 카테고리별 상품 분류
- 추천 상품 목록
- 상품 미리보기

### 👤 사용자 인증
- 회원가입 (이메일, 비밀번호, 이름, 전화번호, 주소)
- 로그인/로그아웃
- JWT 토큰 기반 인증
- 자동 토큰 갱신

### 🛍️ 상품 관리
- 상품 목록 조회
- 카테고리별 필터링
- 상품 검색
- 장바구니 추가

### 🛒 장바구니
- 장바구니 아이템 관리
- 수량 변경
- 아이템 삭제
- 총 금액 계산

## 🔧 설치 및 실행

### 필수 조건
- Node.js 16+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🌐 API 연동

백엔드 API 서버가 `http://localhost:8080`에서 실행되어야 합니다.

### 환경 설정

API 기본 URL은 `src/services/api.js`에서 변경할 수 있습니다:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📱 페이지 구성

- **/** - 홈 페이지
- **/login** - 로그인
- **/register** - 회원가입  
- **/products** - 상품 목록
- **/cart** - 장바구니

## 🔐 인증 시스템

### JWT 토큰 관리
- 로그인 시 토큰을 localStorage에 저장
- API 요청 시 자동으로 헤더에 토큰 첨부
- 토큰 만료 시 자동 로그아웃

### 권한 관리
- 로그인이 필요한 페이지 접근 제어
- 사용자 상태에 따른 UI 변경

## 🎨 UI/UX

### Tailwind CSS
- 반응형 디자인
- 깔끔하고 모던한 UI
- 일관된 디자인 시스템

### 사용자 경험
- 로딩 상태 표시
- 에러 메시지 처리
- 사용자 피드백 제공

## 📝 테스트 계정

- **이메일**: admin@shop.com
- **비밀번호**: admin123

## 🚀 배포

### 빌드 후 배포
```bash
npm run build
# dist 폴더의 파일들을 웹 서버에 배포
```

## 🔮 향후 개선 사항

- [ ] 상품 상세 페이지
- [ ] 주문 기능
- [ ] 결제 연동
- [ ] 사용자 프로필 관리
- [ ] 주문 내역 조회
- [ ] 이미지 업로드
- [ ] 상품 리뷰 시스템
- [ ] 알림 기능

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.
