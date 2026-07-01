package com.busTajo.busTayo.navigating.controller;

import com.busTajo.busTayo.navigating.dto.NavigatingHistoryResponse;
import com.busTajo.busTayo.navigating.service.NavigatingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 길찾기 기록 조회 Controller
// 역할:
// 1. 현재 로그인한 사용자 확인
// 2. 해당 사용자의 최근 길찾기 목록 조회
// 3. 프론트에 DTO 형태로 반환
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/navigating")
public class NavigatingHistoryController {

    // 길찾기 기록 서비스
    private final NavigatingHistoryService navigatingHistoryService;

    // 최근 길찾기 조회 API
    //
    // 요청:
    // GET /api/navigating/history
    //
    // 반환:
    // 최근 길찾기 목록 (최신순)
    @GetMapping("/history")
    public List<NavigatingHistoryResponse> getHistory() {

        // Spring Security에 저장된 현재 로그인 사용자 ID 추출
        String userId =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        // 해당 사용자의 최근 길찾기 조회
        return navigatingHistoryService
                .getRecentHistory(userId);
    }
}