package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.dto.CommentsResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.entity.Comments;
import com.busTajo.busTayo.board.repository.BoardRepository;
import com.busTajo.busTayo.board.dto.PageResponseDto;
import com.busTajo.busTayo.board.repository.CommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PageService {
    private final BoardRepository boardRepository;
    private final CommentsRepository commentsRepository;

    public PageResponseDto<BoardResponseDto> boardFindAll(Pageable pageable) {
        Page<Board> board = boardRepository.findAll(pageable);
        Page<BoardResponseDto> boardResponseDto = board.map(BoardResponseDto::from);
        return new PageResponseDto<>(boardResponseDto);
    }

    public PageResponseDto<BoardResponseDto> searchBoards(String type, String keyword, Pageable pageable) {
        Page<Board> board;
        if (type.equals("title")) {
            board = boardRepository.findByTitleContaining(keyword, pageable);
        } else if (type.equals("author")) {
            board = boardRepository.findByUserIdBeforeAt(keyword, pageable);
        } else if (type.equals("my")) {
            board = boardRepository.findByUserId(keyword, pageable);
        } else {
            board = boardRepository.findByTitleContainingOrUserUserIdContaining(keyword, keyword, pageable);
        }
        return new PageResponseDto<>(board.map(BoardResponseDto::from));
    }

    public PageResponseDto<CommentsResponseDto> commentsFindAll(Long boardId, Pageable pageable) {
        Page<Comments> comments = commentsRepository.findByBoardId(boardId, pageable);
        Page<CommentsResponseDto> commentsResponseDto = comments.map(comment -> new CommentsResponseDto(comment));
        return new PageResponseDto<>(commentsResponseDto);
    }
}
