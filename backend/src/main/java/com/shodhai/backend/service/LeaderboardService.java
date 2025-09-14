package com.shodhai.backend.service;

import com.shodhai.backend.model.Submission;
import com.shodhai.backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Map<String, Object>> getLeaderboardByContestId(Long contestId) {
        List<Submission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getProblem().getContest().getId().equals(contestId))
                .filter(s -> "ACCEPTED".equals(s.getStatus()))
                .collect(Collectors.toList());

        return submissions.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getUser().getUsername(),
                        Collectors.summingInt(Submission::getScore)))
                .entrySet()
                .stream()
                .map(entry -> {
                    new java.util.HashMap<String, Object>() {
                        {
                            put("username", entry.getKey());
                            put("score", entry.getValue());
                        }
                    };
                    return new java.util.HashMap<String, Object>() {
                        {
                            put("username", entry.getKey());
                            put("score", entry.getValue());
                        }
                    };
                })
                .sorted(Comparator.comparing(m -> (Integer) m.get("score"), Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }
}