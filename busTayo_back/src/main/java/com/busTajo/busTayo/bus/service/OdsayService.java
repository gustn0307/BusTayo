package com.busTajo.busTayo.bus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// ODsay API 호출 서비스
// 역할:
// 1. 출발지/도착지 좌표를 받아 ODsay 길찾기 API 호출
// 2. 버스타요 서비스 목적에 맞게 "버스 전용 경로"만 조회
// 3. ODsay 응답 JSON 문자열을 Controller로 반환
@Service
@RequiredArgsConstructor
public class OdsayService {

    // application.yml 또는 application.properties에 저장된 ODsay API Key
    @Value("${odsay.api-key}")
    private String apiKey;

    // 외부 API 호출용 객체
    private final RestTemplate restTemplate;

    // 버스 전용 길찾기 검색
    //
    // sx = 출발지 경도
    // sy = 출발지 위도
    // ex = 도착지 경도
    // ey = 도착지 위도
    public String searchPath(
            double sx,
            double sy,
            double ex,
            double ey
    ) {
        // SearchPathType=2
        // ODsay에서 버스 경로만 조회하도록 지정
        String url =
                "https://api.odsay.com/v1/api/searchPubTransPathT?" +
                        "SX=" + sx +
                        "&SY=" + sy +
                        "&EX=" + ex +
                        "&EY=" + ey +
                        "&SearchPathType=2" +
                        "&apiKey=" + apiKey;

        // ODsay API 호출 후 JSON 문자열 그대로 반환
        return restTemplate.getForObject(url, String.class);
    }
}