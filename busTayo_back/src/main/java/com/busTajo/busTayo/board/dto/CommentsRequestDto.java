package com.busTajo.busTayo.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentsRequestDto {
    private Long boardId;
    private String content;
    private Long parentId; // 대댓글이면 부모 댓글 id, 일반 댓글이면 null
}
