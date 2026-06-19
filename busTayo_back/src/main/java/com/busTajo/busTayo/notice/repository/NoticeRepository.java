package com.busTajo.busTayo.notice.repository;

import com.busTajo.busTayo.admin.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
