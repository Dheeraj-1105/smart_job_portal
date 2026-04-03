package com.jobportal.service;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class ResumeParsingService {
    public String extractTextFromResume(MultipartFile file) {
        try (InputStream stream = file.getInputStream()) {
            Parser parser = new AutoDetectParser();
            BodyContentHandler handler = new BodyContentHandler(-1); // -1 limits size to unlimited
            Metadata metadata = new Metadata();
            ParseContext context = new ParseContext();

            parser.parse(stream, handler, metadata, context);
            return handler.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse resume file. Ensure it is a valid PDF or DOCX.", e);
        }
    }
}
