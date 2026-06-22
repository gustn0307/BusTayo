package com.busTajo.busTayo.lost.repository;

import com.busTajo.busTayo.bus.entity.BusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostRepository extends JpaRepository<BusHistory, Long> {
}
