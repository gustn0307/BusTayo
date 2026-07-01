package com.busTajo.busTayo.nearby.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FacilityOutputDto {
    private String placeName; // 시설 이름 (예: OO약국, OO편의점)
    private double latitude;  // 위도 (y)
    private double longitude; // 경도 (x)
}