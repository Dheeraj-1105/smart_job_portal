package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RankedCandidateResponse {
    private String candidateName;
    private String candidateEmail;
    private String resumeUrl;
    private Double matchScore;
    private String extractedSkills;
}
