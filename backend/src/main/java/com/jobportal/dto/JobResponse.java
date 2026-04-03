package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobResponse {
    private Integer id;
    private String title;
    private String description;
    private String requiredSkills;
    private String experienceRequired;
}
