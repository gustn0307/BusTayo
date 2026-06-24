package com.busTajo.busTayo.board.entity;

import com.busTajo.busTayo.common.entity.BaseEntity;
import com.busTajo.busTayo.users.entity.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

// 댓글 테이블
@Entity
@Getter
@Setter
@Table(name = "comments")
public class Comments extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    // Board 객체 자체를 포함
    // EAGER타입으로 fetch하면 실행할 때 left join으로 맵핑된 테이블 정보까지 한 번에 가져옴
    // ddl-auto를 create로 설정 후 아래처럼 맵핑해주면 자동으로 FK 설정도 해줌
    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "board_id", nullable = false) // id 컬럼을 Board의 @Id가 붙은 PK와 연결(FK)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Board board; // 댓글 작성한 게시글 ID(FK)

    @ManyToOne(fetch = FetchType.LAZY) // default : EAGER, 왠만하면 그냥 LAZY 사용하면 됨
    @JoinColumn(name = "user_id", nullable = false) // user_id 컬럼을 Users의 @Id가 붙은 PK와 연결(FK)
    private Users user; // 댓글 작성자

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 댓글 내용
}