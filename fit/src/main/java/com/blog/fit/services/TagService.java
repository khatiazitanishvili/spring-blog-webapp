package com.blog.fit.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.blog.fit.domain.entities.Tag;

public interface TagService {
    List<Tag> getTags();
    Tag getTagById(UUID id);
    List<Tag> getTagsByIds(Set<UUID> ids);
    Tag createTag(String name);
    Tag updateTag(UUID id, String name);
    void deleteTag(UUID id);
    boolean existsById(UUID id);
    boolean existsByName(String name);
}
