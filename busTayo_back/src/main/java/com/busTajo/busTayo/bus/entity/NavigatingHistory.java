package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 길찾기 이용내역 Entity
// 역할:
// 1. 사용자가 검색한 길찾기 기록 저장
// 2. 최근 길찾기 목록 제공
// 3. 출발지/도착지 이름 + 좌표 저장
//
// 테이블명:
// navigating_history
@Entity
@Getter
@Setter
@Table(name = "navigating_history")
public class NavigatingHistory extends BaseEntity {

    // 길찾기 기록 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 길찾기를 수행한 사용자
    //
    // 관계:
    // Users(1) : NavigatingHistory(N)
    //
    // 한 명의 사용자는 여러 개의 길찾기 기록을 가질 수 있다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // 출발지 이름
    //
    // 예:
    // 수원역
    // 광교중앙역
    @Column(nullable = false)
    private String start;

    // 도착지 이름
    //
    // 예:
    // 강남역
    // 판교역
    @Column(nullable = false)
    private String end;

    // 출발지 경도 (Longitude)
    //
    // ODsay API 호출 시 SX로 사용
    @Column(
            nullable = false,
            columnDefinition = "DECIMAL(13,10)",
            name = "start_x"
    )
    private Double startX;

    // 출발지 위도 (Latitude)
    //
    // ODsay API 호출 시 SY로 사용
    @Column(
            nullable = false,
            columnDefinition = "DECIMAL(13,10)",
            name = "start_y"
    )
    private Double startY;

    // 도착지 경도 (Longitude)
    //
    // ODsay API 호출 시 EX로 사용
    @Column(
            nullable = false,
            columnDefinition = "DECIMAL(13,10)",
            name = "end_x"
    )
    private Double endX;

    // 도착지 위도 (Latitude)
    //
    // ODsay API 호출 시 EY로 사용
    @Column(
            nullable = false,
            columnDefinition = "DECIMAL(13,10)",
            name = "end_y"
    )
    private Double endY;
}