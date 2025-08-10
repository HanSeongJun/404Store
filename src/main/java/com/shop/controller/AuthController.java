package com.shop.controller;

import com.shop.dto.AuthRequest;
import com.shop.dto.AuthResponse;
import com.shop.dto.SignupRequest;
import com.shop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // 테스트용 엔드포인트 - 개발 환경에서만 사용
    @PostMapping("/test-user")
    public ResponseEntity<String> createTestUser() {
        try {
            SignupRequest testUser = new SignupRequest();
            testUser.setEmail("test@test.com");
            testUser.setPassword("test123");
            testUser.setName("테스트사용자");
            testUser.setPhone("010-1234-5678");
            testUser.setAddress("서울시 강남구");
            
            authService.signup(testUser);
            return ResponseEntity.ok("테스트 사용자가 생성되었습니다. 이메일: test@test.com, 비밀번호: test123");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("테스트 사용자 생성 실패: " + e.getMessage());
        }
    }

    // BCrypt 해시 생성 테스트 엔드포인트
    @GetMapping("/hash/{password}")
    public ResponseEntity<String> generateHash(@PathVariable String password) {
        String hashedPassword = passwordEncoder.encode(password);
        return ResponseEntity.ok("원본 비밀번호: " + password + "\n해시된 비밀번호: " + hashedPassword);
    }
} 