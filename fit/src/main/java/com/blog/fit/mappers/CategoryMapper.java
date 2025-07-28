package com.blog.fit.mappers;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Named;


import com.blog.fit.domain.PostStatus;
import com.blog.fit.domain.dtos.CategoryDto;
import com.blog.fit.domain.dtos.CreateCategoryRequest;
import com.blog.fit.domain.dtos.UpdateCategoryRequest;
import com.blog.fit.domain.dtos.UpdateCategoryRequestDto;
import com.blog.fit.domain.entities.Category;
import com.blog.fit.domain.entities.Post;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    CategoryDto toDto(Category category);

    Category toEntity(CreateCategoryRequest createCategoryRequest);

    UpdateCategoryRequest toUpdateCategoryRequest(UpdateCategoryRequestDto dto);


    @Named("calculatePostCount")
    default long calculatePostCount(List<Post> posts) {
        if (posts == null) {
            return 0;
        }
        return posts.stream()
              .filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
              .count();
    }
}
