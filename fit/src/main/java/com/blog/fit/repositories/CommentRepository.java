package com.blog.fit.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.blog.fit.domain.entities.Comment;
import com.blog.fit.domain.entities.Post;
import com.blog.fit.domain.entities.User;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    
    List<Comment> findAllByOrderByCreatedAtDesc();
    
    List<Comment> findAllByPostOrderByCreatedAtDesc(Post post);
    
    List<Comment> findAllByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post = :post")
    Long countCommentsByPost(Post post);
}
