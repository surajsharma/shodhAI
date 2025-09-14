package com.shodhai.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shodhai.backend.model.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
}