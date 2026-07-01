package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 길찾기 즐겨찾기
@Entity
@Getter
@Setter
@Table(name = "favorites_navigating")
public class FavoritesNavigating extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    // 그룹 미지정 즐겨찾기는 group_id가 null로 저장됨
    @ManyToOne(fetch = FetchType.LAZY)
    // group_id 컬럼을 FavoritesGroup의 @Id가 붙은 PK와 연결(FK)
    // nullable을 지정하지 않아서 그룹 없는 즐겨찾기도 저장 가능
    @JoinColumn(name = "group_id")
    private FavoritesGroup group;

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "user_id", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private Users user;

    @Column(nullable = false)
    private String name; // 즐겨찾기 이름

    @Column(columnDefinition = "TEXT")
    private String description; // 즐겨찾기 유저가 작성하는 설명

    // 화면에 보여줄 출발지, 도착지
    @Column(nullable = false)
    private String start; // 출발지 이름

    @Column(nullable = false)
    private String end; // 도착지 이름

    // ODsay API 길찾기 호출에 필요한 핵심 파라미터
    @Column(nullable = false, columnDefinition = "DECIMAL(13,10)", name = "start_x")
    private Double startX; // 출발지 경도(Longitude)

    @Column(nullable = false, columnDefinition = "DECIMAL(13,10)", name = "start_y")
    private Double startY; // 출발지 위도(Latitude)

    @Column(nullable = false, columnDefinition = "DECIMAL(13,10)", name = "end_x")
    private Double endX; // 도착지 경도(Longitude)

    @Column(nullable = false, columnDefinition = "DECIMAL(13,10)", name = "end_y")
    private Double endY; // 도착지 위도(Latitude)
}