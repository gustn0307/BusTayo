package com.busTajo.busTayo.navigating.service;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import com.busTajo.busTayo.navigating.dto.NavigatingHistoryResponse;
import com.busTajo.busTayo.navigating.repository.NavigatingHistoryRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NavigatingHistoryService {

    private final NavigatingHistoryRepository navigatingHistoryRepository;
    private final UserRepository usersRepository;

    public void saveHistory(
            String userId,
            String start,
            String end,
            Double startX,
            Double startY,
            Double endX,
            Double endY
    ) {

        Users user = usersRepository.findByUserId(userId);

        NavigatingHistory history = new NavigatingHistory();

        history.setUser(user);

        history.setStart(start);
        history.setEnd(end);

        history.setStartX(startX);
        history.setStartY(startY);

        history.setEndX(endX);
        history.setEndY(endY);

        navigatingHistoryRepository.save(history);
    }

    public List<NavigatingHistoryResponse> getRecentHistory(String userId) {

        List<NavigatingHistory> histories =
                navigatingHistoryRepository
                        .findTop10ByUser_UserIdOrderByCreatedAtDesc(userId);

        return histories.stream()
                .map(history -> {

                    NavigatingHistoryResponse dto =
                            new NavigatingHistoryResponse();

                    dto.setId(history.getId());

                    dto.setStart(history.getStart());
                    dto.setEnd(history.getEnd());

                    dto.setStartX(history.getStartX());
                    dto.setStartY(history.getStartY());

                    dto.setEndX(history.getEndX());
                    dto.setEndY(history.getEndY());

                    return dto;
                })
                .toList();
    }
}