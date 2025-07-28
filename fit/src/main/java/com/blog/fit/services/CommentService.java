package com.blog.fit.services;

import java.util.List;
import java.util.UUID;

import com.blog.fit.domain.dtos.CreateCommentRequest;
import com.blog.fit.domain.entities.Comment;
import com.blog.fit.domain.entities.User;

public interface CommentService {
    List<Comment> getAllComments();
    List<Comment> getCommentsByPost(UUID postId);
    List<Comment> getCommentsByUser(UUID userId);
    Comment createComment(User user, UUID postId, CreateCommentRequest request);
    Comment updateComment(UUID commentId, CreateCommentRequest request, User user);
    void deleteComment(UUID commentId, User user);
    Comment getCommentById(UUID commentId);
    Comment likeComment(UUID commentId);
    Comment unlikeComment(UUID commentId);
    Long getCommentCountByPost(UUID postId);
}
