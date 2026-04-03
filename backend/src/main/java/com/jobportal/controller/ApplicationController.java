package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 1️⃣ Apply for a Job
    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> applyJob(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyJob(request));
    }

    // 2️⃣ Get all applications
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // 3️⃣ Get applications for a specific job (sorted by score)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJob(@PathVariable Integer jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    // 4️⃣ Get applications of a candidate
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidate(@PathVariable Integer candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(candidateId));
    }
}