package com.busTajo.busTayo.bus.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FavoritesGroupDto {

    private Long id;

    private String name;

    private List<FavoritesItemDto> items;

}
