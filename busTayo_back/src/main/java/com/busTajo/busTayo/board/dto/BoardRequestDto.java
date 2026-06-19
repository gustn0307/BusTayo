package com.busTajo.busTayo.board.dto;

import com.busTajo.busTayo.users.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardRequestDto {
    private String userId;
    private String title;
    private String content;
}
