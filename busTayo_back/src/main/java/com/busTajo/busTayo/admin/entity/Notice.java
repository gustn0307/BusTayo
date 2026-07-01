package com.busTajo.busTayo.admin.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 공지사항
@Entity
@Getter
@Setter
@Table(name = "notice")
public class Notice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title; // 공지사항 제목

    @Column(nullable = false, columnDefinition = "TEXT", length = 5000)
    private String content; // 공지사항 내용

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean deleted = false;
}