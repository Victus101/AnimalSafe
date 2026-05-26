-- ============================================
-- AnimalSafe Database Schema
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS animal_safe;
USE animal_safe;

-- ============================================
-- Tabla: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'VOLUNTEER', 'ADMIN') NOT NULL DEFAULT 'USER',
    user_type ENUM('VOLUNTARIO', 'RESCATISTA', 'ACOGIDA') NOT NULL DEFAULT 'VOLUNTARIO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: locations
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coordinates (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: reports
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: salvitas (Animals)
-- ============================================
CREATE TABLE IF NOT EXISTS salvitas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_type VARCHAR(50) NOT NULL,
    animal_condition VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    report_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    INDEX idx_animal_type (animal_type),
    INDEX idx_animal_condition (animal_condition)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: images
-- ============================================
CREATE TABLE IF NOT EXISTS images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL,
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_id BIGINT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    INDEX idx_report_id (report_id),
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Índices adicionales para optimización
-- ============================================
CREATE INDEX idx_reports_location ON reports(location_id);
CREATE INDEX idx_salvitas_report ON salvitas(report_id);

-- ============================================
-- Vista: open_reports_count
-- ============================================
CREATE OR REPLACE VIEW open_reports_count AS
SELECT 
    COUNT(*) as total_open_reports,
    DATE(created_at) as report_date
FROM reports
WHERE status = 'OPEN'
GROUP BY DATE(created_at);

-- ============================================
-- Vista: volunteer_stats
-- ============================================
CREATE OR REPLACE VIEW volunteer_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(r.id) as total_resolved,
    MAX(r.resolved_at) as last_resolved
FROM users u
LEFT JOIN reports r ON u.id = r.user_id AND r.status = 'RESOLVED'
WHERE u.role = 'VOLUNTEER'
GROUP BY u.id, u.name, u.email;

-- ============================================
-- Procedimiento: cambiar_estado_reporte
-- ============================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS cambiar_estado_reporte(
    IN p_report_id BIGINT,
    IN p_new_status VARCHAR(20)
)
BEGIN
    UPDATE reports
    SET status = p_new_status,
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = IF(p_new_status = 'RESOLVED', CURRENT_TIMESTAMP, resolved_at)
    WHERE id = p_report_id;
    
    SELECT 'Reporte actualizado exitosamente' as message;
END //

DELIMITER ;

-- ============================================
-- Datos iniciales de prueba (opcional)
-- ============================================
-- Usuario de prueba: admin@animalsafe.com / password123
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@animalsafe.com', '$2a$10$..., 'ADMIN'),
('Volunteer User', 'volunteer@animalsafe.com', '$2a$10$..., 'VOLUNTEER'),
('Regular User', 'user@animalsafe.com', '$2a$10$..., 'USER')
ON DUPLICATE KEY UPDATE id=id;
