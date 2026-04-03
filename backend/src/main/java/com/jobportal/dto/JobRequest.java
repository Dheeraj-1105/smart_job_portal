package com.jobportal.dto;

import lombok.Data;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String requiredSkills;
    private String experienceRequired;
}
