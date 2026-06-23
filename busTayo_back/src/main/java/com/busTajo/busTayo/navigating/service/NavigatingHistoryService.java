package com.busTajo.busTayo.navigating.service;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import com.busTajo.busTayo.navigating.repository.NavigatingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NavigatingHistoryService {

    private final NavigatingHistoryRepository repository;

    public void save(
            String userId,
            String start,
            String end,
            Double startX,
            Double startY,
            Double endX,
            Double endY
    ) {


    }

    public List<NavigatingHistory> getRecent(String userId) {
        return repository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }
}