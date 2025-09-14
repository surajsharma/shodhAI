package com.shodhai.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String code;

    private String language; // e.g., "JAVA"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    @JsonIgnore
    private Problem problem;

    private String status; // "PENDING", "RUNNING", "ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED",
                           // "MEMORY_LIMIT_EXCEEDED", "COMPILATION_ERROR"
    private Integer score;
    private LocalDateTime submittedAt;

    // Constructors
    public Submission() {
    }

    public Submission(String code, String language, User user, Problem problem) {
        this.code = code;
        this.language = language;
        this.user = user;
        this.problem = problem;
        this.status = "PENDING";
        this.submittedAt = LocalDateTime.now();
        this.score = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}