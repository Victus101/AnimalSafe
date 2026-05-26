package com.animalsafe20.animalsafe.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitud de crear un reporte
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReportRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 150, message = "El título debe tener entre 3 y 150 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres")
    private String description;

    @NotNull(message = "La latitud es obligatoria")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "La longitud es obligatoria")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;

    @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
    private String address;

    @NotBlank(message = "El tipo de animal es obligatorio")
    private String animalType;

    @NotBlank(message = "La condición del animal es obligatoria")
    private String animalCondition;

    @Size(max = 500, message = "La descripción del animal no puede exceder 500 caracteres")
    private String animalDescription;
}
