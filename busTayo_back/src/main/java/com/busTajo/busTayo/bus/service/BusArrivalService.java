package com.busTajo.busTayo.bus.service;

import com.busTajo.busTayo.config.BusApiConfig;
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
            Integer cityCode
    ) {

        String url =
                "https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2"
                        + "?serviceKey=" + busApiConfig.getServiceKey()
                        + "&stationId=" + stationId
                        + "&format=json";

        System.out.println(url);
        RestTemplate restTemplate =
                new RestTemplate();

        String result = restTemplate.getForObject(
                url,
                String.class
        );

        return result;
    }

    public String getBusLocation(Long routeId) {

        String url =
                "https://apis.data.go.kr/6410000/buslocationservice/v2/getBusLocationListv2"
                        + "?serviceKey=" + busApiConfig.getServiceKey()
                        + "&routeId=" + routeId
                        + "&format=json";

        System.out.println(url);

        RestTemplate restTemplate =
                new RestTemplate();

        String result = restTemplate.getForObject(
                url,
                String.class
        );

        return result;
    }

    public String testRoute(Long routeId) {

        String url =
                "https://apis.data.go.kr/6410000/busrouteservice/v2/getBusRouteStationListv2"
                        + "?serviceKey=" + busApiConfig.getServiceKey()
                        + "&routeId=" + routeId
                        + "&format=json";

        System.out.println(url);

        RestTemplate restTemplate =
                new RestTemplate();

        String result =
                restTemplate.getForObject(
                        url,
                        String.class
                );

        System.out.println(result);

        return result;
    }

}
