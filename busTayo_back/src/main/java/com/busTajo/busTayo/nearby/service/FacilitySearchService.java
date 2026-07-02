package com.busTajo.busTayo.nearby.service;

import com.busTajo.busTayo.nearby.dto.FacilityOutputDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacilitySearchService {

    private final RestTemplate restTemplate;

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    // 카카오 로컬 API 주소 (카테고리용 vs 키워드용)
    private static final String KAKAO_CATEGORY_URL = "https://dapi.kakao.com/v2/local/search/category.json";
    private static final String KAKAO_KEYWORD_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

    public List<FacilityOutputDto> requestNearbyFacilities(String category, double latitude, double longitude) {

        // 1. 카카오 공식 코드인지, 일반 키워드(화장실/패스트푸드)인지 판별
        boolean isCategoryCode = isKakaoCategoryCode(category);
        String targetTarget = convertCategory(category);

        // 2. 판별 결과에 따라 호출할 카카오 엔드포인트 URL 선택 및 주소 조립
        String baseUrl = isCategoryCode ? KAKAO_CATEGORY_URL : KAKAO_KEYWORD_URL;

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("y", latitude)
                .queryParam("x", longitude)
                .queryParam("radius", 500);

        if (isCategoryCode) {
            uriBuilder.queryParam("category_group_code", targetTarget);
        } else {
            uriBuilder.queryParam("query", targetTarget);
        }

        // 🟢 [수정] .encode()를 추가하여 '패스트푸드', '공공화장실' 같은 한글을 UTF-8로 안전하게 변환합니다.
        URI uri = uriBuilder.build().encode().toUri();
        log.info("🚀 [카카오 API 송신] 요청 URI: {}", uri);

        // 3. 카카오 REST API 핵심 규칙: 헤더에 Authorization KakaoAK [내키]를 반드시 실어야 합니다.
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        try {
            // 4. RestTemplate으로 카카오 서버 격파 (자바 기본 Map 구조로 날것의 JSON 받아오기)
            Map<?, ?> apiResponse = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    httpEntity,
                    Map.class
            ).getBody();

            if (apiResponse == null || !apiResponse.containsKey("documents")) {
                return Collections.emptyList();
            }

            // 5. 날것의 데이터에서 주 장소 리스트(documents) 꺼내기
            List<Map<String, Object>> documents = (List<Map<String, Object>>) apiResponse.get("documents");

            // 6. 우리 팀 핵심 규칙: Stream API를 사용해 필요한 정보만 이쁜 그릇(DTO)으로 정제하기
            return documents.stream()
                    .map(doc -> FacilityOutputDto.builder()
                            .placeName((String) doc.get("place_name"))
                            .latitude(Double.parseDouble((String) doc.get("y")))
                            .longitude(Double.parseDouble((String) doc.get("x")))
                            .build())
                    .toList();

        } catch (Exception e) {
            log.error("❌ 카카오 로컬 API 통신 중 에러 발생: ", e);
            return Collections.emptyList();
        }
    }

    /**
     * 카카오 공식 카테고리 그룹 코드를 사용하는 항목인지 확인하는 판별기
     */
    private boolean isKakaoCategoryCode(String category) {
        return "convenience".equals(category) || "pharmacy".equals(category) ||
                "cafe".equals(category) || "bank".equals(category);
    }

    /**
     * 리액트 영어 카테고리명을 카카오 전용 코드 또는 검색 키워드로 치환
     */
    public String convertCategory(String category) {
        return switch (category) {
            case "convenience" -> "CS2";
            case "pharmacy" -> "PM9";
            case "cafe" -> "CE7";
            case "bank" -> "BK9";
            case "fastfood" -> "햄버거"; // 👈 "패스트푸드" 대신 "햄버거"로 변경
            case "restroom" -> "화장실";   // 👈 "공공화장실" 대신 "화장실"로 변경
            default -> throw new IllegalArgumentException("❌ 알 수 없는 카테고리입니다: " + category);
        };
    }
}