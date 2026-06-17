package com.busTajo.busTayo.bus.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 버스 회사 정보 테이블
@Entity
@Getter
@Setter
@Table(name = "bus_company")
public class BusCompany extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String companyName; // 회사 이름

    @Column(nullable = false, length = 100)
    private String phone; // 회사 전화번호
}