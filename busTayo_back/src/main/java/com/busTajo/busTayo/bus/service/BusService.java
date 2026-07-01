package com.busTajo.busTayo.bus.service;

import com.busTajo.busTayo.config.BusApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// 버스 도착정보 / 차량위치 조회 서비스
// 역할:
// 1. cityCode를 기준으로 서울 API와 경기 API를 분기
// 2. 버스 도착정보 조회
// 3. 버스 차량위치 조회
// 4. 서울 XML 응답을 프론트에서 쓰기 쉬운 JSON 형태로 변환
@Service
public class BusService {

    // 공공데이터포털 API 인증키 설정 객체
    // application.yml 또는 properties에서 serviceKey를 읽어온다.
    private final BusApiConfig busApiConfig;

    // 생성자 주입
    public BusService(BusApiConfig busApiConfig) {
        this.busApiConfig = busApiConfig;
    }

    // 버스 도착정보 조회
    //
    // stationId = 정류장 ID
    // cityCode = 지역 코드
    // routeId = 노선 ID
    // ord = 서울 도착정보 API에서 필요한 정류장 순번
    public String getArrivalInfo(
            String stationId,
            Integer cityCode,
            String routeId,
            Integer ord
    ) {
        RestTemplate restTemplate = new RestTemplate();

        String url;

        // 서울 버스 도착정보 API
        // 서울 cityCode는 ODsay 기준 1000
        if (cityCode != null && cityCode == 1000) {
            url =
                    "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&stId=" + stationId
                            + "&busRouteId=" + routeId
                            + "&ord=" + ord;
        } else {
            // 경기 버스 도착정보 API
            // 경기 API는 stationId만으로 해당 정류장의 여러 노선 도착정보를 반환한다.
            url =
                    "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&stationId=" + stationId
                            + "&format=json";
        }

        // 외부 API 호출 후 응답 문자열 그대로 반환
        return restTemplate.getForObject(url, String.class);
    }

    // 버스 차량위치 조회
    //
    // cityCode = 지역 코드
    // routeId = 노선 ID
    public String getBusLocation(Integer cityCode, Long routeId) {
        RestTemplate restTemplate = new RestTemplate();

        String url;

        // 서울 차량위치 API
        // 응답이 XML 형식이므로 JSON으로 변환해서 프론트에 전달한다.
        if (cityCode != null && cityCode == 1000) {
            url =
                    "http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&busRouteId=" + routeId;

            String result = restTemplate.getForObject(
                    url,
                    String.class
            );

            try {
                // 서울 API XML 응답 파싱
                XmlMapper xmlMapper = new XmlMapper();

                JsonNode node = xmlMapper.readTree(result.getBytes());

                // XML 응답 중 실제 차량 목록에 해당하는 itemList 추출
                JsonNode itemList = node
                        .path("msgBody")
                        .path("itemList");

                // 프론트에서 경기 API와 비슷하게 다루기 쉽도록
                // busLocationList 필드로 감싸서 반환한다.
                ObjectMapper objectMapper = new ObjectMapper();

                ObjectNode response = objectMapper.createObjectNode();

                response.set("busLocationList", itemList);

                return response.toString();

            } catch (Exception e) {
                throw new RuntimeException("서울 버스 위치 XML 변환 실패", e);
            }
        } else {
            // 경기 차량위치 API
            // 응답은 JSON 형식이며, 차량 좌표 대신 stationSeq 중심의 위치 정보를 제공한다.
            url = "https://apis.data.go.kr/6410000/buslocationservice/v2/getBusLocationListv2"
                    + "?serviceKey=" + busApiConfig.getServiceKey()
                    + "&routeId=" + routeId
                    + "&format=json";

            return restTemplate.getForObject(
                    url,
                    String.class
            );
        }
    }
}