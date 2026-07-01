package com.busTajo.busTayo.users.service;

import com.busTajo.busTayo.board.entity.Board;
import com.busTajo.busTayo.bus.repository.FavoritesGroupRepository;
import com.busTajo.busTayo.users.dto.JoinDTO;
import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.UserStatus;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.busTajo.busTayo.bus.entity.FavoritesGroup;


@Service
public class JoinService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FavoritesGroupRepository favoritesGroupRepository;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder,FavoritesGroupRepository favoritesGroupRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.favoritesGroupRepository = favoritesGroupRepository;
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

        Users savedUser = userRepository.save(data);


        // 기본 즐겨찾기 그룹 생성
        FavoritesGroup group = new FavoritesGroup();

        group.setName("기본그룹");
        group.setUser(savedUser);

        favoritesGroupRepository.save(group);
    }
}
