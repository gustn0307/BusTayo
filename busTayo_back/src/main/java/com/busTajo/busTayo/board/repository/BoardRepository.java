package com.busTajo.busTayo.board.repository;

import com.busTajo.busTayo.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByTitleContainingAndIsDeletedFalse(String keyword, Pageable pageable);
    @Query("SELECT b FROM Board b WHERE SUBSTRING(b.user.userId, 1, LOCATE('@', b.user.userId) - 1) LIKE %:keyword%")
    Page<Board> findByUserIdBeforeAtAndIsDeletedFalse(@Param("keyword") String keyword, Pageable pageable);
    @Query("SELECT b FROM Board b WHERE b.user.userId = :keyword AND b.isDeleted = false")
    Page<Board> findByUserIdAndIsDeletedFalse(@Param("keyword") String keyword, Pageable pageable);
    Page<Board> findByTitleContainingOrUserUserIdContainingAndIsDeletedFalse(String title, String userId, Pageable pageable);
    Page<Board> findByIsDeletedFalse(Pageable pageable);
}
