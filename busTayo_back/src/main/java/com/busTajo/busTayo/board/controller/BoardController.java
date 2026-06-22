package com.busTajo.busTayo.board.controller;

import com.busTajo.busTayo.board.dto.BoardRequestDto;
import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@Controller
//@ResponseBody
@RestController
@RequiredArgsConstructor
@RequestMapping("api/board")
public class BoardController {
    private final BoardService boardService;

    // 게시글 전체 조회
    @GetMapping()
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public BoardResponseDto getBoardById(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }

    // 게시글 작성
    @PostMapping()
    public String writeBoard(@RequestBody BoardRequestDto boardRequestDto){
        boardService.writeBoard(boardRequestDto);
        return "게시글이 작성되었습니다.";
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDto> editBoard(@PathVariable Long id,
                                                      @RequestBody BoardRequestDto boardRequestDto) {
        BoardRequestDto editResult = boardService.editBoard(id, boardRequestDto);
        if (editResult == null) {
            return ResponseEntity.notFound().build();
        }
//        return ResponseEntity.ok(editResult);
    }

    // 게시글 삭제
//    @DeleteMapping("/{id}")
}

