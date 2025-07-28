package com.blog.fit.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blog.fit.domain.dtos.CreateCommentRequest;
import com.blog.fit.domain.entities.Comment;
import com.blog.fit.domain.entities.Post;
import com.blog.fit.domain.entities.User;
import com.blog.fit.repositories.CommentRepository;
import com.blog.fit.services.CommentService;
import com.blog.fit.services.PostService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getAllComments() {
        return commentRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPost(UUID postId) {
        Post post = postService.getPostById(postId);
        return commentRepository.findAllByPostOrderByCreatedAtDesc(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByUser(UUID userId) {
        User user = User.builder().id(userId).build(); // Assuming user exists
        return commentRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    @Override
    @Transactional
    public Comment createComment(User user, UUID postId, CreateCommentRequest request) {
        Post post = postService.getPostById(postId);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .likes(request.getLikes() != null ? request.getLikes() : 0)
                .user(user)
                .post(post)
                .build();

        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public Comment updateComment(UUID commentId, CreateCommentRequest request, User user) {
        Comment comment = getCommentById(commentId);
        
        // Check if the user owns the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User can only update their own comments");
        }

        comment.setContent(request.getContent());
        if (request.getLikes() != null) {
            comment.setLikes(request.getLikes());
        }

        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, User user) {
        Comment comment = getCommentById(commentId);
        
        // Check if the user owns the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("User can only delete their own comments");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public Comment getCommentById(UUID commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment with id " + commentId + " not found"));
    }

    @Override
    @Transactional
    public Comment likeComment(UUID commentId) {
        Comment comment = getCommentById(commentId);
        comment.setLikes(comment.getLikes() + 1);
        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public Comment unlikeComment(UUID commentId) {
        Comment comment = getCommentById(commentId);
        if (comment.getLikes() > 0) {
            comment.setLikes(comment.getLikes() - 1);
        }
        return commentRepository.save(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCommentCountByPost(UUID postId) {
        Post post = postService.getPostById(postId);
        return commentRepository.countCommentsByPost(post);
    }
}
