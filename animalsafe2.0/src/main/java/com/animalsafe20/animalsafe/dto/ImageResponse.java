package com.animalsafe20.animalsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de imagen
 * Nunca expone la entidad Image directamente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponse {

    private Long id;
    private String url;
    private String fileName;
    private LocalDateTime uploadedAt;
    private Long reportId;
}
