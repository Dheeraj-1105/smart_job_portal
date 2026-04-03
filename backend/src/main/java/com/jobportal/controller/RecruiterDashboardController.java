package com.jobportal.controller;

import com.jobportal.dto.RankedCandidateResponse;
import com.jobportal.service.RecruiterDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterDashboardController {

    private final RecruiterDashboardService recruiterService;

    @GetMapping("/rank/{jobId}")
    public ResponseEntity<List<RankedCandidateResponse>> getRankedCandidates(@PathVariable Integer jobId) {
        return ResponseEntity.ok(recruiterService.getRankedCandidates(jobId));
    }
}
