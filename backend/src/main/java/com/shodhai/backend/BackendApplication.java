package com.shodhai.backend;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.shodhai.backend.model.Contest;
import com.shodhai.backend.model.Problem;
import com.shodhai.backend.model.TestCase;
import com.shodhai.backend.repository.ContestRepository;
import com.shodhai.backend.repository.ProblemRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {
	@Autowired
	private ContestRepository contestRepository;

	@Autowired
	private ProblemRepository problemRepository;

	@Autowired
	// private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		// Pre-populate DB
		// Create contest
		Contest contest = new Contest(
				"ShodhAI Coding Challenge",
				"Solve algorithmic problems under time pressure!",
				LocalDateTime.now().minusDays(1),
				LocalDateTime.now().plusDays(7));
		contestRepository.save(contest);

		// Create problems
		Problem p1 = new Problem("Hello World", "Print 'Hello World'", contest);
		Problem p2 = new Problem("Sum of Two Numbers", "Read two integers and print their sum", contest);
		problemRepository.saveAll(Arrays.asList(p1, p2));

		// Add test cases
		TestCase tc1_1 = new TestCase("", "Hello World", p1);
		TestCase tc2_1 = new TestCase("3 5", "8", p2);
		TestCase tc2_2 = new TestCase("10 20", "30", p2);

		p1.setTestCases(Arrays.asList(tc1_1));
		p2.setTestCases(Arrays.asList(tc2_1, tc2_2));

		problemRepository.save(p1);
		problemRepository.save(p2);

		System.out.println("✅ Database pre-populated with sample data.");
	}
}
