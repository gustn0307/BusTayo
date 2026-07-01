package com.busTajo.busTayo.navigating.dto;

import lombok.Getter;
import lombok.Setter;

// 최근 길찾기 응답 DTO
// 역할:
// 1. NavigatingHistory Entity를 프론트에 전달하기 위한 응답 객체
// 2. Entity 전체를 직접 노출하지 않고 필요한 필드만 전달
//
// 사용 위치:
// NavigatingHistoryService -> NavigatingHistoryController -> Frontend
//
// 프론트 사용처:
// RouteSearchPanel.jsx
// - 최근 길찾기 목록 표시
// - 클릭 시 이전 경로 재검색
@Getter
@Setter
public class NavigatingHistoryResponse {

    // 길찾기 기록 PK
    private Long id;

    // 출발지 이름
    private String start;

    // 도착지 이름
    private String end;

    // 출발지 좌표
    private Double startX;
    private Double startY;

    // 도착지 좌표
    private Double endX;
    private Double endY;
}