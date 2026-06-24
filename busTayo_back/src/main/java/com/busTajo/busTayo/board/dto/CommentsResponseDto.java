package com.busTajo.busTayo.board.dto;

import com.busTajo.busTayo.board.entity.Comments;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentsResponseDto {
    private Long id;
    private Long boardId;
    private String userId;
    private String content;
    private LocalDateTime createdAt;

    public CommentsResponseDto(Comments comments) {
        this.id = comments.getId();
        this.boardId = comments.getBoard().getId();
        this.userId = comments.getUser().getUserId();
        this.content = comments.getContent();
        this.createdAt = comments.getCreatedAt();
    }
}
