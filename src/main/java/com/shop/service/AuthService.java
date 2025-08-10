package com.shop.service;

import com.shop.dto.AuthRequest;
import com.shop.dto.AuthResponse;
import com.shop.dto.SignupRequest;
import com.shop.dto.UserDto;
import com.shop.entity.User;
import com.shop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        UserDto user = userService.registerUser(request);
        
        // 가입 후 바로 로그인 토큰 생성
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, user);
    }

    public AuthResponse login(AuthRequest request) {
        // 인증 처리
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        User userEntity = (User) userService.loadUserByUsername(request.getEmail());
        UserDto user = UserDto.from(userEntity);
        
        return new AuthResponse(token, user);
    }
} 