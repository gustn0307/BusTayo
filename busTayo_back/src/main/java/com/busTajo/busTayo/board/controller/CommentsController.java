package com.busTajo.busTayo.board.controller;

import com.busTajo.busTayo.board.dto.BoardResponseDto;
import com.busTajo.busTayo.board.dto.CommentsRequestDto;
import com.busTajo.busTayo.board.dto.CommentsResponseDto;
import com.busTajo.busTayo.board.dto.PageResponseDto;
import com.busTajo.busTayo.board.entity.Comments;
import com.busTajo.busTayo.board.service.CommentsService;
import com.busTajo.busTayo.board.service.PageService;
import com.busTajo.busTayo.users.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/board/{id}/comments")
public class CommentsController {
    private final CommentsService commentsService;
    private final PageService pageService;

    // 댓글 조회
    @GetMapping()
    public ResponseEntity<PageResponseDto<CommentsResponseDto>> getAllComments(@PathVariable("id") Long id,
                                                                               @RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "5") int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return ResponseEntity.ok(pageService.commentsFindAll(id, pageable));
    }

    // 댓글 작성
    @PostMapping()
    public String writeComments(@PathVariable("id") Long id,
                                @RequestBody CommentsRequestDto commentsRequestDto,
                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        commentsService.writeComments(id, commentsRequestDto, userDetails.getEmail());
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
