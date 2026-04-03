package com.jobportal.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingEngineService {

    public Double calculateMatchingScore(String candidateSkills, String jobSkills, String candidateExp, String jobExp) {
        double skillScore = calculateCosineSimilarity(candidateSkills, jobSkills);
        double expScore = 0.5; // Mock evaluation of experience strings, could be complex AI analysis

        return (0.7 * skillScore) + (0.3 * expScore);
    }

    private double calculateCosineSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null)
            return 0.0;

        Map<String, Integer> vector1 = getFrequencyMap(text1);
        Map<String, Integer> vector2 = getFrequencyMap(text2);

        Set<String> intersection = new HashSet<>(vector1.keySet());
        intersection.retainAll(vector2.keySet());

        double dotProduct = 0, magnitude1 = 0, magnitude2 = 0;

        for (String item : intersection) {
            dotProduct += vector1.get(item) * vector2.get(item);
        }

        for (String k : vector1.keySet()) {
            magnitude1 += Math.pow(vector1.get(k), 2);
        }

        for (String k : vector2.keySet()) {
            magnitude2 += Math.pow(vector2.get(k), 2);
        }

        if (magnitude1 == 0.0 || magnitude2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    }

    private Map<String, Integer> getFrequencyMap(String text) {
        String[] words = text.toLowerCase().replaceAll("[^a-zA-Z0-9 ]", " ").split("\\s+");
        Map<String, Integer> map = new HashMap<>();
        for (String word : words) {
            if (!word.isBlank()) {
                map.put(word, map.getOrDefault(word, 0) + 1);
            }
        }
        return map;
    }
}
