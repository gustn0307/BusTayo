package com.busTajo.busTayo.users.controller;

import com.busTajo.busTayo.users.dto.PasswordUpdateRequest;
import com.busTajo.busTayo.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/user")
    public String user_in() {
        return "USER OK";
    }

    @GetMapping("/my-info")
    public String myInfo() {
        String email = SecurityContextHolder
                .getContext().getAuthentication().getName();
        return "로그인한 사용자의 이메일은: " + email + "입니다.";
    }

    @DeleteMapping("/delete-account")
    public org.springframework.http.ResponseEntity<String> deleteAccount() {
        String email = SecurityContextHolder
                .getContext().getAuthentication().getName();
        userService.deleteUser(email);
        return org.springframework.http.ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.updatePassword(email, request);
        return ResponseEntity.ok("비밀번호 변경이 완료되었습니다.");
    }

}
