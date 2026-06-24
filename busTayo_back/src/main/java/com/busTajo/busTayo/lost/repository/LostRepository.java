package com.busTajo.busTayo.lost.repository;

import com.busTajo.busTayo.bus.entity.BusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostRepository extends JpaRepository<BusHistory, Long> {
    List<BusHistory> findByUser_UserId(String userId);
}
