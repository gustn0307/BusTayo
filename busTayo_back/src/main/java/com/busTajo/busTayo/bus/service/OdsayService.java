package com.busTajo.busTayo.bus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OdsayService {

    @Value("${odsay.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public String searchPath(
            double sx,
            double sy,
            double ex,
            double ey
    ) {

        String url =
                "https://api.odsay.com/v1/api/searchPubTransPathT?" +
                        "SX=" + sx +
                        "&SY=" + sy +
                        "&EX=" + ex +
                        "&EY=" + ey +
                        "&apiKey=" + apiKey;

        return restTemplate.getForObject(url, String.class);
    }
}