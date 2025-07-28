package com.blog.fit.controllers;

import com.blog.fit.domain.dtos.AuthResponse;
import com.blog.fit.domain.dtos.LoginRequest;
import com.blog.fit.domain.dtos.RegisterRequest;
import com.blog.fit.domain.entities.User;
import com.blog.fit.services.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        return buildAuthResponse(userDetails);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authenticationService.register(request);
            UserDetails userDetails = authenticationService.authenticate(user.getEmail(), request.getPassword());
            return buildAuthResponse(userDetails);
        } catch (IllegalArgumentException e) {
            log.warn("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "message", "Registration failed: " + e.getMessage())
            );
        } catch (Exception e) {
            log.error("Unexpected error during registration", e);
            return ResponseEntity.internalServerError().body(
                Map.of("status", 500, "message", "Unexpected server error")
            );
        }
    }

    private ResponseEntity<AuthResponse> buildAuthResponse(UserDetails userDetails) {
        String token = authenticationService.generateToken(userDetails);
        return ResponseEntity.ok(AuthResponse.builder()
            .token(token)
            .expiresIn(String.valueOf(authenticationService.getJwtExpirySeconds()))
            .build());
    }
}
