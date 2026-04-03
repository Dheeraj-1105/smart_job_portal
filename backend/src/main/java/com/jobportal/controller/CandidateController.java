package com.jobportal.controller;

import com.jobportal.dto.CandidateProfileResponse;
import com.jobportal.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.service.ApplicationService;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService service;
    private final ApplicationService applicationService;

    @PostMapping("/upload-resume")
    public ResponseEntity<CandidateProfileResponse> uploadResume(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.uploadResume(file));
    }

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> getProfile() {
        return ResponseEntity.ok(service.getProfile());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }
}
