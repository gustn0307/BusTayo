package com.busTajo.busTayo.lost.service;

import com.busTajo.busTayo.lost.dto.LostDto;
import com.busTajo.busTayo.lost.repository.LostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LostService {
    private final LostRepository busHistoryRepository;

    public List<LostDto> findAllBusHistory() {
        return busHistoryRepository
                .findAll()
                .stream()
                .map(x -> new LostDto(
                        x.getId(),
                        x.getBusName(),
                        x.getBoardingTime(),
                        x.getAlightingTime(),
                        x.getStart(),
                        x.getEnd(),
                        x.getCompany().getCompanyName(),
                        x.getCompany().getPhone(),
                        x.getVehicleNo()
                ))
                .toList();
    }

    public List<LostDto> findByUserId(String userId) {
        return busHistoryRepository
                .findByUser_UserId(userId)
                .stream()
                .map(x -> new LostDto(
                        x.getId(),
                        x.getBusName(),
                        x.getBoardingTime(),
                        x.getAlightingTime(),
                        x.getStart(),
                        x.getEnd(),
                        x.getCompany().getCompanyName(),
                        x.getCompany().getPhone(),
                        x.getVehicleNo()
                ))
                .toList();
    }
}
