package com.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiExtractionService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String extractCandidateData(String rawText) {

        System.out.println("Calling Gemini API...");

        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("WARNING: GEMINI API KEY NOT SET. RETURNING MOCK DATA.");

            return """
            {
              "skills": "Java, Spring Boot, React",
              "experience": "3 years Software Engineer",
              "education": "B.Tech Computer Science"
            }
            """;
        }

        // ✅ Use working model from your list
        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        rawText = rawText.substring(0, Math.min(rawText.length(), 3000));

        String prompt = """
                You are an AI resume parser.

                Extract structured data from this resume.

                Return STRICT JSON in this format:

                {
                  "skills": "",
                  "experience": "",
                  "education": ""
                }

                Resume:
                """ + rawText;

        // ✅ Gemini request format
        Map<String, Object> requestBody = new HashMap<>();

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

        try {

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            Map body = response.getBody();

            if (body != null && body.containsKey("candidates")) {

                List candidates = (List) body.get("candidates");

                if (!candidates.isEmpty()) {

                    Map candidate = (Map) candidates.get(0);
                    Map contentObj = (Map) candidate.get("content");
                    List parts = (List) contentObj.get("parts");

                    if (!parts.isEmpty()) {

                        String text = (String) ((Map) parts.get(0)).get("text");

                        // Remove markdown if present
                        if (text.startsWith("```json")) {
                            text = text.substring(7, text.length() - 3);
                        } else if (text.startsWith("```")) {
                            text = text.substring(3, text.length() - 3);
                        }

                        return text.trim();
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("LLM extraction failed: " + e.getMessage());
        }

        return """
        {
          "skills": "Error parsing",
          "experience": "",
          "education": ""
        }
        """;
    }
}