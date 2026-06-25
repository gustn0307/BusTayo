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

        System.out.println("stationId = " + stationId);
        System.out.println("cityCode = " + cityCode);
        System.out.println("routeId = " + routeId);
        System.out.println("ord = " + ord);

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
            @RequestParam("routeId") Long routeId
    ) {
        return busArrivalService.getBusLocation(routeId);
    }

    @GetMapping("/route")
    public String getRoute(
            @RequestParam("routeId") Long routeId
    ) {
        return busArrivalService.testRoute(routeId);
    }

}
