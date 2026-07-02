package com.busTajo.busTayo.users.jwt;

import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.service.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // /api/join이거나 /api/auth/로 시작하는 주소는 JWT 검문 패스!
        return "/api/join".equals(path) || path.startsWith("/api/auth/");
    }

    private final JWTUtil jwtUtil;


    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // request에서 Authorization 헤더를 찾기
        String authorization = request.getHeader("Authorization");
        System.out.println("===============");
        System.out.println("들어온 Authorization");
        System.out.println(authorization);
        System.out.println("===============");

        // Authorization 헤더 검증
        if ((authorization == null) || !(authorization.startsWith("Bearer "))) {
            System.out.println("token null");
            filterChain.doFilter(request, response);
            // 조건이 해당되면 메서드 종료해서 아래 과정 스킵(필수)
            return;
        }

        System.out.println("authorization now");

        // Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];
        System.out.println("===============");
        System.out.println("추출한 토큰");
        System.out.println(token);
        System.out.println("===============");


        // 토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            System.out.println("token expired");
            filterChain.doFilter(request, response);
            // 조건이 해당되면 메서드 종료해서 아래 과정 스킵(필수)
            return;
        }

        // 토큰에서 email과 role 획득
        String userEmail = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);
        System.out.println(jwtUtil.getRole(token));

        // Users를 생성하여 값 set
        Users user = new Users();
        user.setUserId(userEmail);
        user.setPassword("tempPassword");
        user.setRole(RoleType.valueOf(role));

        // UserDetail에 user 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        // 스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                customUserDetails,
                null,
                customUserDetails.getAuthorities()
        );

        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
