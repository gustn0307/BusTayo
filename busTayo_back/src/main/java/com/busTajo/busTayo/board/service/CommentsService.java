package com.busTajo.busTayo.board.service;

import com.busTajo.busTayo.board.dto.CommentsRequestDto;
import com.busTajo.busTayo.board.dto.CommentsResponseDto;
import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.board.entity.Comments;
import com.busTajo.busTayo.board.repository.BoardRepository;
import com.busTajo.busTayo.board.repository.CommentsRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CommentsService {
    private final CommentsRepository commentsRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 댓글 조회
    public List<Comments> getAllComments(Long boardId) {
        return commentsRepository.findByBoardId(boardId);
    }

    // 댓글 작성
    public void writeComments(Long boardId, CommentsRequestDto commentsRequestDto){
        Users user = userRepository.findByUserId(commentsRequestDto.getUserId());
        Board board = boardRepository.findById(boardId).orElse(null);
        Comments comments = new Comments();
        comments.setUser(user);
        comments.setBoard(board);
        comments.setContent(commentsRequestDto.getContent());

        commentsRepository.save(comments);
    }

    // 댓글 수정
    // public CommentsResponseDto editComments(Long id, CommentsRequestDto commentsRequestDto){}
}
