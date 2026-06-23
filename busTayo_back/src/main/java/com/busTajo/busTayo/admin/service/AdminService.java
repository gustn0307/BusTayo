package com.busTajo.busTayo.admin.service;

import com.busTajo.busTayo.admin.dto.AdminStatisticsDto;
import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.UserStatus;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AdminService {


    private final UserRepository userRepository;



    @Transactional
    public void changeStatus(Long id, UserStatus status) {


        Users user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("회원 없음")
                );


        user.setStatus(status);
    }



    @Transactional
    public void changeRole(Long id, RoleType role) {

        Users user = userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("회원 없음")
                );


        user.setRole(role);
    }





    // 통계 조회
    public AdminStatisticsDto getStatistics() {


        long totalUsers =
                userRepository.count();


        long adminUsers =
                userRepository.countByRole(
                        RoleType.ROLE_ADMIN
                );


        long normalUsers =
                userRepository.countByRole(
                        RoleType.ROLE_USER
                );


        long blockedUsers =
                userRepository.countByStatus(
                        UserStatus.PENDING
                );



        return new AdminStatisticsDto(
                totalUsers,
                adminUsers,
                normalUsers,
                blockedUsers
        );

    }


}