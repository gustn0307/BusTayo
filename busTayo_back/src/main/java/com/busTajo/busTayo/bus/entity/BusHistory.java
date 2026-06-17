package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// 분실물 찾기 시 버스 이용 내역 보여주기 위한 테이블
@Entity
@Getter
@Setter
@Table(name = "bus_history")
public class BusHistory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "user_id", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private Users user;

    @Column(nullable = false)
    private String busId; // odsay API에서 받아온 버스 ID(추후 재검색 대비용)

    @Column(nullable = false)
    private String busName; // 버스 이름 (예: 30번, 700번)

    @Column(nullable = false)
    private String vehicleNo; // 실제 버스의 차량 번호

    @Column(nullable = false)
    private LocalDateTime boardingTime; // 승차 일시

    @Column(nullable = false)
    private LocalDateTime alightingTime; // 하차 일시

    @Column(nullable = false)
    private String start; // 출발지 이름

    @Column(nullable = false)
    private String end;  // 도착지 이름

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "company_name", referencedColumnName = "companyName", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private BusCompany company;
}