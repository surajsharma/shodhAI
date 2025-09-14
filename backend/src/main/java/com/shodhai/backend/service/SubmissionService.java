package com.shodhai.backend.service;

import com.shodhai.backend.model.Problem;
import com.shodhai.backend.model.Submission;
import com.shodhai.backend.model.User;
import com.shodhai.backend.repository.ProblemRepository;
import com.shodhai.backend.repository.SubmissionRepository;
import com.shodhai.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CodeJudgeService codeJudgeService;

    @Autowired
    private ApplicationContext applicationContext;

    public Submission createSubmission(String code, String language, Long userId, Long problemId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Problem> problemOpt = problemRepository.findById(problemId);

        if (userOpt.isEmpty() || problemOpt.isEmpty()) {
            throw new RuntimeException("User or Problem not found");
        }

        Submission submission = new Submission(code, language, userOpt.get(), problemOpt.get());
        submission = submissionRepository.save(submission);

        // Get proxy instance to ensure @Async works
        SubmissionService proxy = applicationContext.getBean(SubmissionService.class);
        proxy.processSubmissionAsync(submission.getId());

        return submission;
    }

    @Async
    @Transactional // new transaction boundary for async thread
    public void processSubmissionAsync(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Refresh the problem WITH test cases in this new session
        Problem problem = problemRepository.findById(submission.getProblem().getId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // initialize collection
        problem.getTestCases().size();

        try {
            codeJudgeService.judgeSubmission(submission, problem);
            submissionRepository.save(submission);
        } catch (Exception e) {
            submission.setStatus("JUDGE_ERROR");
            submissionRepository.save(submission);
            e.printStackTrace();
        }
    }

    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }
}