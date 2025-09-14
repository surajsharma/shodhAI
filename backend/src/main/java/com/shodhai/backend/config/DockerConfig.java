package com.shodhai.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Configuration
@EnableAsync
public class DockerConfig {

    @Component
    public class DockerCleanup {
        @PreDestroy
        public void cleanup() {
            System.out.println("🧹 Cleaning up Docker containers...");
            try {
                // Remove all judge containers
                ProcessBuilder pb = new ProcessBuilder(
                        "bash", "-c",
                        "docker ps -a --filter 'name=judge-' -q | xargs -r docker rm -f");
                pb.inheritIO();
                pb.start().waitFor();
                System.out.println("✅ Docker cleanup completed");
            } catch (Exception e) {
                System.err.println("⚠️ Docker cleanup failed: " + e.getMessage());
            }
        }
    }
}