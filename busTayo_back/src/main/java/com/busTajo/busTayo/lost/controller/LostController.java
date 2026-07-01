package com.busTajo.busTayo.lost.controller;

import com.busTajo.busTayo.lost.dto.LostDto;
import com.busTajo.busTayo.lost.service.LostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lost")
public class LostController {

    private final LostService lostService;

    @GetMapping("/buses")
    public ResponseEntity<List<LostDto>> getBuses(
            @RequestParam Long historyId) {
        return ResponseEntity.ok(lostService.getBusesFromHistory(historyId));
    }

}