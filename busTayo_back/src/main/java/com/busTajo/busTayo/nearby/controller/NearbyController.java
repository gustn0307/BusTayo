package com.busTajo.busTayo.nearby.controller;

import com.busTajo.busTayo.nearby.dto.BusStopOutputDto;
import com.busTajo.busTayo.nearby.dto.FacilityOutputDto; // 🟢 새 DTO 임포트 추가
import com.busTajo.busTayo.nearby.service.BusStopSearchService;
import com.busTajo.busTayo.nearby.service.FacilitySearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NearbyController {

    private final BusStopSearchService busStopSearchService;
    private final FacilitySearchService facilitySearchService;

    // 요구사항 정의서 규칙: GET /api/nearby/stops
    @GetMapping("/api/nearby/stops")
    public ResponseEntity<List<BusStopOutputDto>> getNearbyStops(
            @RequestParam("lat") double latitude,
            @RequestParam("lon") double longitude
    ) {
        log.info("🌐 [React 요청 접수] 내 주변 정류장 검색 실행 -> 위도: {}, 경도: {}", latitude, longitude);
        List<BusStopOutputDto> resultList = busStopSearchService.requestNearbyBusStops(latitude, longitude);
        return ResponseEntity.ok(resultList);
    }

    // 요구사항 정의서 규칙: GET /api/nearby/facilities
    @GetMapping("/api/nearby/facilities")
    public ResponseEntity<List<FacilityOutputDto>> getNearbyFacilities(
            @RequestParam("category") String category,
            @RequestParam("lat") double latitude,
            @RequestParam("lng") double longitude
    ) {
        log.info("🌐 [React 요청 접수] 내 주변 편의시설 검색 실행 -> 카테고리: {}, 위도: {}, 경도: {}", category, latitude, longitude);

        // 🟢 [최종 연동] 가짜 빈 리스트를 지우고, 카카오 API 통신 엔진을 가동합니다!
        List<FacilityOutputDto> resultList = facilitySearchService.requestNearbyFacilities(category, latitude, longitude);

        log.info("🎯 [카카오 API 수신 완료] 프론트엔드로 전달할 데이터 개수: {}개", resultList.size());

        // 리액트에게 200 OK 상태 코드와 함께 진짜 편의시설 데이터 보따리 던져주기
        return ResponseEntity.ok(resultList);
    }
}