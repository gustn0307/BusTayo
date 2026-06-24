package com.busTajo.busTayo.users.service;

import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import com.busTajo.busTayo.users.dto.PasswordUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void deleteUser(String userId) {
        userRepository.deleteByUserId(userId);
    }

    @Transactional
    public void updatePassword(String userId, com.busTajo.busTayo.users.dto.PasswordUpdateRequest request) {
        Users user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        if (!bCryptPasswordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }
        String encryptedPassword = bCryptPasswordEncoder.encode(request.getNewPassword());

        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }
}

