package com.busTajo.busTayo.users.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String authCode;

    // 인증번호 만료 시간을 관리하기 위해 필요
    @Column(nullable = false)
    private LocalDateTime expiredAt;

    // 생성자를 통해 쉽게 값을 넣을 수 있게 설정
    public EmailVerification(String email, String authCode, LocalDateTime expiredAt) {
        this.email = email;
        this.authCode = authCode;
        this.expiredAt = expiredAt;
    }

    public EmailVerification() {}
}