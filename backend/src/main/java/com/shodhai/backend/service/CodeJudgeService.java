package com.shodhai.backend.service;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.shodhai.backend.model.Problem;
import com.shodhai.backend.model.Submission;
import com.shodhai.backend.model.TestCase;
import com.shodhai.backend.util.DockerUtil;

@Service
public class CodeJudgeService {

    @Value("${docker.image.name}")
    private String dockerImageName;

    @Value("${judge.time.limit.seconds}")
    private int timeLimitSeconds;

    @Value("${judge.memory.limit.mb}")
    private int memoryLimitMB;

    public void judgeSubmission(Submission submission, Problem problem) {
        submission.setStatus("RUNNING");

        List<TestCase> testCases = problem.getTestCases();
        boolean allPassed = true;

        for (TestCase testCase : testCases) {
            String result = executeCodeInContainer(submission.getCode(), testCase.getInput());

            // Debug logging
            System.out.println("=== JUDGE DEBUG ===");
            System.out.println("Expected: [" + testCase.getExpectedOutput() + "]");
            System.out.println("Got: [" + result + "]");
            System.out.println("Expected (trimmed): [" + testCase.getExpectedOutput().trim() + "]");
            System.out.println("Got (trimmed): [" + result.trim() + "]");
            System.out.println("Match: " + result.trim().equals(testCase.getExpectedOutput().trim()));
            System.out.println("==================");

            if (!result.trim().equals(testCase.getExpectedOutput().trim())) {
                submission.setStatus("WRONG_ANSWER");
                allPassed = false;
                break;
            }
        }

        if (allPassed) {
            submission.setStatus("ACCEPTED");
            submission.setScore(100);
        }
    }

    private String executeCodeInContainer(String code, String input) {
        String containerId = UUID.randomUUID().toString();
        String containerDir = System.getenv("JUDGE_CONTAINER_DIR") + "/job-" + containerId;
        String hostDir = System.getenv("JUDGE_HOST_DIR") + "/job-" + containerId;

        Path containerPath = Path.of(containerDir);
        try {
            Files.createDirectories(containerPath);

            // Smart wrapping logic
            String mainClass;
            if (code.contains("class Main")) {
                // Already has Main class, use as-is
                mainClass = code;
            } else if (code.contains("public static void main")) {
                // Has main method but no class wrapper
                mainClass = "public class Main { " + code + " }";
            } else {
                // Just code statements, wrap in full class + main
                mainClass = """
                        public class Main {
                            public static void main(String[] args) throws Exception {
                                %s
                            }
                        }
                        """.formatted(code);
            }

            Files.writeString(containerPath.resolve("Main.java"), mainClass);

            // Step 1: Compile
            ProcessBuilder compilePb = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "-v", hostDir + ":/app",
                    "-w", "/app",
                    "contest-judge-env:latest",
                    "javac", "Main.java");

            compilePb.redirectErrorStream(true);
            Process compileProc = compilePb.start();
            String compileOut = new String(compileProc.getInputStream().readAllBytes());
            int compileExit = compileProc.waitFor();

            if (compileExit != 0) {
                return "COMPILATION_ERROR: " + compileOut;
            }

            // Step 2: Run
            ProcessBuilder runPb = new ProcessBuilder(
                    "docker", "run", "--rm", "-i",
                    "-v", hostDir + ":/app",
                    "-w", "/app",
                    "contest-judge-env:latest", "java", "Main");

            runPb.redirectErrorStream(true);
            Process runProc = runPb.start();

            try (OutputStreamWriter w = new OutputStreamWriter(runProc.getOutputStream())) {
                w.write(input);
                w.flush();
            }

            String output = new String(runProc.getInputStream().readAllBytes());
            int runExit = runProc.waitFor();

            if (runExit != 0) {
                return "RUNTIME_ERROR: " + output;
            }
            return output.trim();
        } catch (Exception e) {
            return "JUDGE_ERROR: " + e.getMessage();
        } finally {
            // Cleanup
            try {
                if (Files.exists(containerPath)) {
                    DockerUtil.deleteDirectoryRecursively(containerPath.toFile());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}