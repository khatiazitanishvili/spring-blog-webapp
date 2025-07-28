package com.blog.fit.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.blog.fit.domain.dtos.CreatePostRequest;
import com.blog.fit.domain.dtos.CreatePostRequestDto;
import com.blog.fit.domain.dtos.PostDto;
import com.blog.fit.domain.dtos.UpdatePostRequest;
import com.blog.fit.domain.dtos.UpdatePostRequestDto;
import com.blog.fit.domain.entities.Post;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {   

    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    @Mapping(target = "photo", source = "photo")
    PostDto toDto(Post post);

    CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto);

    UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto);

}
