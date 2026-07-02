package com.busTajo.busTayo.bus.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoritesItemDto {

    private Long id;
    private Long groupId;

    private String name;

    private String description;

    private String start;
    private Double startX;
    private Double startY;

    private String end;
    private Double endX;
    private Double endY;

}


