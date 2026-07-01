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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CommentsService {
    private final CommentsRepository commentsRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 댓글 조회
    public List<CommentsResponseDto> getAllComments(Long boardId) {
        List<Comments> comments = commentsRepository.findByBoardId(boardId);
        List<CommentsResponseDto> result = new ArrayList<>();
        for (Comments comment : comments){
            result.add(new CommentsResponseDto(comment));
        }
        return result;
    }

    // 댓글 작성
    public void writeComments(Long boardId, CommentsRequestDto commentsRequestDto, String userId){

        Users user = userRepository.findByUserId(userId);
        Board board = boardRepository.findById(boardId).orElse(null);

        Comments comments = new Comments();
        comments.setUser(user);
        comments.setBoard(board);
        comments.setContent(commentsRequestDto.getContent());

        // 대댓글
        if (commentsRequestDto.getParentId() != null) {
            Comments parent = commentsRepository.findById(commentsRequestDto.getParentId()).orElse(null);
            comments.setParent(parent);
        }

        commentsRepository.save(comments);
    }

    // 댓글 수정
    public CommentsResponseDto editComments(Long id, CommentsRequestDto commentsRequestDto, String userId){
        Comments comments = commentsRepository.findById(id).orElse(null);
        if (comments == null){
            return null;
        }
        if (!comments.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인 댓글만 수정할 수 있습니다.");
        }
        comments.setContent(commentsRequestDto.getContent());
        commentsRepository.save(comments);
        return new CommentsResponseDto(comments);
    }

    // 댓글 삭제
    public boolean deleteComments(Long id, String userId) {
        Comments comments = commentsRepository.findById(id).orElse(null);
        if (comments == null) return false;
        if (!comments.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인 댓글만 삭제할 수 있습니다.");
        }
        comments.setDeleted(true);
        commentsRepository.save(comments);
        return true;
    }

    // 대댓글
    public CommentsResponseDto toResponseDtoWithReplies(Comments comment) {
        CommentsResponseDto dto = new CommentsResponseDto(comment); // 1. 기본 변환
        List<Comments> children = commentsRepository.findByParentIdAndIsDeletedFalseOrderByCreatedAtAsc(comment.getId()); // 2. 자식 댓글 DB에서 조회
        List<CommentsResponseDto> replyDtos = new ArrayList<>();
        for (Comments child : children) {
            replyDtos.add(toResponseDtoWithReplies(child)); // 3. 자식도 같은 방식으로 변환 (재귀)
        }
        dto.setReplies(replyDtos); // 4. 완성된 자식 리스트를 부모에 설정
        return dto;
    }
}
