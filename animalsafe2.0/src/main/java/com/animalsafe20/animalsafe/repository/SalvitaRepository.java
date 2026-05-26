package com.animalsafe20.animalsafe.repository;

import com.animalsafe20.animalsafe.model.Salvita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de salvitas (animales)
 */
@Repository
public interface SalvitaRepository extends JpaRepository<Salvita, Long> {

    /**
     * Busca una salvita por su reporte asociado
     * @param reportId el ID del reporte
     * @return Optional con la salvita si existe
     */
    Optional<Salvita> findByReportId(Long reportId);
}
