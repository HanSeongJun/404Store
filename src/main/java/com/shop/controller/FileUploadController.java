package com.shop.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일명 생성 (중복 방지)
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + fileExtension;

            // 파일 저장
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // 이미지 URL 생성
            String imageUrl = "http://localhost:8080/uploads/" + filename;

            return ResponseEntity.ok(FileUploadResponse.builder()
                    .imageUrl(imageUrl)
                    .filename(filename)
                    .build());

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(FileUploadResponse.builder()
                    .error("파일 업로드에 실패했습니다: " + e.getMessage())
                    .build());
        }
    }

    public static class FileUploadResponse {
        private String imageUrl;
        private String filename;
        private String error;

        public FileUploadResponse() {}

        public FileUploadResponse(String imageUrl, String filename, String error) {
            this.imageUrl = imageUrl;
            this.filename = filename;
            this.error = error;
        }

        public static FileUploadResponseBuilder builder() {
            return new FileUploadResponseBuilder();
        }

        public static class FileUploadResponseBuilder {
            private String imageUrl;
            private String filename;
            private String error;

            public FileUploadResponseBuilder imageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
                return this;
            }

            public FileUploadResponseBuilder filename(String filename) {
                this.filename = filename;
                return this;
            }

            public FileUploadResponseBuilder error(String error) {
                this.error = error;
                return this;
            }

            public FileUploadResponse build() {
                return new FileUploadResponse(imageUrl, filename, error);
            }
        }

        // Getters and Setters
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}
