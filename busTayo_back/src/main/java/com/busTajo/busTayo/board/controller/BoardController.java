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
    public BoardResponseDto getBoardById(@PathVariable("id") Long id) {
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
    public ResponseEntity<BoardResponseDto> editBoard(@PathVariable("id") Long id,
                                                      @RequestBody BoardRequestDto boardRequestDto) {
        BoardResponseDto result = boardService.editBoard(id, boardRequestDto);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable("id") Long id) {
        System.out.println("삭제 요청 들어옴! id: " + id);
        boolean result = boardService.deleteBoard(id);
        System.out.println("삭제 결과: " + result);
        if (!result){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }
}

