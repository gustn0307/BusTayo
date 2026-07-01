package com.busTajo.busTayo.users.controller;


import com.busTajo.busTayo.users.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // 로그인 안 한 유저도 접근해야 하니까 시큐리티에서 열어둔 auth 경로
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트 번호에 맞게 설정 (Vite 기본값 3000)
public class MailController {

    private final MailService mailService;

    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("이메일을 입력해 주세요.");
        }

        // MailService를 호출해서 메일 발송
        boolean isSent = mailService.sendSimpleMessage(email);

        if (isSent) {
            return ResponseEntity.ok().body("임시 비밀번호가 메일로 발송되었습니다.");
        } else {
            return ResponseEntity.internalServerError().body("메일 발송 중 오류가 발생했습니다. 이메일을 다시 확인해 주세요.");
        }
    }
}