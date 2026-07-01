package com.busTajo.busTayo.notice.dto;

import com.busTajo.busTayo.admin.entity.Notice;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDto {
    private Long noticeId;
    private String noticeTitle;
    private String noticeContent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NoticeDto(Long id, String title, String content) {
        this.noticeId = id;
        this.noticeTitle = title;
        this.noticeContent = content;
    }

    public static Notice toEntity(NoticeDto noticeDto) {
        Notice notice = new Notice();
        notice.setId(noticeDto.getNoticeId());
        notice.setTitle(noticeDto.getNoticeTitle());
        notice.setContent(noticeDto.getNoticeContent());
        noticeDto.setCreatedAt(noticeDto.getCreatedAt());
        noticeDto.setUpdatedAt(noticeDto.getUpdatedAt());
        return notice;
    }

    public static NoticeDto toNoticeDto(Notice notice) {
        return new NoticeDto(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getCreatedAt(),
                notice.getUpdatedAt()
        );
    }
}
