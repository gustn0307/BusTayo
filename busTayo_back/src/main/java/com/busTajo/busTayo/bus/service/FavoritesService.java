package com.busTajo.busTayo.bus.service;

import com.busTajo.busTayo.bus.dto.FavoritesGroupDto;
import com.busTajo.busTayo.bus.dto.FavoritesItemDto;
import com.busTajo.busTayo.bus.dto.FavoritesResponse;
import com.busTajo.busTayo.bus.entity.FavoritesGroup;
import com.busTajo.busTayo.bus.entity.FavoritesNavigating;
import com.busTajo.busTayo.bus.repository.FavoritesGroupRepository;
import com.busTajo.busTayo.bus.repository.FavoritesNavigatingRepository;
import com.busTajo.busTayo.users.entity.Users;
import com.busTajo.busTayo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoritesService {


    private final FavoritesGroupRepository favoritesGroupRepository;
    private final UserRepository userRepository;
    private final FavoritesNavigatingRepository favoritesNavigatingRepository;



    public FavoritesResponse getFavorites(Users user){

        Users findUser =
                userRepository.findByUserId(user.getUserId());


        FavoritesResponse response =
                new FavoritesResponse();


        // 그룹 없는 즐겨찾기
        List<FavoritesItemDto> ungrouped =
                new ArrayList<>();


        // 그룹별 저장용
        Map<Long, FavoritesGroupDto> groupMap =
                new LinkedHashMap<>();



        // ======================
        // 그룹 조회
        // ======================

        List<FavoritesGroup> groups =
                favoritesGroupRepository
                        .findByUserId(findUser.getId());


        for(FavoritesGroup group : groups){


            FavoritesGroupDto dto =
                    new FavoritesGroupDto();


            dto.setId(group.getId());

            dto.setName(group.getName());

            dto.setItems(new ArrayList<>());


            groupMap.put(
                    group.getId(),
                    dto
            );
        }




        // ======================
        // 길찾기 즐겨찾기 조회
        // ======================

        List<FavoritesNavigating> navigating =
                favoritesNavigatingRepository
                        .findByUserId(findUser.getId());



        for(FavoritesNavigating nav : navigating){


            FavoritesItemDto item =
                    new FavoritesItemDto();


            item.setId(nav.getId());


            // 그룹 id
            if(nav.getGroup()!=null){

                item.setGroupId(
                        nav.getGroup().getId()
                );
            }


            item.setName(
                    nav.getName()
            );


            item.setDescription(
                    nav.getDescription()
            );


            item.setStart(
                    nav.getStart()
            );

            item.setStartX(
                    nav.getStartX()
            );

            item.setStartY(
                    nav.getStartY()
            );


            item.setEnd(
                    nav.getEnd()
            );

            item.setEndX(
                    nav.getEndX()
            );

            item.setEndY(
                    nav.getEndY()
            );



            // 그룹 없음
            if(nav.getGroup()==null){


                ungrouped.add(item);



            }else{


                FavoritesGroupDto groupDto =
                        groupMap.get(
                                nav.getGroup().getId()
                        );


                // 혹시 그룹 삭제된 데이터 방어
                if(groupDto != null){

                    groupDto
                            .getItems()
                            .add(item);


                }else{


                    ungrouped.add(item);

                }
            }
        }




        response.setUngrouped(
                ungrouped
        );


        response.setGroups(
                new ArrayList<>(groupMap.values())
        );



        return response;
    }

    @Transactional
    public void saveNavigating(
            FavoritesItemDto dto,
            Users user
    ){

        Users findUser =
                userRepository.findByUserId(user.getUserId());


        FavoritesNavigating nav =
                new FavoritesNavigating();


        nav.setUser(findUser);



        // ⭐ 그룹 무조건 연결
        FavoritesGroup group;


        if(dto.getGroupId() != null){

            group =
                    favoritesGroupRepository
                            .findById(dto.getGroupId())
                            .orElseThrow();


        }else{


            group =
                    favoritesGroupRepository
                            .findByUserIdAndName(
                                    findUser.getId(),
                                    "미분류"
                            );


            if(group == null){

                group = new FavoritesGroup();

                group.setName("미분류");
                group.setUser(findUser);

                group =
                        favoritesGroupRepository.save(group);
            }

        }


        nav.setGroup(group);



        nav.setName(dto.getName());

        nav.setDescription(dto.getDescription());


        nav.setStart(dto.getStart());
        nav.setStartX(dto.getStartX());
        nav.setStartY(dto.getStartY());


        nav.setEnd(dto.getEnd());
        nav.setEndX(dto.getEndX());
        nav.setEndY(dto.getEndY());



        System.out.println(
                "저장 직전 : "
                        + nav.getName()
                        + " / 그룹="
                        + nav.getGroup().getId()
        );


        favoritesNavigatingRepository.save(nav);
    }

    @Transactional
    public void createGroup(String name, Users user){

        Users findUser =
                userRepository.findByUserId(user.getUserId());

        FavoritesGroup group = new FavoritesGroup();

        group.setName(name);
        group.setUser(findUser);

        favoritesGroupRepository.save(group);
    }

    @Transactional
    public void deleteGroup(Long groupId, Users user) {

        Users findUser =
                userRepository.findByUserId(user.getUserId());

        FavoritesGroup group =
                favoritesGroupRepository.findById(groupId)
                        .orElseThrow();

        // 본인 그룹인지 확인
        if (!group.getUser().getId().equals(findUser.getId())) {
            throw new RuntimeException("삭제 권한 없음");
        }

        // 미분류 그룹은 삭제 불가
        if ("미분류".equals(group.getName())) {
            throw new RuntimeException("미분류 그룹은 삭제할 수 없습니다.");
        }

        // 회원가입 시 생성된 미분류 그룹 조회
        FavoritesGroup ungrouped =
                favoritesGroupRepository.findByUserIdAndName(
                        findUser.getId(),
                        "미분류"
                );

        if (ungrouped == null) {
            throw new RuntimeException("미분류 그룹이 존재하지 않습니다.");
        }

        // 해당 그룹의 즐겨찾기를 모두 미분류로 이동
        List<FavoritesNavigating> navList =
                favoritesNavigatingRepository.findByGroupId(groupId);

        for (FavoritesNavigating nav : navList) {
            nav.setGroup(ungrouped);
        }

        // 그룹 삭제
        favoritesGroupRepository.delete(group);
    }

    // =============================================
    // [추가] 즐겨찾기 그룹 이동
    // - navId: 이동할 즐겨찾기 ID
    // - groupId: 이동할 대상 그룹 ID (null이면 미분류로 이동)
    // - user: 요청한 유저
    // =============================================
    @Transactional
    public void moveGroup(
            Long navId,
            Long groupId,
            Users user
    ){
        // 유저 조회
        Users findUser =
                userRepository.findByUserId(user.getUserId());

        // 즐겨찾기 조회
        FavoritesNavigating nav =
                favoritesNavigatingRepository
                        .findById(navId)
                        .orElseThrow();

        // 본인 데이터인지 확인
        if(!nav.getUser().getId().equals(findUser.getId())){
            throw new RuntimeException("권한 없음");
        }

        if(groupId == null){
            // groupId가 null이면 → "미분류" 그룹으로 이동
            // "미분류" 그룹이 없으면 자동으로 생성
            FavoritesGroup ungrouped =
                    favoritesGroupRepository
                            .findByUserIdAndName(findUser.getId(), "미분류");

            if(ungrouped == null){
                ungrouped = new FavoritesGroup();
                ungrouped.setName("미분류");
                ungrouped.setUser(findUser);
                ungrouped = favoritesGroupRepository.save(ungrouped);
            }

            nav.setGroup(ungrouped);

        } else {
            // 대상 그룹 조회 후 이동
            FavoritesGroup group =
                    favoritesGroupRepository
                            .findById(groupId)
                            .orElseThrow();

            nav.setGroup(group);
        }

        // @Transactional에 의해 dirty checking으로 자동 UPDATE
    }

    @Transactional
    public void deleteNavigating(
            Long id,
            Users user
    ){

        Users findUser =
                userRepository.findByUserId(
                        user.getUserId()
                );


        FavoritesNavigating nav =
                favoritesNavigatingRepository
                        .findById(id)
                        .orElseThrow();


        if(!nav.getUser()
                .getId()
                .equals(findUser.getId())){

            throw new RuntimeException("권한 없음");
        }


        favoritesNavigatingRepository.delete(nav);
    }


}
