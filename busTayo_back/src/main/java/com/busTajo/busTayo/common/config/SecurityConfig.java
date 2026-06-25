package com.busTajo.busTayo.common.config;

import com.busTajo.busTayo.users.jwt.JWTFilter;
import com.busTajo.busTayo.users.jwt.JWTUtil;
import com.busTajo.busTayo.users.jwt.LoginFilter;
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


@Configuration
@EnableWebSecurity //스프링 부트의 기본 보안 설정이 비활성화되고, 개발자가 직접 작성한 보안 구성이 적용되도록 하는 어노테이션
public class SecurityConfig {

    // 우리가 만든 필터를 등록하는 작업
    //AuthenticationManager가 인자로 받을 AuthenticationConfiguration 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;

    // 토큰 유틸리티를 가져온다.
    private final JWTUtil jwtUtil;

    // 생성자 주입 방식
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    // AuthenticationManager를 Bean으로 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        //csrf(Cross-Site Request Forgery) 사이트 간 요청 위조 disable
        // 사용자가 자신의 의지와 무관하게 공격자가 의도한 행위(수정, 삭제, 전송 등)를 특정 웹사이트에 요청하게 만드는 해킹 기법
        http
                .csrf((auth) -> auth.disable());

        // Form 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        // http basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());


        // 경로별 인가 작업 (프로젝트에 맞게 수정 필요)
        http
                .authorizeHttpRequests((auth) ->
                        auth
                                .requestMatchers(
                                        "/login",
                                        "/",
                                        "/join",
                                        "/admin/**",
                                        "/notice",
                                        "/notice/**",
                                        "/api/board",
                                        "/api/board/**"
                                        ).permitAll()
                                .requestMatchers(
                                        "/user",
                                        "/api/navigating/**",
                                        "/api/bus/**",
                                        "/api/path/**"
                                ).hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/admin").hasRole("ADMIN")
                                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/delete-account").permitAll()
                                .anyRequest().authenticated()
                );

        // LoginFilter 앞에 JWTFilter 등록
        http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil);
        loginFilter.setFilterProcessesUrl("/login");

        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        // 세션 설정
        // JWT를 통한 인증/인가를 위해 세션을 STATELESS 상태로 설정하는 것이 중요
        http
                .sessionManagement((session) ->
                        session.
                                sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .cors(cors -> cors.configurationSource(request -> {

                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(
                            List.of("http://localhost:3000", "http://localhost:5173")
                    );
                    config.setAllowedMethods(
                            List.of("*")
                    );
                    config.setAllowedHeaders(
                            List.of("*")
                    );
                    config.setExposedHeaders(
                            List.of("Authorization")
                    );
                    config.setAllowCredentials(true);
                    return config;
                }));


        return http.build();
    }
}
