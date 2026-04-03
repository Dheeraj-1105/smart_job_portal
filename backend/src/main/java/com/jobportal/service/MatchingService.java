package com.jobportal.service;

import com.jobportal.entity.Application;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final MatchingEngineService matchingEngine;

    public String runMatchingForJob(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        List<Application> applications = applicationRepository.findByJob(job);

        int matchedCandidates = 0;
        for (Application app : applications) {
            Candidate candidate = app.getCandidate();
            if (candidate.getSkills() == null || candidate.getSkills().isEmpty()) {
                app.setScore(0.0);
                continue;
            }

            double score = matchingEngine.calculateMatchingScore(
                    candidate.getSkills(), job.getRequiredSkills(),
                    candidate.getExperience(), job.getExperienceRequired());

            app.setScore(Math.round(score * 100.0 * 100.0) / 100.0);
            matchedCandidates++;
        }

        applications.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        int rank = 1;
        for (Application app : applications) {
            app.setRanking(rank++);
        }

        applicationRepository.saveAll(applications);

        return "Matching completed for " + matchedCandidates + " applicants.";
    }
}
