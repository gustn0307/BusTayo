package com.busTajo.busTayo.bus.repository;

import com.busTajo.busTayo.bus.entity.FavoritesGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritesGroupRepository extends JpaRepository<FavoritesGroup, Long> {
    List<FavoritesGroup> findByUserId(Long userId);

    FavoritesGroup findByUserIdAndName(
            Long userId,
            String name
    );
}
