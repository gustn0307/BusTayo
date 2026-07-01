package com.busTajo.busTayo.notice.controller;

import com.busTajo.busTayo.notice.dto.NoticeDto;
import com.busTajo.busTayo.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@ResponseBody
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeService noticeService;

    @GetMapping("/api/notice")
    public ResponseEntity<List<NoticeDto>> noticeList() {
        return ResponseEntity.ok(noticeService.findAllNotice());
    }

    @GetMapping("/api/notice/{id}")
    public ResponseEntity<NoticeDto> noticeDetail(@PathVariable("id") Long id) {
        return ResponseEntity.ok(noticeService.findNoticeById(id));
    }

    @PostMapping("/api/admin/notice")
    public ResponseEntity<Void> noticeInsert(@RequestBody NoticeDto dto) {
        noticeService.insertNotice(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/notice/{id}")
    public ResponseEntity<Void> noticeUpdate(@PathVariable("id") Long id,
                                             @RequestBody NoticeDto noticeDto) {
        noticeDto.setNoticeId(id);
        noticeService.updateNotice(noticeDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/admin/notice/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
}
