package com.busTajo.busTayo.board.dto;

import com.busTajo.busTayo.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardResponseDto {
    private Long id;
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    // 게시글 상세 조회
    public static BoardResponseDto toDto(Board board) {
        BoardResponseDto boardResponseDto = new BoardResponseDto();
        boardResponseDto.setId(board.getId());
        boardResponseDto.setUserId(board.getUser().getUserId());
        boardResponseDto.setTitle(board.getTitle());
        boardResponseDto.setContent(board.getContent());
        boardResponseDto.setCreatedAt(board.getCreatedAt());
        return boardResponseDto;
    }

    public static BoardResponseDto from(Board board) {
        return new BoardResponseDto(
                board.getId(),
                board.getUser().getUserId(),
                board.getTitle(),
                board.getContent(),
                board.getCreatedAt()
        );
    }
}
