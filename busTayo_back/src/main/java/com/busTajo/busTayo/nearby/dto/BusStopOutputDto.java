package com.busTajo.busTayo.nearby.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class BusStopOutputDto {
    private String stopId;
    private String stopName;
    private String stopNumber;
    private double latitude;
    private double longitude;
}
