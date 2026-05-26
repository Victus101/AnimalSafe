package com.animalsafe20.animalsafe.repository;

import com.animalsafe20.animalsafe.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para operaciones CRUD de imágenes
 */
@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    /**
     * Obtiene todas las imágenes de un reporte
     * @param reportId el ID del reporte
     * @return lista de imágenes del reporte
     */
    List<Image> findByReportId(Long reportId);
}
