package com.busTajo.busTayo.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

// 버스 API 설정 클래스
// 역할:
// application.properties 또는 application.yml에 저장된
// 공공데이터포털 버스 API 인증키를 읽어온다.
@Getter
@Configuration
public class BusApiConfig {

    // 버스 API 서비스키
    //
    // 현재 사용처:
    // 1. 경기 버스 도착정보 API
    // 2. 경기 버스 위치정보 API
    // 3. 서울 버스 도착정보 API
    // 4. 서울 버스 위치정보 API
    @Value("${bus.api.service-key}")
    private String serviceKey;
}