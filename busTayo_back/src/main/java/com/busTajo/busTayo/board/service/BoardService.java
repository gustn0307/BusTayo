package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.dto.BoardRequestDto;
import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.repository.BoardRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 게시글 전체 조회
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    // 게시글 상세 조회
    public BoardResponseDto getBoardById(Long id) {
        Board findBoardById = boardRepository.findById(id).orElse(null);
        if (findBoardById == null) {
            return null;
        } else {
            return BoardResponseDto.toDto(findBoardById);
        }
    }

    // 게시글 작성
    public void writeBoard(BoardRequestDto boardRequestDto) {
        Users currentUser = userRepository.findByUserId(boardRequestDto.getUserId());
        Board board = new Board();
        board.setUser(currentUser);
        board.setTitle(boardRequestDto.getTitle());
        board.setContent(boardRequestDto.getContent());
        boardRepository.save(board);
    }

    // 게시글 수정
    public BoardRequestDto editBoard(Long id, BoardRequestDto boardRequestDto) {
        return null;
    }

    // 게시글 삭제
}
