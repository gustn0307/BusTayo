package com.busTajo.busTayo.board.dto;

import com.busTajo.busTayo.board.entity.Comments;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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
    private Long parentId; // 대댓글이면 부모 댓글 id, 일반 댓글이면 null
    private List<CommentsResponseDto> replies;

    public CommentsResponseDto(Comments comments) {
        this.id = comments.getId();
        this.boardId = comments.getBoard().getId();
        this.userId = comments.getUser().getUserId();
        this.content = comments.getContent();
        this.createdAt = comments.getCreatedAt();
        this.parentId = comments.getParent() != null ? comments.getParent().getId() : null;
    }
}
