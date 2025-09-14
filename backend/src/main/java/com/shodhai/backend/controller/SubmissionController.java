package com.shodhai.backend.controller;

import com.shodhai.backend.model.Submission;
import com.shodhai.backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public Submission createSubmission(
            @RequestParam String code,
            @RequestParam String language,
            @RequestParam Long userId,
            @RequestParam Long problemId) {

        return submissionService.createSubmission(code, language, userId, problemId);
    }

    @GetMapping("/{submissionId}")
    public Submission getSubmission(@PathVariable Long submissionId) {
        return submissionService.getSubmissionById(submissionId);
    }
}