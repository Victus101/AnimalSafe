package com.animalsafe20.animalsafe.service;

import com.animalsafe20.animalsafe.dto.CreateReportRequest;
import com.animalsafe20.animalsafe.dto.ReportResponse;
import com.animalsafe20.animalsafe.dto.UpdateReportStatusRequest;
import com.animalsafe20.animalsafe.exception.BadRequestException;
import com.animalsafe20.animalsafe.exception.ResourceNotFoundException;
import com.animalsafe20.animalsafe.model.*;
import com.animalsafe20.animalsafe.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para operaciones de reportes
 * Contiene la lógica de negocio relacionada con reportes
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final SalvitaRepository salvitaRepository;
    private final ImageRepository imageRepository;

    /**
     * Obtiene todos los reportes
     * @return lista de reportes
     */
    @Transactional(readOnly = true)
    public List<ReportResponse> getAllReports() {
        log.info("Obteniendo todos los reportes");
        return reportRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un reporte por ID
     * @param id el ID del reporte
     * @return respuesta del reporte
     * @throws ResourceNotFoundException si no existe
     */
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long id) {
        log.info("Obteniendo reporte con ID: {}", id);
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte con ID " + id + " no encontrado"));
        return convertToResponse(report);
    }

    /**
     * Obtiene los reportes de un usuario específico
     * @param userId el ID del usuario
     * @return lista de reportes del usuario
     */
    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByUserId(Long userId) {
        log.info("Obteniendo reportes del usuario con ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Usuario con ID " + userId + " no encontrado");
        }
        return reportRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene reportes por estado
     * @param status el estado
     * @return lista de reportes con ese estado
     */
    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByStatus(Report.ReportStatus status) {
        log.info("Obteniendo reportes con estado: {}", status);
        return reportRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene reportes abiertos cercanos a unas coordenadas
     * @param latitude latitud
     * @param longitude longitud
     * @param radiusKm radio en kilómetros
     * @return lista de reportes cercanos
     */
    @Transactional(readOnly = true)
    public List<ReportResponse> getNearbyOpenReports(Double latitude, Double longitude, Double radiusKm) {
        log.info("Obteniendo reportes cercanos a ({}, {}) en un radio de {} km", latitude, longitude, radiusKm);
        return reportRepository.findNearbyOpenReports(latitude, longitude, radiusKm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo reporte
     * @param request datos del reporte
     * @param userId ID del usuario que crea el reporte
     * @return el reporte creado
     * @throws ResourceNotFoundException si el usuario no existe
     */
    public ReportResponse createReport(CreateReportRequest request, Long userId) {
        log.info("Creando nuevo reporte para el usuario con ID: {}", userId);

        // Obtener usuario
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + userId + " no encontrado"));

        // Crear ubicación
        Location location = Location.builder()
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .build();
        locationRepository.save(location);

        // Crear reporte
        Report report = Report.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Report.ReportStatus.OPEN)
                .user(user)
                .location(location)
                .build();
        Report savedReport = reportRepository.save(report);

        // Crear salvita (animal)
        Salvita salvita = Salvita.builder()
                .animalType(request.getAnimalType())
                .animalCondition(request.getAnimalCondition())
                .description(request.getAnimalDescription())
                .report(savedReport)
                .build();
        salvitaRepository.save(salvita);

        // Actualizar referencia en el reporte
        savedReport.setSalvita(salvita);
        reportRepository.save(savedReport);

        log.info("Reporte creado con ID: {}", savedReport.getId());
        return convertToResponse(savedReport);
    }

    /**
     * Actualiza el estado de un reporte
     * @param id el ID del reporte
     * @param request el nuevo estado
     * @return el reporte actualizado
     * @throws ResourceNotFoundException si no existe
     */
    public ReportResponse updateReportStatus(Long id, UpdateReportStatusRequest request) {
        log.info("Actualizando estado del reporte con ID: {} al estado: {}", id, request.getNewStatus());

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte con ID " + id + " no encontrado"));

        try {
            Report.ReportStatus newStatus = Report.ReportStatus.valueOf(request.getNewStatus().toUpperCase());
            report.setStatus(newStatus);
            Report updatedReport = reportRepository.save(report);
            return convertToResponse(updatedReport);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Estado de reporte invalido: " + request.getNewStatus());
        }
    }

    /**
     * Elimina un reporte
     * @param id el ID del reporte
     * @throws ResourceNotFoundException si no existe
     */
    public void deleteReport(Long id) {
        log.info("Eliminando reporte con ID: {}", id);
        if (!reportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reporte con ID " + id + " no encontrado");
        }
        reportRepository.deleteById(id);
    }

    /**
     * Convierte una entidad Report a ReportResponse
     * @param report la entidad
     * @return el DTO de respuesta
     */
    private ReportResponse convertToResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .status(report.getStatus().toString())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .resolvedAt(report.getResolvedAt())
                .userId(report.getUser().getId())
                .userName(report.getUser().getName())
                .location(report.getLocation() != null ? ReportResponse.LocationDTO.builder()
                        .id(report.getLocation().getId())
                        .latitude(report.getLocation().getLatitude())
                        .longitude(report.getLocation().getLongitude())
                        .address(report.getLocation().getAddress())
                        .build() : null)
                .salvita(report.getSalvita() != null ? ReportResponse.SalvitaDTO.builder()
                        .id(report.getSalvita().getId())
                        .animalType(report.getSalvita().getAnimalType())
                        .animalCondition(report.getSalvita().getAnimalCondition())
                        .description(report.getSalvita().getDescription())
                        .build() : null)
                .images(report.getImages() != null ? report.getImages().stream()
                        .map(img -> ReportResponse.ImageDTO.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .fileName(img.getFileName())
                                .uploadedAt(img.getUploadedAt())
                                .build())
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
