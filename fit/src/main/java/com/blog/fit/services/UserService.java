package com.blog.fit.services;

import java.util.UUID;

import com.blog.fit.domain.entities.User;

public interface UserService {
    User getUserById(UUID userId);
}
