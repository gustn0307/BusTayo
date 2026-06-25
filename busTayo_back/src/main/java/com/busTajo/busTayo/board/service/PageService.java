package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.repository.BoardRepository;
import com.busTajo.busTayo.board.dto.PageResponseDto;
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

    public PageResponseDto<BoardResponseDto> findAll(Pageable pageable) {
        Page<Board> board = boardRepository.findAll(pageable);
        Page<BoardResponseDto> responseDto = board.map(BoardResponseDto::from);
        return new PageResponseDto<>(responseDto);
    }
}
