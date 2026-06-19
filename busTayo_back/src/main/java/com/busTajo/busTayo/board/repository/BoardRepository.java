package com.busTajo.busTayo.board.repository;

import com.busTajo.busTayo.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
