package com.blog.fit.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blog.fit.domain.dtos.TagDto;
import com.blog.fit.domain.entities.Tag;
import com.blog.fit.mappers.TagMapper;
import com.blog.fit.services.TagService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/tags")
@RequiredArgsConstructor
public class TagController {
    
    private final TagService tagService;
    private final TagMapper tagMapper;

    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        List<Tag> tags = tagService.getTags();
        List<TagDto> tagResponses = tags.stream().map(tagMapper::toTagResponse).toList();
        
        return ResponseEntity.ok(tagResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDto> getTagById(@PathVariable UUID id) {
        Tag tag = tagService.getTagById(id);
        TagDto tagDto = tagMapper.toTagResponse(tag);
        return ResponseEntity.ok(tagDto);
    }

    @PostMapping
    public ResponseEntity<TagDto> createTag(@Valid @RequestBody TagDto tagDto) {
        Tag createdTag = tagService.createTag(tagDto.getName());
        TagDto responseDto = tagMapper.toTagResponse(createdTag);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagDto> updateTag(@PathVariable UUID id, @Valid @RequestBody TagDto tagDto) {
        Tag updatedTag = tagService.updateTag(id, tagDto.getName());
        TagDto responseDto = tagMapper.toTagResponse(updatedTag);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable UUID id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable UUID id) {
        boolean exists = tagService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = tagService.existsByName(name);
        return ResponseEntity.ok(exists);
    }
}
