package com.busTajo.busTayo.lost.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LostDto {
    private String busNo;
    private String busCompanyName;
    private String phone;
}
