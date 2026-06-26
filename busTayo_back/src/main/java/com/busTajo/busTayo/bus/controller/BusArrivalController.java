package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.service.BusArrivalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@ResponseBody
@RequestMapping("/api/bus")
public class BusArrivalController {

    private final BusArrivalService busArrivalService;

    public BusArrivalController(BusArrivalService busArrivalService) {
        this.busArrivalService = busArrivalService;
    }

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
        System.out.println("도착정보");
        System.out.println("stationId = " + stationId);
        System.out.println("cityCode = " + cityCode);
        System.out.println("routeId = " + routeId);
        System.out.println("ord = " + ord); // 전체 노선에서 해당 정류소의 순서

        return busArrivalService
                .getArrivalInfo(
                        stationId,
                        cityCode,
                        routeId,
                        ord
                );
    }

    @GetMapping("/location")
    public String getBusLocation(
            @RequestParam("cityCode") Integer cityCode,
            @RequestParam("routeId") Long routeId
    ) {
        return busArrivalService.getBusLocation(
                cityCode,
                routeId
        );
    }

}
