package com.jobportal.service;

import com.jobportal.dto.CandidateProfileResponse;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.User;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final ResumeParsingService parsingService;
    private final AiExtractionService aiService;

    public CandidateProfileResponse uploadResume(MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        // 1. Parse text from file
        String rawText = parsingService.extractTextFromResume(file);

        // 2. Extract structured fields using LLM
        String jsonResult = aiService.extractCandidateData(rawText);

        String extractedSkills = "";
        String extractedExp = "";
        String extractedEdu = "";

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> data = mapper.readValue(jsonResult, Map.class);
            extractedSkills = data.getOrDefault("skills", "");
            extractedExp = data.getOrDefault("experience", "");
            extractedEdu = data.getOrDefault("education", "");
        } catch (Exception e) {
            System.err.println("JSON parse fallback: " + e.getMessage());
            extractedSkills = jsonResult;
        }

        // 3. Save Candidate Entity
        Candidate candidate = candidateRepository.findByUser(user).orElse(new Candidate());
        candidate.setUser(user);
        candidate.setResumeUrl(file.getOriginalFilename());
        candidate.setSkills(extractedSkills);
        candidate.setExperience(extractedExp);
        candidate.setEducation(extractedEdu);

        candidateRepository.save(candidate);

        return getProfile();
    }

    public CandidateProfileResponse getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return CandidateProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .resumeUrl(candidate.getResumeUrl())
                .skills(candidate.getSkills())
                .experience(candidate.getExperience())
                .education(candidate.getEducation())
                .build();
    }
}
