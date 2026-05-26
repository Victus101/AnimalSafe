package com.animalsafe20.animalsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para respuesta de reporte
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private Long userId;
    private String userName;

    private LocationDTO location;
    private SalvitaDTO salvita;
    private List<ImageDTO> images;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationDTO {
        private Long id;
        private Double latitude;
        private Double longitude;
        private String address;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SalvitaDTO {
        private Long id;
        private String animalType;
        private String animalCondition;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImageDTO {
        private Long id;
        private String url;
        private String fileName;
        private LocalDateTime uploadedAt;
    }
}
