package com.busTajo.busTayo.users.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.busTajo.busTayo.users.repository.UserRepository;
import com.busTajo.busTayo.users.entity.Users;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String createAuthCode() {
        return String.valueOf((int)(Math.random() * 899999) + 100000);
    }

    public boolean sendSimpleMessage(String toEmail) {
        try {
            // 0. DB에서 해당 이메일(user_id)을 가진 유저가 진짜 있는지부터 찾기
            Users user = userRepository.findByUserId(toEmail);

            if (user == null) {
                System.out.println("해당 이메일로 가입된 유저가 없습니다.");
                return false;
            }

            // 1. 영어+숫자가 섞인 무작위 임시 비밀번호 생성 (8자리로 뚝 자르기)
            String tempPassword = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);

            // 2. 임시 비밀번호 암호화해서 DB 유저 정보에 업데이트하고 저장
            user.setPassword(bCryptPasswordEncoder.encode(tempPassword));
            userRepository.save(user);

            // 3. 메일 제목과 내용 양식 짜기
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[BUS TAYO] 요청하신 임시 비밀번호 안내입니다.");
            message.setText("안녕하세요. 버스타조 서비스입니다.\n\n" +
                    "요청하신 임시 비밀번호는 [ " + tempPassword + " ] 입니다.\n" +
                    "로그인 후 마이페이지에서 반드시 비밀번호를 변경해 주세요!");

            // 3. 셋업된 구글 SMTP 서버를 통해 메일 발송 슛!
            mailSender.send(message);

            // 4. 콘솔창 확인용 로그
            System.out.println("임시 비번 메일 발송 완료! 생성된 비번: " + tempPassword);

            return true;

        } catch (Exception e) {
            System.err.println("메일 발송 중 에러 발생: " + e.getMessage());
            return false;
        }
    }

    public void sendAuthCodeEmail(String toEmail, String authCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[BUS TAYO] 회원가입 인증번호 안내");
        message.setText("안녕하세요. 버스타조 서비스입니다.\n\n" +
                "요청하신 인증번호는 [ " + authCode + " ] 입니다.\n" +
                "이 번호를 입력하여 인증을 완료해 주세요.");

        mailSender.send(message);
    }
}