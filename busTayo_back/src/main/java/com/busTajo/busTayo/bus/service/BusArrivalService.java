package com.busTajo.busTayo.bus.service;

import com.busTajo.busTayo.config.BusApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BusArrivalService {

    private final BusApiConfig busApiConfig;

    public BusArrivalService(BusApiConfig busApiConfig) {
        this.busApiConfig = busApiConfig;
    }

    public String getArrivalInfo(
            String stationId,
            Integer cityCode,
            String routeId,
            Integer ord
    ) {
        RestTemplate restTemplate = new RestTemplate();
        String url;

        if (cityCode == 1000) { // 서울
            System.out.println("serviceKey = [" + busApiConfig.getServiceKey() + "]");
            url =
                    "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&stId=" + stationId
                            + "&busRouteId=" + routeId
                            + "&ord=" + ord;
        } else { // 경기
            url =
                    "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&stationId=" + stationId
                            + "&format=json";
        }

        System.out.println(url);

        String result = restTemplate.getForObject(url, String.class);

        System.out.println("result: " + result);

        return result;
    }

    public String getBusLocation(Integer cityCode, Long routeId) {
        RestTemplate restTemplate = new RestTemplate();
        String url;

        if(cityCode==1000){ // 서울
            url =
                    "http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid"
                            + "?serviceKey=" + busApiConfig.getServiceKey()
                            + "&busRouteId=" + routeId;
            System.out.println(url);

            String result = restTemplate.getForObject(
                    url,
                    String.class
            );

            System.out.println("차량위치 결과 : " +result); // xml 형식

            // xml -> json으로 변환
            try{

                XmlMapper mapper = new XmlMapper();

                JsonNode node = mapper.readTree(result.getBytes());

                JsonNode itemList = node
                        .path("msgBody")
                        .path("itemList");

                ObjectMapper objectMapper = new ObjectMapper();

                ObjectNode response = objectMapper.createObjectNode();

                response.set("busLocationList", itemList);

                return response.toString();

            }catch(Exception e){

                throw new RuntimeException(e);

            }
        }else{ // 경기
            url= "https://apis.data.go.kr/6410000/buslocationservice/v2/getBusLocationListv2"
                    + "?serviceKey=" + busApiConfig.getServiceKey()
                    + "&routeId=" + routeId
                    + "&format=json";
            System.out.println(url);

            String result = restTemplate.getForObject(
                    url,
                    String.class
            );

            System.out.println("차량위치 결과 : " +result);

            return result;
        }
    }
}
