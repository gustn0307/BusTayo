package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

// 즐겨찾기 그룹
@Entity
@Getter
@Setter
@Table(name = "favorites_group")
public class FavoritesGroup extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "user_id", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private Users user;

    @Column(nullable = false, length = 200)
    private String name; // 즐겨찾기 이름

    @Column(columnDefinition = "TEXT")
    private String description; // 즐겨찾기 설명

    // 그룹 삭제시 하위 즐겨찾기 삭제
    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<FavoritesBus> buses = new ArrayList<>();
}