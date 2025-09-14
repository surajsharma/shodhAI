package com.shodhai.backend.controller;

import com.shodhai.backend.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contests")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/{contestId}/leaderboard")
    public List<Map<String, Object>> getLeaderboard(@PathVariable Long contestId) {
        return leaderboardService.getLeaderboardByContestId(contestId);
    }
}