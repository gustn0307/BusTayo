package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.service.BusService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

// 버스 실시간 정보 Controller
// 역할:
// 1. 버스 도착정보 조회 API 제공
// 2. 버스 차량 위치 조회 API 제공
// 3. 서울 / 경기 API 분기 처리는 Service에서 담당
@Controller
@ResponseBody
@RequestMapping("/api/bus")
public class BusController {

    // 버스 도착정보 / 차량위치 조회 서비스
    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    // 버스 도착정보 조회 API
    //
    // 요청 예시:
    // GET /api/bus/arrival?stationId=202000120&cityCode=1010
    //
    // 파라미터:
    // stationId = 정류장 ID
    // cityCode = 지역 코드 (서울=1000, 경기=기타)
    // routeId = 노선 ID (선택)
    // ord = 정류장 순번 (선택)
    //
    // 반환:
    // 서울 → 서울 버스 API 응답
    // 경기 → 경기 버스 API 응답
    @GetMapping("/arrival")
    public String getArrival(
            @RequestParam("stationId")
            String stationId,

            @RequestParam("cityCode")
            Integer cityCode,

            @RequestParam(name = "routeId", required = false)
            String routeId,

            @RequestParam(name = "ord", required = false)
            Integer ord
    ) {

        return busService.getArrivalInfo(
                stationId,
                cityCode,
                routeId,
                ord
        );
    }

    // 버스 차량 위치 조회 API
    //
    // 요청 예시:
    // GET /api/bus/location?cityCode=1010&routeId=200000104
    //
    // 파라미터:
    // cityCode = 지역 코드
    // routeId = 노선 ID
    //
    // 반환:
    // 해당 노선에서 현재 운행중인 버스 위치 정보
    @GetMapping("/location")
    public String getBusLocation(
            @RequestParam("cityCode") Integer cityCode,
            @RequestParam("routeId") Long routeId
    ) {
        return busService.getBusLocation(
                cityCode,
                routeId
        );
    }
}