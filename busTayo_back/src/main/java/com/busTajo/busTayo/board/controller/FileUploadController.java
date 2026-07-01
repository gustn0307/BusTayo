package com.busTajo.busTayo.board.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.UUID;

@RestController
public class FileUploadController {

    private final String uploadDir = "uploads"; // 프로젝트 루트 기준 저장 폴더

    @PostMapping("/api/editor/upload")
    public void uploadPhoto(
            @RequestParam("Filedata") MultipartFile file,
            @RequestParam(value = "callback_func", required = false) String callbackFunc,
            HttpServletResponse response
    ) throws IOException {

        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase();

        String url;
        // 확장자 검증
        if (!ext.matches("jpg|jpeg|png|bmp|gif")) {
            url = "http://localhost:3000/smarteditor2-2.8.2.3/sample/photo_uploader/callback.html?callback_func=" + callbackFunc
                    + "&errstr=" + URLEncoder.encode(originalName, StandardCharsets.UTF_8);
        } else {
            // 저장 폴더 없으면 생성
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // 파일명 중복 방지 (uuid 붙이기)
            String storedName = UUID.randomUUID() + "_" + originalName;
            Path savePath = Paths.get(uploadDir, storedName);
            file.transferTo(savePath);

            String encodedName = URLEncoder.encode(originalName, StandardCharsets.UTF_8);
            String imageUrl = "http://localhost:8080/uploads/" + storedName;

            url = "http://localhost:3000/smarteditor2-2.8.2.3/sample/photo_uploader/callback.html?callback_func=" + callbackFunc
                    + "&bNewLine=true"
                    + "&sFileName=" + encodedName
                    + "&sFileURL=" + imageUrl;
        }

        response.sendRedirect(url);
    }
}