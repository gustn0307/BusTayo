package com.busTajo.busTayo.navigating.repository;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavigatingHistoryRepository extends JpaRepository<NavigatingHistory, Long> {

    List<NavigatingHistory> findTop10ByUserIdOrderByCreatedAtDesc(String userId);
}
