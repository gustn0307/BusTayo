package com.busTajo.busTayo.navigating.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NavigatingHistoryResponse {

    private Long id;

    private String start;

    private String end;

    private Double startX;
    private Double startY;

    private Double endX;
    private Double endY;
}
