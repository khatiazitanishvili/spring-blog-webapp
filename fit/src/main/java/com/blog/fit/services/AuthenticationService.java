package com.blog.fit.services;

import org.springframework.security.core.userdetails.UserDetails;

import com.blog.fit.domain.dtos.RegisterRequest;
import com.blog.fit.domain.entities.User;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);

    String generateToken(UserDetails userDetails);

    String generateToken(User user);

    UserDetails validateToken(String token);

    User register(RegisterRequest registerRequest);

    long getJwtExpirySeconds();
}
