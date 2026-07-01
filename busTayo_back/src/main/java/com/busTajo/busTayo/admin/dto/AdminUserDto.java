package com.busTajo.busTayo.admin.dto;

import com.busTajo.busTayo.users.entity.Users;
import lombok.Getter;

@Getter
public class AdminUserDto {

    private Long id;

    private String userId;

    private String role;

    private String status;


    public AdminUserDto(Users user) {

        this.id = user.getId();

        this.userId = user.getUserId();

        this.role = user.getRole().name();

        this.status = user.getStatus().name();

    }
}