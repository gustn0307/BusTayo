package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.entity.Comments;
import com.busTajo.busTayo.board.repository.CommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CommentsService {
    private final CommentsRepository commentsRepository;

    // 댓글 조회
    public List<Comments> getAllComments(Long boardId) {
        return commentsRepository.findByBoardId(boardId);
    }
}
