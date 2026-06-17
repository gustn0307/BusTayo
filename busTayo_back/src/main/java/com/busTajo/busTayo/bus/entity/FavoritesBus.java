package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 버스 즐겨찾기
@Entity
@Getter
@Setter
@Table(name = "favorites_bus")
public class FavoritesBus extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "group_id", nullable = false) // group_id 컬럼을 FavoritesGroup의 @Id가 붙은 PK와 연결(FK)
    private FavoritesGroup group;

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "user_id", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private Users user;

    @Column(nullable = false)
    private String bus_id; // API에서 받아오는 ID

    @Column(nullable = false)
    private String name; // 즐겨찾기 이름

    @Column(columnDefinition = "TEXT")
    private String description; // 즐겨찾기 설명
}