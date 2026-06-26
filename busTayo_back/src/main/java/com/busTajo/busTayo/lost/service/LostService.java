package com.busTajo.busTayo.lost.service;

import com.busTajo.busTayo.bus.entity.BusCompany;
import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import com.busTajo.busTayo.lost.dto.LostDto;
import com.busTajo.busTayo.lost.repository.LostRepository;
import com.busTajo.busTayo.navigating.repository.NavigatingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LostService {

    private final NavigatingHistoryRepository navigatingHistoryRepository;
    private final LostRepository lostRepository;

    @Value("${odsay.api-key}")
    private String apiKey;

    public List<LostDto> getBusesFromHistory(Long historyId) {
        NavigatingHistory history = navigatingHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("History not found"));

        String url = "https://api.odsay.com/v1/api/searchPubTransPathT"
                + "?SX=" + history.getStartX()
                + "&SY=" + history.getStartY()
                + "&EX=" + history.getEndX()
                + "&EY=" + history.getEndY()
                + "&apiKey=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.getForObject(url, Map.class);

        return extractGyeonggiBuses(response, restTemplate);
    }

    private List<LostDto> extractGyeonggiBuses(Map response, RestTemplate restTemplate) {
        List<LostDto> result = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        try {
            Map result0 = (Map) response.get("result");
            if (result0 == null) return result;

            List paths = (List) result0.get("path");
            if (paths == null) return result;

            // ★ 변경: 첫 번째 경로(paths.get(0))만 보지 않고, 모든 경로를 순회합니다.
            for (Object p : paths) {
                Map path = (Map) p;
                List subPaths = (List) path.get("subPath");
                if (subPaths == null) continue;

                for (Object sp : subPaths) {
                    Map subPath = (Map) sp;
                    Integer trafficType = (Integer) subPath.get("trafficType");

                    // trafficType 2가 버스입니다.
                    if (trafficType == null || trafficType != 2) continue;

                    List lanes = (List) subPath.get("lane");
                    if (lanes == null) continue;

                    for (Object l : lanes) {
                        Map lane = (Map) l;
                        String busCityCode = lane.get("busCityCode") != null
                                ? lane.get("busCityCode").toString() : "";

                        if ("1000".equals(busCityCode)) continue; // 서울 제외

                        String busNo = (String) lane.get("busNo");
                        if (busNo == null || seen.contains(busNo)) continue;
                        seen.add(busNo);

                        // busID로 버스노선 조회 API 호출
                        if (lane.get("busID") == null) continue;
                        Long busId = Long.valueOf(lane.get("busID").toString());

                        String companyName = getCompanyNameByBusId(busId, restTemplate);
                        System.out.println("busNo: " + busNo + " / companyName: " + companyName);

                        String phone = getPhoneFromDb(companyName);
                        result.add(new LostDto(busNo, companyName, phone));
                    }
                }
            }
        } catch (Exception e) {
            // 어디서 에러가 났는지 스택 트레이스를 명확히 확인하기 위해 프린트 추가
            e.printStackTrace();
            throw new RuntimeException("OdSay 응답 파싱 실패", e);
        }

        return result;
    }

    // busID로 버스노선 조회 API 호출 → busCompanyNameKor 반환
    private String getCompanyNameByBusId(Long busId, RestTemplate restTemplate) {
        try {
            String url = "https://api.odsay.com/v1/api/busLaneDetail"
                    + "?busID=" + busId
                    + "&apiKey=" + apiKey;

            Map response = restTemplate.getForObject(url, Map.class);
            Map result = (Map) response.get("result");

            // lane 안이 아니라 result 바로 하위에 있음
            String companyName = (String) result.get("busCompanyNameKor");
            System.out.println("busID: " + busId + " / companyName: " + companyName);

            return companyName;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getPhoneFromDb(String companyName) {
        if (companyName == null) return null;
        return lostRepository
                .findByCompanyNameLike(companyName)
                .map(BusCompany::getPhone)
                .orElse(null);
    }
}