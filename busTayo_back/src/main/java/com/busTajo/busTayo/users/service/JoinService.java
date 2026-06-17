package com.busTajo.busTayo.users.service;

import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.users.dto.JoinDTO;
import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.UserStatus;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void join(JoinDTO joinDTO) {
        String userEmail = joinDTO.getEmail();
        String password = joinDTO.getPassword();

        Boolean isExist = userRepository.existsByUserId(userEmail);

        if (isExist) {
            return;
        }

        Users data = new Users();

        data.setUserId(userEmail);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setRole(RoleType.ROLE_USER);
        data.setStatus(UserStatus.APPROVED);

        userRepository.save(data);
    }
}
