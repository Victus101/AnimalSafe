package com.animalsafe20.animalsafe.service;

import com.animalsafe20.animalsafe.dto.ImageResponse;
import com.animalsafe20.animalsafe.exception.ResourceNotFoundException;
import com.animalsafe20.animalsafe.model.Image;
import com.animalsafe20.animalsafe.model.Report;
import com.animalsafe20.animalsafe.repository.ImageRepository;
import com.animalsafe20.animalsafe.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para operaciones de imágenes
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ImageService {

    private final ImageRepository imageRepository;
    private final ReportRepository reportRepository;

    /**
     * Obtiene todas las imágenes de un reporte
     * @param reportId el ID del reporte
     * @return lista de imágenes en formato DTO
     */
    @Transactional(readOnly = true)
    public List<ImageResponse> getImagesByReportId(Long reportId) {
        log.info("Obteniendo imágenes del reporte con ID: {}", reportId);
        if (!reportRepository.existsById(reportId)) {
            throw new ResourceNotFoundException("Reporte con ID " + reportId + " no encontrado");
        }
        return imageRepository.findByReportId(reportId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Agrega una nueva imagen a un reporte
     * @param reportId el ID del reporte
     * @param imageUrl la URL de la imagen
     * @param fileName el nombre del archivo
     * @return la imagen guardada en formato DTO
     */
    public ImageResponse addImageToReport(Long reportId, String imageUrl, String fileName) {
        log.info("Agregando imagen al reporte con ID: {}", reportId);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte con ID " + reportId + " no encontrado"));

        Image image = Image.builder()
                .url(imageUrl)
                .fileName(fileName)
                .report(report)
                .build();

        Image savedImage = imageRepository.save(image);
        return convertToResponse(savedImage);
    }

    /**
     * Obtiene una imagen por su ID
     * @param imageId el ID de la imagen
     * @return la imagen en formato DTO
     */
    @Transactional(readOnly = true)
    public ImageResponse getImageById(Long imageId) {
        log.info("Obteniendo imagen con ID: {}", imageId);
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Imagen con ID " + imageId + " no encontrada"));
        return convertToResponse(image);
    }

    /**
     * Elimina una imagen
     * @param imageId el ID de la imagen
     */
    public void deleteImage(Long imageId) {
        log.info("Eliminando imagen con ID: {}", imageId);
        if (!imageRepository.existsById(imageId)) {
            throw new ResourceNotFoundException("Imagen con ID " + imageId + " no encontrada");
        }
        imageRepository.deleteById(imageId);
    }

    /**
     * Convierte una entidad Image a ImageResponse DTO
     * @param image la imagen a convertir
     * @return el DTO
     */
    private ImageResponse convertToResponse(Image image) {
        return ImageResponse.builder()
                .id(image.getId())
                .url(image.getUrl())
                .fileName(image.getFileName())
                .uploadedAt(image.getUploadedAt())
                .reportId(image.getReport().getId())
                .build();
    }
}
