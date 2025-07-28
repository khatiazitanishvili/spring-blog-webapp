package com.blog.fit.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCategoryRequestDto {

    @NotBlank(message = "Category name cannot be blank")
    @Size(max = 255, message = "Category name must not exceed 255 characters")
    private String name;
}
