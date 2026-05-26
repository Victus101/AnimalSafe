package com.animalsafe20.animalsafe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad que representa metadatos de una imagen adjunta a un reporte
 * Almacena la URL de la imagen (almacenada en servidor externo o S3)
 */
@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La URL de la imagen es obligatoria")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Column(length = 255)
    private String fileName;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;
}
