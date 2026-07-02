package com.busTajo.busTayo.navigating.service;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import com.busTajo.busTayo.navigating.dto.NavigatingHistoryResponse;
import com.busTajo.busTayo.navigating.repository.NavigatingHistoryRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// 길찾기 이용내역 Service
// 역할:
// 1. 사용자가 길찾기 검색을 하면 이용내역 저장
// 2. 같은 출발지/도착지 조합이 중복 저장되지 않도록 기존 기록 삭제
// 3. 최근 길찾기 목록을 최신순으로 조회
// 4. Entity를 프론트 응답용 DTO로 변환
@Service
@RequiredArgsConstructor
public class NavigatingHistoryService {

    // 길찾기 이용내역 DB 접근 Repository
    private final NavigatingHistoryRepository navigatingHistoryRepository;

    // 사용자 정보 조회 Repository
    // userId로 Users 엔티티를 찾을 때 사용한다.
    private final UserRepository usersRepository;

    // 길찾기 이용내역 저장
    //
    // 호출 위치:
    // PathController.searchPath()
    //
    // 저장 정보:
    // userId = 로그인 사용자 ID
    // start = 출발지명
    // end = 도착지명
    // startX/startY = 출발지 경도/위도
    // endX/endY = 도착지 경도/위도
    public void saveHistory(
            String userId,
            String start,
            String end,
            Double startX,
            Double startY,
            Double endX,
            Double endY
    ) {

        // 같은 사용자가 같은 출발지/도착지로 검색한 기존 기록 삭제
        // 목적:
        // 동일 경로가 최근 길찾기 목록에 중복으로 쌓이는 것을 방지
        //
        // 삭제 후 다시 저장하기 때문에
        // 같은 경로를 다시 검색하면 최신 기록으로 올라온다.
        navigatingHistoryRepository.deleteByUser_UserIdAndStartAndEnd(
                userId,
                start,
                end
        );

        // 현재 로그인 사용자 조회
        // NavigatingHistory는 Users와 연관관계를 가진다.
        Users user = usersRepository.findByUserId(userId);

        // 새 길찾기 이용내역 엔티티 생성
        NavigatingHistory history = new NavigatingHistory();

        // 사용자 연결
        history.setUser(user);

        // 출발지/도착지 이름 저장
        history.setStart(start);
        history.setEnd(end);

        // 출발지 좌표 저장
        history.setStartX(startX);
        history.setStartY(startY);

        // 도착지 좌표 저장
        history.setEndX(endX);
        history.setEndY(endY);

        // DB 저장
        navigatingHistoryRepository.save(history);
    }

    // 최근 길찾기 목록 조회
    //
    // 호출 위치:
    // NavigatingHistoryController.getHistory()
    //
    // 반환:
    // 최신순 최대 10개
    public List<NavigatingHistoryResponse> getRecentHistory(String userId) {

        // 로그인 사용자의 최근 길찾기 10개 조회
        // Repository 메서드명으로 정렬/개수 제한 처리
        List<NavigatingHistory> histories =
                navigatingHistoryRepository
                        .findTop10ByUser_UserIdOrderByCreatedAtDesc(userId);

        // Entity 목록을 Response DTO 목록으로 변환
        return histories.stream()
                .map(history -> {

                    NavigatingHistoryResponse dto =
                            new NavigatingHistoryResponse();

                    // 프론트에서 key로 사용할 id
                    dto.setId(history.getId());

                    // 출발지/도착지 이름
                    dto.setStart(history.getStart());
                    dto.setEnd(history.getEnd());

                    // 출발지 좌표
                    dto.setStartX(history.getStartX());
                    dto.setStartY(history.getStartY());

                    // 도착지 좌표
                    dto.setEndX(history.getEndX());
                    dto.setEndY(history.getEndY());

                    return dto;
                })
                .toList();
    }
}