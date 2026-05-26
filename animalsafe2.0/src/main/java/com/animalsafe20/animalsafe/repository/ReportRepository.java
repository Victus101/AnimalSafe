package com.animalsafe20.animalsafe.repository;

import com.animalsafe20.animalsafe.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para operaciones CRUD de reportes
 * Proporciona mÃ©todos de bÃºsqueda y filtrado de reportes
 */
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    /**
     * Obtiene todos los reportes de un usuario especÃ­fico
     * @param userId el ID del usuario
     * @return lista de reportes del usuario
     */
    List<Report> findByUserId(Long userId);

    /**
     * Verifica si un reporte pertenece a un usuario especÃ­fico.
     * @param reportId el ID del reporte
     * @param userId el ID del usuario
     * @return true si el reporte pertenece al usuario
     */
    boolean existsByIdAndUserId(Long reportId, Long userId);

    /**
     * Obtiene reportes por estado
     * @param status el estado del reporte
     * @return lista de reportes con ese estado
     */
    List<Report> findByStatus(Report.ReportStatus status);

    /**
     * Obtiene reportes abiertos cercanos a unas coordenadas (usando query custom)
     * @param latitude latitud del centro de bÃºsqueda
     * @param longitude longitud del centro de bÃºsqueda
     * @param radiusKm radio en kilÃ³metros
     * @return lista de reportes cercanos y abiertos
     */
    @Query(value = "SELECT r FROM Report r WHERE r.status = 'OPEN' " +
            "AND (6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(r.location.latitude)) * " +
            "COS(RADIANS(r.location.longitude) - RADIANS(:longitude)) + " +
            "SIN(RADIANS(:latitude)) * SIN(RADIANS(r.location.latitude)))) <= :radiusKm",
            nativeQuery = false)
    List<Report> findNearbyOpenReports(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radiusKm") Double radiusKm
    );
}
