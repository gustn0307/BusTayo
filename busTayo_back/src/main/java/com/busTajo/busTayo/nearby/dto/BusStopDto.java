package com.busTajo.busTayo.nearby.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class BusStopDto {
    @JsonProperty("nodeid")
    private String stopId;

    @JsonProperty("nodenm")
    private String stopName;

    @JsonProperty("nodeno")
    private String stopNumber;

    @JsonProperty("gpslati")
    private double latitude;

    @JsonProperty("gpslong")
    private double longitude;
}
