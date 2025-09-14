package com.shodhai.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@Order(1) // Run before data initialization
public class DockerInitializer implements CommandLineRunner {
    @Value("${docker.image.name}")
    private String dockerImageName;

    @Value("${docker.build.enabled:true}")
    private boolean dockerBuildEnabled;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🐳 Checking Docker image...");

        if (!dockerBuildEnabled) {
            System.out.println("⚠️ Docker build disabled in production mode");
            return;
        }

        // Check if image exists
        ProcessBuilder checkPb = new ProcessBuilder("docker", "images", "-q", dockerImageName);
        Process checkProcess = checkPb.start();
        String output = new String(checkProcess.getInputStream().readAllBytes()).trim();
        checkProcess.waitFor();

        if (output.isEmpty()) {
            System.out.println("🔨 Building Docker image...");
            buildDockerImage();
        } else {
            System.out.println("✅ Docker image already exists: " + dockerImageName);
        }
    }

    private void buildDockerImage() throws Exception {
        // This won't work in production JAR
        Path dockerfilePath = Paths.get("src/main/resources/docker");
        File dockerfileDir = dockerfilePath.toFile();

        if (!dockerfileDir.exists()) {
            throw new RuntimeException("Dockerfile directory not found: " + dockerfilePath);
        }

        // Build the image
        ProcessBuilder pb = new ProcessBuilder(
                "docker", "build",
                "-t", dockerImageName,
                ".");
        pb.directory(dockerfileDir);
        pb.inheritIO(); // Show build output in console

        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Failed to build Docker image. Exit code: " + exitCode);
        }

        System.out.println("✅ Docker image built successfully: " + dockerImageName);
    }
}