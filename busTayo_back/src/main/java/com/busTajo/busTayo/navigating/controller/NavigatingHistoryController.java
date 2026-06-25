package com.busTajo.busTayo.navigating.controller;

import com.busTajo.busTayo.navigating.dto.NavigatingHistoryResponse;
import com.busTajo.busTayo.navigating.service.NavigatingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/navigating")
public class NavigatingHistoryController {

    private final NavigatingHistoryService navigatingHistoryService;

    @GetMapping("/history")
    public List<NavigatingHistoryResponse> getHistory() {

        String userId =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        System.out.println("userId : " + userId);
        return navigatingHistoryService
                .getRecentHistory(userId);
    }
}