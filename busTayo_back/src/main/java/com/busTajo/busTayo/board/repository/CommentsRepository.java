package com.busTajo.busTayo.board.repository;

import com.busTajo.busTayo.board.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    List<Comments> findByBoardId(Long boardId);
}
