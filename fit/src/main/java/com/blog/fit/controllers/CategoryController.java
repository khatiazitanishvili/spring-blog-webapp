package com.blog.fit.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.blog.fit.domain.dtos.CategoryDto;
import com.blog.fit.domain.dtos.CreateCategoryRequest;
import com.blog.fit.domain.dtos.UpdateCategoryRequest;
import com.blog.fit.domain.dtos.UpdateCategoryRequestDto;
import com.blog.fit.domain.entities.Category;
import com.blog.fit.mappers.CategoryMapper;
import com.blog.fit.services.CategoryService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;
   
    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories() {
        List<CategoryDto> categories = categoryService.listCategories()
                .stream().map(categoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryRequest  createCategoryRequest) {
        Category categoryToCreate = categoryMapper.toEntity(createCategoryRequest);
        Category savedCategory = categoryService.createCategory(categoryToCreate);
        return new ResponseEntity<>(
                categoryMapper.toDto(savedCategory), 
                HttpStatus.CREATED);

    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
        @PathVariable UUID id, 
        @Valid @RequestBody UpdateCategoryRequestDto updateCategoryRequestDto) {
        
        UpdateCategoryRequest updateCategoryRequest = categoryMapper.toUpdateCategoryRequest(updateCategoryRequestDto);
        Category updatedCategory = categoryService.updateCategory(id, updateCategoryRequest);
        CategoryDto updatedCategoryDto = categoryMapper.toDto(updatedCategory);

        return ResponseEntity.ok(updatedCategoryDto);
    }
}

