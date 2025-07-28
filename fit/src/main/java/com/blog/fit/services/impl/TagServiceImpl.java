package com.blog.fit.services.impl;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.blog.fit.domain.entities.Tag;
import com.blog.fit.repositories.TagRepository;
import com.blog.fit.services.TagService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;


    @Override
    public List<Tag> getTags() {
        return tagRepository.findAllWithPostCount();
    }

    @Override
    public Tag getTagById(UUID id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag with id " + id + " not found"));
                
}

    @Override
    public List<Tag> getTagsByIds(Set<UUID> ids) {
        List<Tag> foundTags = tagRepository.findAllById(ids);
        if (foundTags.size() != ids.size()) {
            throw new EntityNotFoundException("Not all tags found for the provided IDs");
    }
        return foundTags;
    }

    @Override
    public Tag createTag(String name) {
        return tagRepository.findByName(name)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
    }

    @Override
    public Tag updateTag(UUID id, String name) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag with id " + id + " not found"));
        
        // Check if another tag with the same name already exists
        tagRepository.findByName(name)
                .filter(existingTag -> !existingTag.getId().equals(id))
                .ifPresent(existingTag -> {
                    throw new IllegalArgumentException("Tag with name '" + name + "' already exists");
                });
        
        tag.setName(name);
        return tagRepository.save(tag);
    }

    @Override
    public void deleteTag(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag with id " + id + " not found"));
        
        tagRepository.delete(tag);
    }

    @Override
    public boolean existsById(UUID id) {
        return tagRepository.existsById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return tagRepository.findByName(name).isPresent();
    }
}