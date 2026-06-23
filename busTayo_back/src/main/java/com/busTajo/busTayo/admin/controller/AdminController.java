package com.busTajo.busTayo.admin.controller;

import com.busTajo.busTayo.admin.dto.AdminStatisticsDto;
import com.busTajo.busTayo.admin.dto.AdminUserDto;
import com.busTajo.busTayo.admin.dto.AdminUserSummaryDto;
import com.busTajo.busTayo.admin.service.AdminService;
import com.busTajo.busTayo.users.entity.RoleType;
import com.busTajo.busTayo.users.entity.UserStatus;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService adminService;

    @GetMapping("/users")
    public List<AdminUserDto> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(AdminUserDto::new)
                .toList();
    }

    @GetMapping("/users/summary")
    public AdminUserSummaryDto getSummary() {

        return new AdminUserSummaryDto(

                userRepository.count(),

                userRepository.countByRole(RoleType.ROLE_ADMIN),

                userRepository.countByRole(RoleType.ROLE_USER)
        );
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(
            @PathVariable Long id
    ) {

        userRepository.deleteById(id);
    }

    @PutMapping("/users/{id}/status")
    public void changeStatus(
            @PathVariable Long id,
            @RequestBody UserStatus status
    ) {
        adminService.changeStatus(id, status);
    }

    @GetMapping("/statistice")
    public AdminStatisticsDto statisticsDto(){
        return adminService.getStatistics();
    }
}