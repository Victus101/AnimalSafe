package com.animalsafe20.animalsafe.repository;

import com.animalsafe20.animalsafe.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para operaciones CRUD de ubicaciones
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
