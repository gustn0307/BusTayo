package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.service.OdsayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/path")
@RequiredArgsConstructor
public class PathController {

    private final OdsayService odsayService;

    @GetMapping("/search")
    public String searchPath(
            @RequestParam("sx") double sx,
            @RequestParam("sy") double sy,
            @RequestParam("ex") double ex,
            @RequestParam("ey") double ey
    ) {
        return odsayService.searchPath(
                sx, sy,
                ex, ey
        );
    }
}