package com.busTajo.busTayo.common.config;

import com.busTajo.busTayo.users.handler.CustomSuccessHandler;
import com.busTajo.busTayo.users.jwt.JWTFilter;
import com.busTajo.busTayo.users.jwt.JWTUtil;
import com.busTajo.busTayo.users.jwt.LoginFilter;
import com.busTajo.busTayo.users.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;

    public SecurityConfig(
            AuthenticationConfiguration authenticationConfiguration,
            JWTUtil jwtUtil,
            CustomOAuth2UserService customOAuth2UserService,
            CustomSuccessHandler customSuccessHandler
    ) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
    }

    // AuthenticationManager Bean 등록
    // LoginFilter에서 로그인 인증 처리 시 사용
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 1. CORS 설정
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
                    config.setAllowedMethods(List.of("*"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setExposedHeaders(List.of("Authorization"));
                    config.setAllowCredentials(true);
                    return config;
                }));

        // 2. 취약점 및 기본 로그인 비활성화
        http.csrf((auth) -> auth.disable());
        http.formLogin((auth) -> auth.disable());
        http.httpBasic((auth) -> auth.disable());

<<<<<<< HEAD
        // 3. OAuth2 소셜 로그인 기능 활성화 및 설정
        http
                .oauth2Login((oauth2) -> oauth2
                        .loginPage("/login") // 🟢 리액트 화면 주소 규격인 원래대로 /login 유지
                        .successHandler(customSuccessHandler)
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
=======

        // 경로별 인가 작업 (프로젝트에 맞게 수정 필요)
        http
                .authorizeHttpRequests((auth) ->
                        auth

                                .requestMatchers(
                                        "/login",
                                        "/",
                                        "/join",
                                        "/api/admin/**",
                                        "/notice",
                                        "/notice/**"
                                        ).permitAll()
                                .requestMatchers(
                                        "/user",
                                        "/api/navigating/**",
                                        "/api/bus/**",
                                        "/api/path/**",
                                        "/api/favorites/**"
                                ).hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/admin").hasRole("ADMIN")
                                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/delete-account").permitAll()
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
>>>>>>> d5a8e37ff4c1188093d82480ec48324f57fa7105
                );

        // 4. 경로별 인가 작업
        http
                .authorizeHttpRequests((auth) ->
                        auth
                                // 🟢 기존 허용 경로들 앞에 /api 붙인 것 아주 좋습니다! 단, "/"는 메인 홈 화면 타겟이므로 그대로 유지하거나 제외해도 좋습니다.
                                .requestMatchers("/api/auth/check-email", "/api/auth/email/send", "/api/auth/email/verify", "/api/login", "/", "/api/join", "/api/auth/**" , "/api/nearby/**" , "/api/admin/**", "/api/notice", "/api/notice/**").permitAll()

                                // 🟢 구글 소셜 로그인 내부 통로 방어벽 해제 (기존 규격과 /api 규격을 모두 열어두어 확실하게 가로채도록 안전장치)
                                .requestMatchers("/login/oauth2/**", "/oauth2/**", "/api/login/oauth2/**", "/api/oauth2/**").permitAll()

                                .requestMatchers("/api/user").hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/api/admin").hasRole("ADMIN")
                                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/delete-account").permitAll()
                                .anyRequest().authenticated()
                );

        // 5. 필터 배치 순서 정돈
        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil);
        loginFilter.setFilterProcessesUrl("/api/login"); // 💡 [교정] 일반 POST /login 요청만 잡아가도록 주소를 명확하게 제한합니다.

        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);

        // 6. 세션 STATELESS 설정
        http
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
