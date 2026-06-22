package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.dto.BoardRequestDto;
import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.repository.BoardRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 게시글 전체 조회
    public List<BoardResponseDto> getAllBoards() {
        List<Board> board = boardRepository.findAll();
        List<BoardResponseDto> result = new ArrayList<>();
        board.stream()
                .map(BoardResponseDto::toDto)
        .toList();
        return result;
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
        Users user = userRepository.findByUserId(boardRequestDto.getUserId());
        Board board = new Board();
        board.setUser(user);
        board.setTitle(boardRequestDto.getTitle());
        board.setContent(boardRequestDto.getContent());
        if (board.getUser() == null) {
            System.out.println("헉! 유저가 null입니다!");
        }
        boardRepository.save(board);
    }

    // 게시글 수정
    public BoardResponseDto editBoard(Long id, BoardRequestDto boardRequestDto) {
        Board board = boardRepository.findById(id).orElse(null);
        if (board == null){
            return null;
        }
        board.setTitle(boardRequestDto.getContent());
        board.setContent(boardRequestDto.getContent());
        boardRepository.save(board);
        return BoardResponseDto.toDto(board);
    }

    // 게시글 삭제
    public boolean deleteBoard(Long id) {
        Board board = boardRepository.findById(id).orElse(null);
        if (board == null){
            return false;
        }
        boardRepository.delete(board);
        return true;
    }
}
