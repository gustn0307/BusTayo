package com.busTajo.busTayo.users.controller;

import com.busTajo.busTayo.users.entity.EmailVerification; // 엔티티
import com.busTajo.busTayo.users.repository.EmailVerificationRepository; // 리포지토리
import com.busTajo.busTayo.users.repository.UserRepository;
import com.busTajo.busTayo.users.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final MailService mailService;
    private final EmailVerificationRepository emailVerificationRepository;

    // 💡 [추가] 이메일 중복 확인 API
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam("email") String email) {

        boolean exists = userRepository.existsByUserId(email);

        return ResponseEntity.ok(exists);
    }

    @PostMapping("/email/send")
    public ResponseEntity<?> sendAuthCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 1. 인증번호 생성
        String authCode = mailService.createAuthCode();

        // 2. 💡 진짜 메일 발송 (이제 불 꺼진 메서드를 호출하게 됩니다!)
        mailService.sendAuthCodeEmail(email, authCode);

        // 3. 기존에 혹시 보냈던 인증번호가 있다면 삭제
        emailVerificationRepository.deleteByEmail(email);

        // 4. 새로운 인증번호 DB에 저장
        EmailVerification verification = new EmailVerification(
                email,
                authCode,
                LocalDateTime.now().plusMinutes(5)
        );
        emailVerificationRepository.save(verification);

        return ResponseEntity.ok("인증번호가 발송되었습니다.");
    }

    // 인증번호 검증 API
    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyAuthCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String inputCode = request.get("authCode");

        // 1. DB에서 해당 이메일로 저장된 인증 데이터 조회
        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .orElse(null);

        // 2. 인증 데이터가 없는 경우
        if (verification == null) {
            return ResponseEntity.badRequest().body("인증 요청을 먼저 진행해 주세요.");
        }

        // 3. 만료 시간 확인
        if (LocalDateTime.now().isAfter(verification.getExpiredAt())) {
            return ResponseEntity.badRequest().body("인증 시간이 만료되었습니다. 다시 시도해 주세요.");
        }

        // 4. 인증번호 비교
        if (verification.getAuthCode().equals(inputCode)) {
            // 인증 성공 시, 해당 데이터는 이제 필요 없으니 삭제
            emailVerificationRepository.deleteByEmail(email);
            return ResponseEntity.ok("인증이 완료되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("인증번호가 일치하지 않습니다.");
        }
    }
}