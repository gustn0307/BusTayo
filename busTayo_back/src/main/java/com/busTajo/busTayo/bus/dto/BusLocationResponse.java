package com.busTajo.busTayo.bus.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusLocationResponse {
    private JsonNode busLocationList;
}
