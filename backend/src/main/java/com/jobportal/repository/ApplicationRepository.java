package com.jobportal.repository;

import com.jobportal.entity.Application;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByJob(Job job);

    List<Application> findByJobOrderByScoreDesc(Job job);

    List<Application> findByCandidate(Candidate candidate);

    Optional<Application> findByCandidateAndJob(Candidate candidate, Job job);
}
