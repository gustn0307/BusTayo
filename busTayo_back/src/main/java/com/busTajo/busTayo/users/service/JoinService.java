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


import java.util.UUID;

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

        // 1. 이미 존재하는 유저인지 중복 체크
        Boolean isExist = userRepository.existsByUserId(userEmail);
        if (isExist) {
            System.out.println("[회원가입 실패] 이미 가입된 이메일입니다: " + userEmail);
            return;
        }

        Users data = new Users();
        data.setUserId(userEmail);

        // 💡 [교정] 구글 소셜 회원가입 요청인지 판별하여 비밀번호 세팅
        if ("GOOGLE_OAUTH_USER".equals(password)) {
            // 구글 가입자는 직접 로그인할 일이 없으므로 추측 불가능한 무작위 문자열을 생성하여 암호화 저장
            String randomPassword = UUID.randomUUID().toString();
            data.setPassword(bCryptPasswordEncoder.encode(randomPassword));
            System.out.println("[회원가입 완료] 신규 구글 소셜 회원이 안전하게 등록되었습니다: " + userEmail);
        } else {
            // 일반 회원가입 유저는 사용자가 입력한 비밀번호를 정상 암호화 저장
            data.setPassword(bCryptPasswordEncoder.encode(password));
            System.out.println("[회원가입 완료] 일반 회원이 등록되었습니다: " + userEmail);
        }

        data.setRole(RoleType.ROLE_USER); // 가입 동의가 완료되었으므로 진짜 회원 권한 부여
        data.setStatus(UserStatus.APPROVED);

        Users savedUser = userRepository.save(data);


        // 기본 즐겨찾기 그룹 생성
        FavoritesGroup group = new FavoritesGroup();

        group.setName("미분류");
        group.setUser(savedUser);

        favoritesGroupRepository.save(group);
    }
}
