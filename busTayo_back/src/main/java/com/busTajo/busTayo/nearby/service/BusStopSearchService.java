package com.busTajo.busTayo.nearby.service;

import com.busTajo.busTayo.nearby.dto.BusStopApiResponseDto;
import com.busTajo.busTayo.nearby.dto.BusStopDto;
import com.busTajo.busTayo.nearby.dto.BusStopOutputDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusStopSearchService {

    private final RestTemplate restTemplate;

    @Value("${busStop.data.api.key}")
    private String serviceKey;

    private static final String BUS_STOP_URL =
            "https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList";

    public List<BusStopOutputDto> requestNearbyBusStops(double latitude, double longitude) {

        // 1. 우리 팀 규칙대로 UriComponentsBuilder를 사용해 주소 조립
        URI uri = UriComponentsBuilder.fromUriString(BUS_STOP_URL)
                .queryParam("serviceKey", serviceKey)
                .queryParam("gpsLati", latitude)
                .queryParam("gpsLong", longitude)
                .queryParam("_type", "json") // JSON 형태로 달라고 정부에 요청
                .build()
                .toUri();

        log.info("🚀 정부 서버로 요청 보내는 URI: " + uri);

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<Object> httpEntity = new HttpEntity<>(headers);

        try {
            // 2. restTemplate.exchange()로 정부 서버 찌르기
            BusStopApiResponseDto apiResponse = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    httpEntity,
                    BusStopApiResponseDto.class
            ).getBody();

            // 방어 코드: 데이터가 비어있거나 터졌을 때 안전하게 빈 상자 반환
            if (apiResponse == null || apiResponse.getResponse() == null
                    || apiResponse.getResponse().getBody() == null
                    || apiResponse.getResponse().getBody().getItems() == null) {
                return Collections.emptyList();
            }

            // 3. 팀원님이 명명하신 busStopDtoList 변수에서 날것의 리스트 꺼내기
            List<BusStopDto> rawList = apiResponse.getResponse().getBody().getItems().getBusStopDtoList();

            // 4. 우리 팀의 핵심 규칙: Stream API를 사용하여 최대 5개만 이쁜 그릇으로 변환하기
            return rawList.stream()
                    .map(x -> convertToOutputDto(x))
                    .limit(5)
                    .toList();

        } catch (Exception e) {
            log.error("❌ 공공데이터 통신 중 에러 발생: ", e);
            return Collections.emptyList();
        }
    }

    // 날것의 BusStopDto 조각을 화면용 BusStopOutputDto로 변환하는 조립 공장
    private BusStopOutputDto convertToOutputDto(BusStopDto busStop) {
        return BusStopOutputDto.builder()
                .stopId(busStop.getStopId())
                .stopName(busStop.getStopName())
                .stopNumber(busStop.getStopNumber())
                .latitude(busStop.getLatitude())
                .longitude(busStop.getLongitude())
                .build();
    }
}
