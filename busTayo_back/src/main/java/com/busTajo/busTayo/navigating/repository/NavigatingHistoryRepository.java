package com.busTajo.busTayo.navigating.repository;

import com.busTajo.busTayo.bus.entity.NavigatingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// 길찾기 이용내역 Repository
// 역할:
// 1. 길찾기 이용내역 CRUD
// 2. 최근 길찾기 조회
// 3. 동일 경로 중복 제거
@Transactional
public interface NavigatingHistoryRepository
        extends JpaRepository<NavigatingHistory, Long> {

    // 특정 사용자의 최근 길찾기 10개 조회
    //
    // SQL 느낌으로 보면:
    // SELECT *
    // FROM navigating_history
    // WHERE user_id = ?
    // ORDER BY created_at DESC
    // LIMIT 10
    //
    // userId = 로그인 사용자 ID
    // createdAt 최신순 정렬
    List<NavigatingHistory> findTop10ByUser_UserIdOrderByCreatedAtDesc(
            String userId
    );

    // 동일한 길찾기 경로 삭제
    //
    // 목적:
    // 같은 출발지/도착지 조합이 중복 저장되는 것 방지
    //
    // SQL 느낌:
    // DELETE FROM navigating_history
    // WHERE user.userId = ?
    //   AND start = ?
    //   AND end = ?
    void deleteByUser_UserIdAndStartAndEnd(
            String userId,
            String start,
            String end
    );
}