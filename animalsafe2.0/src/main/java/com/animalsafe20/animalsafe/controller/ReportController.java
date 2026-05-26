package com.animalsafe20.animalsafe.controller;

import com.animalsafe20.animalsafe.dto.CreateReportRequest;
import com.animalsafe20.animalsafe.dto.ReportResponse;
import com.animalsafe20.animalsafe.dto.UpdateReportStatusRequest;
import com.animalsafe20.animalsafe.exception.BadRequestException;
import com.animalsafe20.animalsafe.model.Report;
import com.animalsafe20.animalsafe.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones de reportes
 * Endpoints:
 * POST /api/reports - crear reporte
 * GET /api/reports - obtener todos
 * GET /api/reports/{id} - obtener uno
 * GET /api/reports/user/{userId} - obtener reportes de un usuario
 * GET /api/reports/nearby - obtener reportes cercanos
 * PATCH /api/reports/{id}/status - actualizar estado
 */
@RestController
@RequestMapping("/api/reports")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Endpoints para gestionar reportes de rescate de animales")
public class ReportController {

    private final ReportService reportService;

    /**
     * Obtiene todos los reportes
     * @return lista de reportes
     */
    @GetMapping
    @Operation(summary = "Listar todos los reportes", description = "Obtiene una lista de todos los reportes registrados")
    @ApiResponse(responseCode = "200", description = "Lista de reportes obtenida")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> reports = reportService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    /**
     * Obtiene un reporte especÃ­fico
     * @param id el ID del reporte
     * @return datos del reporte
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener reporte por ID", description = "Obtiene los detalles de un reporte especÃ­fico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reporte encontrado"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse report = reportService.getReportById(id);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    /**
     * Obtiene reportes de un usuario
     * @param userId el ID del usuario
     * @return lista de reportes del usuario
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.details")
    @Operation(summary = "Obtener reportes de un usuario", description = "Obtiene todos los reportes creados por un usuario especÃ­fico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reportes del usuario obtenidos"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<List<ReportResponse>> getReportsByUserId(@PathVariable Long userId) {
        List<ReportResponse> reports = reportService.getReportsByUserId(userId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    /**
     * Obtiene reportes por estado
     * @param status el estado (OPEN, IN_PROGRESS, RESOLVED)
     * @return lista de reportes
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Obtener reportes por estado", description = "Obtiene reportes filtrados por estado (OPEN, IN_PROGRESS, RESOLVED)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reportes obtenidos"),
            @ApiResponse(responseCode = "400", description = "Estado invÃ¡lido")
    })
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(@PathVariable String status) {
        Report.ReportStatus reportStatus = parseReportStatus(status);
        List<ReportResponse> reports = reportService.getReportsByStatus(reportStatus);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    /**
     * Obtiene reportes abiertos cercanos a una ubicaciÃ³n
     * @param latitude latitud del centro
     * @param longitude longitud del centro
     * @param radiusKm radio en kilÃ³metros
     * @return lista de reportes cercanos
     */
    @GetMapping("/nearby")
    @Operation(summary = "Obtener reportes cercanos", description = "Obtiene reportes ABIERTOS en un radio especificado desde las coordenadas dadas")
    @ApiResponse(responseCode = "200", description = "Reportes cercanos obtenidos")
    public ResponseEntity<List<ReportResponse>> getNearbyReports(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radiusKm) {
        List<ReportResponse> reports = reportService.getNearbyOpenReports(latitude, longitude, radiusKm);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    /**
     * Crea un nuevo reporte
     * @param request datos del reporte
     * @param authentication informaciÃ³n del usuario autenticado
     * @return el reporte creado
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Crear nuevo reporte", description = "Crea un nuevo reporte de rescate de animal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reporte creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos invÃ¡lidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        ReportResponse report = reportService.createReport(request, userId);
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    /**
     * Actualiza el estado de un reporte
     * @param id el ID del reporte
     * @param request el nuevo estado
     * @return el reporte actualizado
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('VOLUNTEER') or hasRole('ADMIN')")
    @Operation(summary = "Actualizar estado del reporte", description = "Actualiza el estado de un reporte (solo VOLUNTEER o ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        ReportResponse report = reportService.updateReportStatus(id, request);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    /**
     * Elimina un reporte
     * @param id el ID del reporte
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar reporte", description = "Elimina un reporte (solo ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Reporte eliminado"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos de admin"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Report.ReportStatus parseReportStatus(String status) {
        try {
            return Report.ReportStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Estado de reporte invalido: " + status);
        }
    }
}
