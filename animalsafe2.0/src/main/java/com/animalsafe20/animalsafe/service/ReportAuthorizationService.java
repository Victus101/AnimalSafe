package com.animalsafe20.animalsafe.service;

import com.animalsafe20.animalsafe.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Servicio de apoyo para validaciones de autorizaciÃ³n sobre reportes.
 */
@Service("reportAuthorizationService")
@RequiredArgsConstructor
public class ReportAuthorizationService {

    private final ReportRepository reportRepository;

    /**
     * Verifica si el usuario autenticado es propietario del reporte.
     * @param reportId el ID del reporte
     * @param authenticationDetails el contenido de authentication.details
     * @return true si el usuario autenticado es dueÃ±o del reporte
     */
    public boolean isOwner(Long reportId, Object authenticationDetails) {
        if (reportId == null || authenticationDetails == null) {
            return false;
        }

        Long userId = extractUserId(authenticationDetails);
        return userId != null && reportRepository.existsByIdAndUserId(reportId, userId);
    }

    private Long extractUserId(Object authenticationDetails) {
        if (authenticationDetails instanceof Long userId) {
            return userId;
        }

        if (authenticationDetails instanceof Number number) {
            return number.longValue();
        }

        try {
            return Long.valueOf(authenticationDetails.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
