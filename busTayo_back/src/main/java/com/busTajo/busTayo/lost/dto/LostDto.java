package com.busTajo.busTayo.lost.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LostDto {
    private Long id;
    private String busName;
    private LocalDateTime boardingTime;
    private LocalDateTime alightingTime;
    private String start;
    private String end;
    private String companyName;
    private String companyPhone;
    private String vehicleNumber;

    public LostDto(Long id, String busName,
                   LocalDateTime boardingTime, LocalDateTime alightingTime,
                   String start, String end,
                   String companyName, String companyPhone,
                   String vehicleNumber) {
        this.id = id;
        this.busName = busName;
        this.boardingTime = boardingTime;
        this.alightingTime = alightingTime;
        this.start = start;
        this.end = end;
        this.companyName = companyName;
        this.companyPhone = companyPhone;
        this.vehicleNumber = vehicleNumber;
    }
}
