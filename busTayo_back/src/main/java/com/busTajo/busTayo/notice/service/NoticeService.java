package com.busTajo.busTayo.notice.service;

import com.busTajo.busTayo.admin.entity.Notice;
import com.busTajo.busTayo.notice.dto.NoticeDto;
import com.busTajo.busTayo.notice.repository.NoticeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public List<NoticeDto> findAllNotice() {
        return noticeRepository
                .findAllByDeletedFalse()
                .stream()
                .map(x->NoticeDto.toNoticeDto(x))
                .toList();
    }

    public NoticeDto findNoticeById(Long id) {
        Notice notice = noticeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("공지사항 없음"));
        return NoticeDto.toNoticeDto(notice);
    }

    public void insertNotice(NoticeDto dto) {
        Notice notice = new Notice();
        notice.setTitle(dto.getNoticeTitle());
        notice.setContent(dto.getNoticeContent());
        noticeRepository.save(notice);
    }

    @Transactional
    public void updateNotice(NoticeDto noticeDto) {
        Notice notice = noticeRepository.findById(noticeDto.getNoticeId())
                .orElseThrow(() -> new RuntimeException("공지 없음"));
        notice.setTitle(noticeDto.getNoticeTitle());
        notice.setContent(noticeDto.getNoticeContent());
    }

    @Transactional
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("공지 없음"));
        notice.setDeleted(true);
        noticeRepository.save(notice);
    }
}
