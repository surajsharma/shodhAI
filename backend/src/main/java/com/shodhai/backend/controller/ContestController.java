package com.shodhai.backend.controller;

import com.shodhai.backend.model.Contest;
import com.shodhai.backend.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping("/{contestId}")
    public Contest getContest(@PathVariable Long contestId) {
        return contestService.getContestById(contestId);
    }
}