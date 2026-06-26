package com.busTajo.busTayo.board.repository;

import com.busTajo.busTayo.board.entity.Comments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    List<Comments> findByBoardId(Long boardId);
    // 페이징 처리
    Page<Comments> findByBoardIdAndIsDeletedFalse(Long boardId, Pageable pageable);
    Page<Comments> findByIsDeletedFalse(Pageable pageable);
    // 대댓글
    Page<Comments> findByBoardIdAndParentIsNullAndIsDeletedFalse(Long boardId, Pageable pageable);
}
