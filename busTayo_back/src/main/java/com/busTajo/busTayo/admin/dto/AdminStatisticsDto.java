package com.busTajo.busTayo.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminStatisticsDto {
    private long totalUsers;

    private long adminUsers;

    private long normalUsers;

    private long blockedUsers;
}
