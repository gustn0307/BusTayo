package com.busTajo.busTayo.navigating.repository;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface NavigatingHistoryRepository extends JpaRepository<NavigatingHistory, Long> {

    List<NavigatingHistory> findTop10ByUser_UserIdOrderByCreatedAtDesc(String userId);

    void deleteByUser_UserIdAndStartAndEnd(String userId, String start, String end);
}
