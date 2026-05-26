package com.animalsafe20.animalsafe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad que representa un animal reportado
 * Almacena información del tipo y condición del animal
 */
@Entity
@Table(name = "salvitas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salvita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El tipo de animal es obligatorio")
    @Size(min = 2, max = 50, message = "El tipo debe tener entre 2 y 50 caracteres")
    @Column(name = "animal_type", nullable = false)
    private String animalType; // dog, cat, bird, rabbit, etc

    @NotBlank(message = "La condición del animal es obligatoria")
    @Size(min = 2, max = 100, message = "La condición debe tener entre 2 y 100 caracteres")
    @Column(name = "animal_condition", nullable = false)
    private String animalCondition; // injured, hungry, lost, abandoned, etc

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Column(length = 500)
    private String description; // Descripción adicional del animal

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
