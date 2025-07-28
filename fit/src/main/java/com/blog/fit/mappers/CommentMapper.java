package com.blog.fit.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.blog.fit.domain.dtos.CommentDto;
import com.blog.fit.domain.entities.Comment;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {
    
    @Mapping(target = "user", source = "user")
    @Mapping(target = "postId", source = "post.id")
    CommentDto toDto(Comment comment);
}
