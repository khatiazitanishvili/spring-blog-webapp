package com.blog.fit.domain.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDto {
    private UUID id;
    private String content;
    private Integer likes;
    private AuthorDto user;
    private UUID postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
