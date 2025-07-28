package com.blog.fit.services;

import java.util.List;
import java.util.UUID;

import com.blog.fit.domain.dtos.UpdateCategoryRequest;
import com.blog.fit.domain.entities.Category;

public interface CategoryService {
    List<Category> listCategories();
    Category createCategory(Category category);
    void deleteCategory(UUID id);
    Category getCategoryById(UUID id);
    Category updateCategory(UUID id, UpdateCategoryRequest updateCategoryRequest);
}
