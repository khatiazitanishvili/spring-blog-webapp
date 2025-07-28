package com.blog.fit.services;

import java.util.List;
import java.util.UUID;

import com.blog.fit.domain.dtos.CreatePostRequest;
import com.blog.fit.domain.dtos.UpdatePostRequest;
import com.blog.fit.domain.entities.Post;
import com.blog.fit.domain.entities.User;

public interface PostService {
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);

    Post createPost(User user, CreatePostRequest createPostRequest);
    Post updatePost(UUID id, UpdatePostRequest updatePostRequest);
    
    Post getPostById(UUID id);
    void deletePostById(UUID id);
}
