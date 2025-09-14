package com.shodhai.backend.service;

import com.shodhai.backend.model.Contest;
import com.shodhai.backend.repository.ContestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContestService {

    @Autowired
    private ContestRepository contestRepository;

    public Contest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
    }

    public List<Contest> getAllContests() {
        return contestRepository.findAll();
    }
}