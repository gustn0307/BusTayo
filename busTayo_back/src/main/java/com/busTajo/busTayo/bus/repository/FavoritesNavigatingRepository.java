package com.busTajo.busTayo.bus.repository;

import com.busTajo.busTayo.bus.entity.FavoritesNavigating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritesNavigatingRepository extends JpaRepository<FavoritesNavigating, Long> {
    List<FavoritesNavigating> findByUserId(Long userId);
    List<FavoritesNavigating> findByGroupId(Long groupId);
}
