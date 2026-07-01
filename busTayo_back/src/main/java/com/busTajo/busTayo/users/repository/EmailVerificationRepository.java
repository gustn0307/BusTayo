package com.busTajo.busTayo.users.repository;

import com.busTajo.busTayo.users.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    // 이메일로 인증번호를 찾기 위한 메서드
    Optional<EmailVerification> findByEmail(String email);

    // 이메일로 이미 발송된 인증번호가 있는지 확인 (재발송 방지/삭제용)
    @Transactional
    void deleteByEmail(String email);
}