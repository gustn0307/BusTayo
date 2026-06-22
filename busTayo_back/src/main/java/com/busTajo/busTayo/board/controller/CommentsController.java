package com.busTajo.busTayo.board.controller;

import com.busTajo.busTayo.board.dto.CommentsRequestDto;
import com.busTajo.busTayo.board.dto.CommentsResponseDto;
import com.busTajo.busTayo.board.entity.Comments;
import com.busTajo.busTayo.board.service.CommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/board/{id}/comments")
public class CommentsController {
    private final CommentsService commentsService;

    // 댓글 조회
    @GetMapping()
    public List<CommentsResponseDto> getAllComments(@PathVariable("id") Long id) {
        return commentsService.getAllComments(id);
    }

    // 댓글 작성
    @PostMapping()
    public String writeComments(@PathVariable("id") Long id,
                                @RequestBody CommentsRequestDto commentsRequestDto) {
        commentsService.writeComments(id, commentsRequestDto);
        return "댓글이 작성되었습니다.";
    }

    // 댓글 수정
    @PutMapping("/{cid}")
    public ResponseEntity<CommentsResponseDto> editComments(@PathVariable("cid") Long id,
                                                            @RequestBody CommentsRequestDto commentsRequestDto) {
        CommentsResponseDto result = commentsService.editComments(id, commentsRequestDto);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    // 댓글 삭제
    @DeleteMapping("/{cid}")
    public ResponseEntity<String> deleteComments(@PathVariable("cid") Long id) {
        System.out.println("삭제 요청 들어옴! id: " + id);
        boolean result = commentsService.deleteComments(id);
        System.out.println("삭제 결과: " + result);
        if (!result) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }
}
