package com.busTajo.busTayo.users.handler;

import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.jwt.JWTUtil;
import com.busTajo.busTayo.users.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    public CustomSuccessHandler(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // 1. 구글이 넘겨준 유저 정보 객체 꺼내기
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 2. 유저 식별자(이메일) 추출하기
        String email = oAuth2User.getAttribute("email");

        // 3. DB 조회: 유저가 있는지 확인
        Users user = userRepository.findByUserId(email);

        // 4. 권한(Role) 설정하기
        String role;
        if (user != null) {
            role = user.getRole().name();
            System.out.println("[구글 로그인 성공] 기존 회원: " + email + " (권한: " + role + ")");
        } else {
            role = "ROLE_GUEST";
            System.out.println("[구글 로그인 성공] 신규 회원: " + email + " (GUEST 임시 토큰 발급)");
        }

        // 5. JWT 토큰 생성 (유효시간: 30분)
        String token = jwtUtil.createJwt(email, role, 60 * 30 * 1000L);

        // 6. 생성한 토큰을 쿠키에 담아서 배달
        response.addCookie(createCookie("Authorization", token));

        // 7. 💡 포트는 3000 유지, 주소 경로는 리액트 콜백 규칙(/auth/callback)으로 전송
        String targetUrl = "http://localhost:3000/auth/callback";
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 30); // 💡 쿠키 배달 상자 수명도 똑같이 10초로 맞춰서 수정!
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        return cookie;
    }
}