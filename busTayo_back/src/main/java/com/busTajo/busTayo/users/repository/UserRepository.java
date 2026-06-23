package com.busTajo.busTayo.users.repository;

import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.UserStatus;
import com.busTajo.busTayo.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {

    // userEmail을 받아 DB에서 회원이 존재하는지 여부를 반환하는 메서드
    Boolean existsByUserId(String userEmail);

    // userEmail을 받아 DB에서 회원을 조회하는 메서드
    Users findByUserId(String userEmail);

    //이메일(userId)을 받아 회원을 삭제(탈퇴)하는 메서드
    void deleteByUserId(String userId);

    long countByRole(RoleType role);

    long countByStatus(UserStatus status);
}
