package com.shop.service;

import com.shop.dto.SignupRequest;
import com.shop.dto.UserDto;
import com.shop.entity.User;
import com.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));
    }

    @Transactional
    public UserDto registerUser(SignupRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 사용자 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(User.Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        return UserDto.from(savedUser);
    }

    @Transactional
    public UserDto updateProfile(String email, SignupRequest request) {
        User user = (User) loadUserByUsername(email);
        
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        User savedUser = userRepository.save(user);
        return UserDto.from(savedUser);
    }
} 