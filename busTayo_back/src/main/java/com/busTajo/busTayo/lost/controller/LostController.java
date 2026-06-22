package com.busTajo.busTayo.lost.controller;

import com.busTajo.busTayo.lost.dto.LostDto;
import com.busTajo.busTayo.lost.service.LostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping()
@ResponseBody
@RequiredArgsConstructor
public class LostController {
    private final LostService busHistoryService;

    @GetMapping("/lost")
    public ResponseEntity<List<LostDto>> busHistoryList() {
        return ResponseEntity.ok(busHistoryService.findAllBusHistory());
    }
}
