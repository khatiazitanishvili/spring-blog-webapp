package com.blog.fit.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.blog.fit.domain.dtos.CommentDto;
import com.blog.fit.domain.dtos.CreateCommentRequest;
import com.blog.fit.domain.entities.Comment;
import com.blog.fit.mappers.CommentMapper;
import com.blog.fit.security.BlogUserDetail;
import com.blog.fit.services.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;

    @GetMapping
    public ResponseEntity<List<CommentDto>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        List<CommentDto> commentDtos = comments.stream()
                .map(commentMapper::toDto)
                .toList();
        return ResponseEntity.ok(commentDtos);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDto>> getCommentsByPost(@PathVariable UUID postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        List<CommentDto> commentDtos = comments.stream()
                .map(commentMapper::toDto)
                .toList();
        return ResponseEntity.ok(commentDtos);
    }

    @GetMapping(path = "/user/{userId}")
    public ResponseEntity<List<CommentDto>> getCommentsByUser(@PathVariable UUID userId) {
        List<Comment> comments = commentService.getCommentsByUser(userId);
        List<CommentDto> commentDtos = comments.stream()
                .map(commentMapper::toDto)
                .toList();
        return ResponseEntity.ok(commentDtos);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal BlogUserDetail userDetail) {
        
        Comment comment = commentService.createComment(userDetail.getUser(), postId, request);
        CommentDto commentDto = commentMapper.toDto(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
    }

    @PutMapping(path = "/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable UUID commentId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal BlogUserDetail userDetail) {
        
        Comment comment = commentService.updateComment(commentId, request, userDetail.getUser());
        CommentDto commentDto = commentMapper.toDto(comment);
        return ResponseEntity.ok(commentDto);
    }

    @DeleteMapping(path = "/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID commentId,
            @AuthenticationPrincipal BlogUserDetail userDetail) {
        
        commentService.deleteComment(commentId, userDetail.getUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping(path = "/{commentId}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable UUID commentId) {
        Comment comment = commentService.getCommentById(commentId);
        CommentDto commentDto = commentMapper.toDto(comment);
        return ResponseEntity.ok(commentDto);
    }

    @PostMapping(path = "/{commentId}/like")
    public ResponseEntity<CommentDto> likeComment(@PathVariable UUID commentId) {
        Comment comment = commentService.likeComment(commentId);
        CommentDto commentDto = commentMapper.toDto(comment);
        return ResponseEntity.ok(commentDto);
    }

    @PostMapping(path = "/{commentId}/unlike")
    public ResponseEntity<CommentDto> unlikeComment(@PathVariable UUID commentId) {
        Comment comment = commentService.unlikeComment(commentId);
        CommentDto commentDto = commentMapper.toDto(comment);
        return ResponseEntity.ok(commentDto);
    }

    @GetMapping(path = "/post/{postId}/count")
    public ResponseEntity<Long> getCommentCount(@PathVariable UUID postId) {
        Long count = commentService.getCommentCountByPost(postId);
        return ResponseEntity.ok(count);
    }
}
