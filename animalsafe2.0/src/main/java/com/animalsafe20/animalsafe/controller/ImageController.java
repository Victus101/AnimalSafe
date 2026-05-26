package com.animalsafe20.animalsafe.controller;

import com.animalsafe20.animalsafe.dto.ImageResponse;
import com.animalsafe20.animalsafe.service.ImageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para operaciones de imágenes
 * Endpoints:
 * GET /api/images/report/{reportId} - obtener imágenes de un reporte
 * POST /api/images - crear imagen
 * DELETE /api/images/{id} - eliminar imagen
 */
@RestController
@RequestMapping("/api/images")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "Imágenes", description = "Endpoints para gestionar imágenes de reportes")
public class ImageController {

    private final ImageService imageService;

    /**
     * Obtiene todas las imágenes de un reporte
     * @param reportId el ID del reporte
     * @return lista de imágenes
     */
    @GetMapping("/report/{reportId}")
    @Operation(summary = "Listar imágenes de un reporte", description = "Obtiene todas las imágenes asociadas a un reporte específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imágenes obtenidas"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    public ResponseEntity<List<ImageResponse>> getImagesByReportId(@PathVariable Long reportId) {
        List<ImageResponse> images = imageService.getImagesByReportId(reportId);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    /**
     * Obtiene una imagen específica
     * @param imageId el ID de la imagen
     * @return la imagen
     */
    @GetMapping("/{imageId}")
    @Operation(summary = "Obtener imagen por ID", description = "Obtiene los detalles de una imagen específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imagen encontrada"),
            @ApiResponse(responseCode = "404", description = "Imagen no encontrada")
    })
    public ResponseEntity<ImageResponse> getImageById(@PathVariable Long imageId) {
        ImageResponse image = imageService.getImageById(imageId);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    /**
     * Agrega una imagen a un reporte
     * @param reportId el ID del reporte
     * @param imageUrl la URL de la imagen
     * @param fileName el nombre del archivo
     * @return la imagen creada
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @reportAuthorizationService.isOwner(#reportId, authentication.details)")
    @Operation(summary = "Crear imagen", description = "Agrega una nueva imagen a un reporte")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Imagen creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    public ResponseEntity<ImageResponse> addImageToReport(
            @RequestParam Long reportId,
            @RequestParam String imageUrl,
            @RequestParam(required = false) String fileName) {
        ImageResponse image = imageService.addImageToReport(reportId, imageUrl, fileName);
        return new ResponseEntity<>(image, HttpStatus.CREATED);
    }

    /**
     * Elimina una imagen
     * @param imageId el ID de la imagen
     */
    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar imagen", description = "Elimina una imagen del sistema (solo administrador)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Imagen eliminada exitosamente"),
            @ApiResponse(responseCode = "403", description = "No tienes permisos de administrador"),
            @ApiResponse(responseCode = "404", description = "Imagen no encontrada")
    })
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
