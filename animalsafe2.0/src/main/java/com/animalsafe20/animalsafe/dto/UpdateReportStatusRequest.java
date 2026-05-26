package com.animalsafe20.animalsafe.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar el estado de un reporte
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateReportStatusRequest {

    @NotNull(message = "El nuevo estado es obligatorio")
    private String newStatus; // OPEN, IN_PROGRESS, RESOLVED
}
