package com.jobportal.controller;

import com.jobportal.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @PostMapping("/run/{jobId}")
    public ResponseEntity<String> runMatching(@PathVariable Integer jobId) {
        return ResponseEntity.ok(matchingService.runMatchingForJob(jobId));
    }
}
