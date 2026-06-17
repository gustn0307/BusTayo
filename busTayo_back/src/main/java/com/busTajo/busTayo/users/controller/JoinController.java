package com.busTajo.busTayo.users.controller;

import com.busTajo.busTayo.users.dto.JoinDTO;
import com.busTajo.busTayo.users.service.JoinService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@ResponseBody
public class JoinController {

    private final JoinService joinService;


    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public String joinProcess(@RequestBody JoinDTO joinDTO) {
        // 리액트에서 json으로 post 요청할 때는 컨트롤러에 @RequestBody로 처리한다.

        System.out.println(joinDTO.getEmail());
        joinService.join(joinDTO);

        return "ok";
    }
}
