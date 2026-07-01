package com.busTajo.busTayo.users.service;

import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 생성자 주입 (기존 구조 유지)
    public CustomOAuth2UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 구글로부터 순수 유저 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 구글이 준 이메일 추출
        String email = oAuth2User.getAttribute("email");

        // 3. DB에 이미 이 이메일(userId)로 가입된 유저가 있는지 조회
        Users existData = userRepository.findByUserId(email);

        if (existData == null) {
            // 신규 유저일 때 DB에 바로 저장하지 않고, 로그만 찍고 그냥 넘깁니다.
            System.out.println("⚡ 신규 소셜 유저 감지 (DB 저장 없이 SuccessHandler로 패스): " + email);
        } else {
            // 이미 가입된 유저라면 그대로 통과
            System.out.println("✨ 기존 소셜 가입 회원 확인 완료: " + email);
        }

        // 4. 시큐리티가 다음 단계(CustomSuccessHandler)로 갈 수 있도록 객체 반환
        return oAuth2User;
    }
}