package com.busTajo.busTayo.nearby.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.bind.annotation.ResponseBody;

@Getter
@Setter
@ToString
public class BusStopApiResponseDto {

    @JsonProperty("response")
    private ResponseResult response;

    @Getter
    @Setter
    @ToString
    public static class ResponseResult {
        @JsonProperty("body")
        private ResponseBody body;
    }

    @Getter
    @Setter
    @ToString
    public static class ResponseBody {
        @JsonProperty("items")
        private ResponseItems items;
    }

}
