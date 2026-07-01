package com.busTajo.busTayo.bus.controller;

import com.busTajo.busTayo.bus.dto.FavoritesItemDto;
import com.busTajo.busTayo.bus.dto.FavoritesResponse;
import com.busTajo.busTayo.bus.service.FavoritesService;
import com.busTajo.busTayo.users.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoritesNavigatingController {


    private final FavoritesService favoritesService;



    // 즐겨찾기 전체 조회
    @GetMapping
    public FavoritesResponse getFavorites(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        return favoritesService.getFavorites(
                userDetails.getUser()
        );
    }



    // 길찾기 즐겨찾기 등록
    @PostMapping("/navigating")
    public void saveNavigating(
            @RequestBody FavoritesItemDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        System.out.println("즐겨찾기 진입");
        favoritesService.saveNavigating(
                dto,
                userDetails.getUser()
        );
    }

    // 그룹 생성
    @PostMapping("/group")
    public void createGroup(
            @RequestBody Map<String,String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        favoritesService.createGroup(
                body.get("name"),
                userDetails.getUser()
        );
    }

    // 그룹 삭제
    @DeleteMapping("/group/{id}")
    public void deleteGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        favoritesService.deleteGroup(
                id,
                userDetails.getUser()
        );
    }

    // =============================================
    // [추가] 즐겨찾기 그룹 이동
    // - PATCH /api/favorites/navigating/{id}/group
    // - body: { "groupId": 대상그룹ID }
    // - 대상 그룹으로 즐겨찾기를 이동시킴
    // =============================================
    @PatchMapping("/navigating/{id}/group")
    public void moveGroup(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        // body에서 groupId 꺼내기 (null 허용)
        Object groupIdObj = body.get("groupId");
        Long groupId = groupIdObj != null
                ? Long.valueOf(groupIdObj.toString())
                : null;

        favoritesService.moveGroup(
                id,
                groupId,
                userDetails.getUser()
        );
    }

    // 즐겨찾기 삭제
    @DeleteMapping("/navigating/{id}")
    public void deleteNavigating(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){

        favoritesService.deleteNavigating(
                id,
                userDetails.getUser()
        );
    }

}
