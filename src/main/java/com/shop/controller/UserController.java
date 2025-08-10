package com.shop.controller;

import com.shop.dto.SignupRequest;
import com.shop.dto.UserDto;
import com.shop.entity.User;
import com.shop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Authentication authentication) {
        User userEntity = (User) userService.loadUserByUsername(authentication.getName());
        UserDto user = UserDto.from(userEntity);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody SignupRequest request,
                                                  Authentication authentication) {
        UserDto user = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(user);
    }
} 