package com.busTajo.busTayo.notice.repository;

import com.busTajo.busTayo.admin.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByDeletedFalse();
    Optional<Notice> findByIdAndDeletedFalse(Long id);
}
