package com.jobportal.service;

import com.jobportal.dto.RankedCandidateResponse;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public List<RankedCandidateResponse> getRankedCandidates(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        List<Application> apps = applicationRepository.findByJobOrderByScoreDesc(job);

        return apps.stream()
                .map(this::toRankedCandidateResponse)
                .collect(Collectors.toList());
    }

    private RankedCandidateResponse toRankedCandidateResponse(Application app) {
        return RankedCandidateResponse.builder()
                .candidateName(app.getCandidate().getUser().getName())
                .candidateEmail(app.getCandidate().getUser().getEmail())
                .resumeUrl(app.getCandidate().getResumeUrl())
                .matchScore(app.getScore())
                .extractedSkills(app.getCandidate().getSkills())
                .build();
    }
}
