package com.busTajo.busTayo.common.config;

import com.busTajo.busTayo.users.jwt.JWTFilter;
import com.busTajo.busTayo.users.jwt.JWTUtil;
import com.busTajo.busTayo.users.jwt.LoginFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

// Spring Security 설정 클래스
// 역할:
// 1. JWT 기반 인증/인가 설정
// 2. 로그인 필터 등록
// 3. JWT 검증 필터 등록
// 4. API 접근 권한 설정
// 5. CORS 설정
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // AuthenticationManager를 생성하기 위한 Spring Security 설정 객체
    private final AuthenticationConfiguration authenticationConfiguration;

    // JWT 생성/검증 유틸 클래스
    private final JWTUtil jwtUtil;

    // 생성자 주입
    public SecurityConfig(
            AuthenticationConfiguration authenticationConfiguration,
            JWTUtil jwtUtil
    ) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    // AuthenticationManager Bean 등록
    // LoginFilter에서 로그인 인증 처리 시 사용
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 비밀번호 암호화 Bean
    // 회원가입/로그인 시 비밀번호 검증에 사용
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // SecurityFilterChain 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CSRF 비활성화
        // JWT 기반 REST API에서는 세션 기반 CSRF 보호를 사용하지 않음
        http.csrf((auth) -> auth.disable());

        // Form Login 비활성화
        // 기본 로그인 페이지를 사용하지 않고 LoginFilter에서 직접 로그인 처리
        http.formLogin((auth) -> auth.disable());

        // HTTP Basic 인증 비활성화
        // Authorization Basic 방식 대신 JWT Bearer Token 사용
        http.httpBasic((auth) -> auth.disable());



        // URL별 접근 권한 설정
        http.authorizeHttpRequests((auth) ->
                auth
                        // 로그인 없이 접근 가능한 경로
                        .requestMatchers(
                                "/login",
                                "/",
                                "/join",
                                "api/admin/**",
                                "api/notice",
                                "api/notice/**",
                                "/api/editor/upload",
                                "/uploads/**",
                                "/smarteditor2-2.8"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/board", "/api/board/**").permitAll()

                        // 로그인한 USER 또는 ADMIN만 접근 가능한 API
                        .requestMatchers(
                                "/user",
                                "/api/navigating/**",
                                "/api/bus/**",
                                "/api/path/**"
                        ).hasAnyRole("USER", "ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/board", "/api/board/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/board", "/api/board/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/board", "/api/board/**").hasAnyRole("USER", "ADMIN")

                        // ADMIN 권한만 접근 가능
                        .requestMatchers("/admin").hasRole("ADMIN")

                        // 회원 탈퇴 요청 허용
                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE,
                                "/delete-account"
                        ).permitAll()

                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().authenticated()
        );

        // JWTFilter 등록
        // LoginFilter보다 먼저 실행되어 요청의 JWT 토큰을 검사한다.
        http.addFilterBefore(
                new JWTFilter(jwtUtil),
                LoginFilter.class
        );

        // LoginFilter 생성
        // /login 요청에서 아이디/비밀번호 인증 후 JWT 발급
        LoginFilter loginFilter =
                new LoginFilter(
                        authenticationManager(authenticationConfiguration),
                        jwtUtil
                );

        // 기본 로그인 처리 URL을 /login으로 지정
        loginFilter.setFilterProcessesUrl("/login");

        // UsernamePasswordAuthenticationFilter 위치에 LoginFilter 등록
        http.addFilterAt(
                loginFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        // 세션 사용 안 함
        // JWT 기반 인증이므로 서버가 로그인 세션을 저장하지 않는다.
        http.sessionManagement((session) ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // CORS 설정
        // 프론트엔드 개발 서버에서 백엔드 API 호출 허용
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();

            // 허용할 프론트 주소
            // 배포 시 운영 프론트 도메인을 반드시 추가해야 한다.
            config.setAllowedOrigins(
                    List.of(
                            "http://localhost:3000",
                            "http://localhost:5173"
                    )
            );

            // 모든 HTTP Method 허용
            config.setAllowedMethods(List.of("*"));

            // 모든 Header 허용
            config.setAllowedHeaders(List.of("*"));

            // 프론트에서 Authorization 헤더를 읽을 수 있도록 노출
            config.setExposedHeaders(List.of("Authorization"));

            // 쿠키/인증 정보 포함 요청 허용
            config.setAllowCredentials(true);

            return config;
        }));

        return http.build();
    }
}