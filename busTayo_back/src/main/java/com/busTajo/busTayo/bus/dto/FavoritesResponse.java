package com.busTajo.busTayo.bus.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FavoritesResponse {

    private List<FavoritesItemDto> ungrouped;

    private List<FavoritesGroupDto> groups;

}
