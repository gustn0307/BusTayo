package com.busTajo.busTayo.lost.controller;

import com.busTajo.busTayo.lost.dto.LostDto;
import com.busTajo.busTayo.lost.repository.LostRepository;
import com.busTajo.busTayo.lost.service.LostService;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import com.busTajo.busTayo.users.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final UserRepository usersRepository; // 추가

    @GetMapping("/lost")
    public ResponseEntity<List<LostDto>> busHistoryList() {
        return ResponseEntity.ok(busHistoryService.findAllBusHistory());
    }

    @GetMapping("/lost/my")
    public ResponseEntity<List<LostDto>> myBusHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUsername(); // Users.userId (이메일)
        return ResponseEntity.ok(busHistoryService.findByUserId(userId));
    }
}