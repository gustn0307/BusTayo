package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.service.OdsayService;
import com.busTajo.busTayo.navigating.service.NavigatingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// 길찾기 API Controller
// 역할:
// 1. 프론트에서 길찾기 요청 받기
// 2. 현재 로그인 사용자 확인
// 3. 길찾기 기록 DB 저장
// 4. ODsay API 호출해서 경로 반환
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/path")
public class PathController {

    // ODsay 길찾기 API 호출 서비스
    private final OdsayService odsayService;

    // 길찾기 기록 저장 서비스
    private final NavigatingHistoryService navigatingHistoryService;

    // 길찾기 검색 API
    //
    // 요청 예시:
    // GET /api/path/search?sx=127.00&sy=37.26&ex=127.02&ey=37.49
    //
    // 파라미터:
    // sx = 출발지 경도
    // sy = 출발지 위도
    // ex = 도착지 경도
    // ey = 도착지 위도
    // startName = 출발지 이름
    // endName = 도착지 이름
    @GetMapping("/search")
    public String searchPath(
            @RequestParam("sx") double sx,
            @RequestParam("sy") double sy,
            @RequestParam("ex") double ex,
            @RequestParam("ey") double ey,
            @RequestParam("startName") String startName,
            @RequestParam("endName") String endName
    ) {

        // 현재 로그인한 사용자 ID 추출
        // JWT 인증 성공 후 SecurityContext에 저장된 값 사용
        String userId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // 길찾기 기록 DB 저장
        // 최근 길찾기 기능에서 사용
        navigatingHistoryService.saveHistory(
                userId,
                startName,
                endName,
                sx,
                sy,
                ex,
                ey
        );

        // ODsay API 호출 후 결과 반환
        // 현재는 String(JSON raw response) 그대로 반환
        return odsayService.searchPath(
                sx,
                sy,
                ex,
                ey
        );
    }
}