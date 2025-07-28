package com.blog.fit.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.fit.domain.PostStatus;
import com.blog.fit.domain.entities.Category;
import com.blog.fit.domain.entities.Post;
import com.blog.fit.domain.entities.Tag;
import com.blog.fit.domain.entities.User;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByStatusAndCategoryAndTagsContaining(PostStatus status, Category categoryId, Tag tagId);
    List<Post> findAllByStatusAndCategory(PostStatus status, Category category);
    List<Post> findAllByStatusAndTagsContaining(PostStatus status, Tag tagId);
    List<Post> findAllByStatus(PostStatus status);
    List<Post> findAllByAuthorAndStatus(User author, PostStatus status);
    Optional<Post> findById(UUID postId);
}
