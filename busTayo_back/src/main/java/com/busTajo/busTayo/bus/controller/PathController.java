package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.service.OdsayService;
import com.busTajo.busTayo.navigating.service.NavigatingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/path")
public class PathController {

    private final OdsayService odsayService;
    private final NavigatingHistoryService navigatingHistoryService;

    @GetMapping("/search")
    public String searchPath(
            @RequestParam("sx") double sx,
            @RequestParam("sy") double sy,
            @RequestParam("ex") double ex,
            @RequestParam("ey") double ey,
            @RequestParam("startName") String startName,
            @RequestParam("endName") String endName
    ) {
        System.out.println("sx : " + sx);
        System.out.println("sy : " + sy);
        System.out.println("ex : " + ex);
        System.out.println("ey : " + ey);
        System.out.println("시작지 : " + startName);
        System.out.println("도착지 : " + endName);


        String userId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        navigatingHistoryService.saveHistory(
                userId,
                startName,
                endName,
                sx,
                sy,
                ex,
                ey
        );

        return odsayService.searchPath(
                sx,
                sy,
                ex,
                ey
        );
    }
}