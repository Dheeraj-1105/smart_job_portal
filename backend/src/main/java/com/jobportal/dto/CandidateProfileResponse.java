package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateProfileResponse {
    private String name;
    private String email;
    private String resumeUrl;
    private String skills;
    private String experience;
    private String education;
}
