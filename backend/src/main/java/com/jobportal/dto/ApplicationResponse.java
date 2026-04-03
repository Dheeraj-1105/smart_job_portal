package com.jobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationResponse {
    private Integer id;
    private Integer candidateId;
    private Integer jobId;
    private Double score;
    private Integer ranking;
}
