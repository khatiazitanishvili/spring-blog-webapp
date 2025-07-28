package com.blog.fit.domain.entities;

import jakarta.persistence.*;


import lombok.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID;



@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true) 
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
    
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((password == null) ? 0 : password.hashCode());
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        result = prime * result + ((createdAt == null) ? 0 : createdAt.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return id.equals(user.id) && name.equals(user.name) && password.equals(user.password) && email.equals(user.email) && createdAt.equals(user.createdAt);
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }


}

