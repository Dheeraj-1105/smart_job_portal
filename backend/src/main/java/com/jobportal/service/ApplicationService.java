package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.entity.Application;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public List<ApplicationResponse> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidate(candidate).stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse applyJob(ApplicationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.findByCandidateAndJob(candidate, job).isPresent()) {
            throw new RuntimeException("Already applied");
        }

        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .score(0.0)
                .ranking(0)
                .build();

        applicationRepository.save(application);

        return toApplicationResponse(application);
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByJob(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJobOrderByScoreDesc(job).stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByCandidate(Integer candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidate(candidate).stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    private ApplicationResponse toApplicationResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidateId(application.getCandidate().getId())
                .jobId(application.getJob().getId())
                .score(application.getScore())
                .ranking(application.getRanking())
                .build();
    }
}
