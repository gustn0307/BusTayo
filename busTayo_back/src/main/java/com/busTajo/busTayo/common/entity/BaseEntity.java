package com.busTajo.busTayo.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 모든 Entity가 공통으로 사용하는 부모 클래스
// 역할:
// 1. 생성 시간(createdAt) 자동 저장
// 2. 수정 시간(updatedAt) 자동 저장
//
// 상속 예:
// public class Users extends BaseEntity
// public class NavigatingHistory extends BaseEntity
@Getter
@MappedSuperclass
// 이 클래스 자체는 테이블로 생성되지 않음
// 상속받는 Entity에 필드만 포함된다.
@EntityListeners(AuditingEntityListener.class)
// JPA Auditing 기능 활성화
// 생성/수정 시점 자동 기록
public class BaseEntity {

    // 생성일시
    //
    // Entity가 처음 DB에 INSERT될 때 자동 저장
    // 이후 수정 불가
    @CreatedDate
    @Column(updatable = false, nullable = false)
    LocalDateTime createdAt;

    // 수정일시
    //
    // Entity가 UPDATE될 때마다 자동 갱신
    @LastModifiedDate
    @Column(nullable = false)
    LocalDateTime updatedAt;
}