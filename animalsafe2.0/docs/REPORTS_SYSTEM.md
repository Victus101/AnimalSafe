# Sistema de Reportes de Rescate de Animales - Documentación

## ✅ Status: Completamente Implementado

El backend ya incluye un sistema de reportes funcional y robusto para gestionar casos de rescate de animales usando coordenadas GPS.

---

## 📋 Componentes

### 1. Report Entity
**Archivo:** [model/Report.java](model/Report.java)

```java
@Entity
@Table(name = "reports")
public class Report {
    @Id private Long id;
    @NotBlank private String title;
    @NotBlank private String description;
    @Enumerated private ReportStatus status; // OPEN, IN_PROGRESS, RESOLVED
    
    @ManyToOne private User user;              // Creador del reporte
    @OneToOne private Location location;       // Coordenadas GPS
    @OneToOne private Salvita salvita;         // Datos del animal
    @OneToMany private List<Image> images;     // Imágenes del animal
    
    @CreationTimestamp private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
```

---

### 2. Report Repository
**Archivo:** [repository/ReportRepository.java](repository/ReportRepository.java)

Métodos disponibles:
- `findAll()` - Obtiene todos los reportes
- `findById(Long id)` - Obtiene un reporte específico
- `findByUserId(Long userId)` - Reportes de un usuario
- `findByStatus(ReportStatus status)` - Reportes por estado
- `findNearbyOpenReports(Double lat, Double lon, Double radiusKm)` - Reportes cercanos

---

### 3. CreateReportRequest DTO
**Archivo:** [dto/CreateReportRequest.java](dto/CreateReportRequest.java)

```java
@Data
public class CreateReportRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotNull private Double latitude;
    @NotNull private Double longitude;
    private String address;
    @NotBlank private String animalType;
    @NotBlank private String animalCondition;
    private String animalDescription;
}
```

**Validaciones incluidas:**
- Título: 3-150 caracteres
- Descripción: 10-1000 caracteres
- Latitud: -90 a 90 grados
- Longitud: -180 a 180 grados
- Dirección: máx 255 caracteres
- Tipo de animal: obligatorio
- Condición: obligatoria

---

### 4. ReportResponse DTO
**Archivo:** [dto/ReportResponse.java](dto/ReportResponse.java)

Estructura de respuesta con todos los datos del reporte.

---

### 5. ReportService
**Archivo:** [service/ReportService.java](service/ReportService.java)

Métodos principales:
```java
// Crear reporte (requiere autenticación)
public ReportResponse createReport(CreateReportRequest request, Long userId)

// Leer reportes
public List<ReportResponse> getAllReports()
public ReportResponse getReportById(Long id)
public List<ReportResponse> getReportsByUserId(Long userId)
public List<ReportResponse> getReportsByStatus(ReportStatus status)
public List<ReportResponse> getNearbyOpenReports(Double lat, Double lon, Double radiusKm)

// Actualizar
public ReportResponse updateReportStatus(Long id, UpdateReportStatusRequest request)

// Eliminar
public void deleteReport(Long id)
```

---

### 6. ReportController
**Archivo:** [controller/ReportController.java](controller/ReportController.java)

#### Endpoints Públicos

**GET /api/reports**
- Obtiene todos los reportes
- Sin autenticación requerida

```bash
curl -X GET http://localhost:8080/api/reports
```

**GET /api/reports/{id}**
- Obtiene un reporte específico
- Sin autenticación requerida

```bash
curl -X GET http://localhost:8080/api/reports/1
```

**GET /api/reports/nearby?latitude=X&longitude=Y&radiusKm=10**
- Obtiene reportes abiertos cercanos
- Sin autenticación requerida

```bash
curl -X GET "http://localhost:8080/api/reports/nearby?latitude=-33.45&longitude=-70.66&radiusKm=10"
```

**GET /api/reports/status/{status}**
- Filtra por estado: OPEN, IN_PROGRESS, RESOLVED
- Sin autenticación requerida

```bash
curl -X GET http://localhost:8080/api/reports/status/OPEN
```

#### Endpoints Protegidos (Requieren JWT)

**POST /api/reports** (Requiere autenticación)
- Crea un nuevo reporte
- Extrae el userId del JWT automáticamente

```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Perro herido",
    "description": "Encontré un perro herido en la calle principal",
    "latitude": -33.4489,
    "longitude": -70.6693,
    "address": "Calle Principal 123",
    "animalType": "PERRO",
    "animalCondition": "HERIDO",
    "animalDescription": "Marrón, tamaño mediano, pata trasera inflamada"
  }'
```

**GET /api/reports/user/{userId}** (Requiere autenticación para usuarios distintos)
- Obtiene reportes de un usuario específico

```bash
curl -X GET http://localhost:8080/api/reports/user/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**PATCH /api/reports/{id}/status** (Requiere rol VOLUNTEER o ADMIN)
- Actualiza el estado de un reporte

```bash
curl -X PATCH http://localhost:8080/api/reports/1/status \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"newStatus": "IN_PROGRESS"}'
```

**DELETE /api/reports/{id}** (Requiere rol ADMIN)
- Elimina un reporte

```bash
curl -X DELETE http://localhost:8080/api/reports/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 📊 Ejemplo de Respuesta

```json
[
  {
    "id": 1,
    "title": "Perro herido",
    "description": "Está en la calle",
    "status": "OPEN",
    "latitude": -33.4489,
    "longitude": -70.6693,
    "createdAt": "2026-04-27T14:30:00",
    "createdBy": {
      "id": 15,
      "name": "Mario",
      "email": "mario@gmail.com"
    },
    "location": {
      "id": 1,
      "latitude": -33.4489,
      "longitude": -70.6693,
      "address": "Calle Principal 123"
    },
    "salvita": {
      "id": 1,
      "animalType": "PERRO",
      "animalCondition": "HERIDO",
      "description": "Marrón, tamaño mediano"
    },
    "images": []
  }
]
```

---

## 🔐 Seguridad

- ✅ POST /api/reports: Requiere autenticación JWT
- ✅ PATCH /api/reports/{id}/status: Requiere rol VOLUNTEER o ADMIN
- ✅ DELETE /api/reports/{id}: Requiere rol ADMIN
- ✅ GET endpoints: Públicos (sin autenticación)

---

## 🗂️ Estructura de Base de Datos

### Tabla: reports
```sql
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    resolved_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    INDEX idx_status (status),
    INDEX idx_created_by (user_id),
    INDEX idx_created_at (created_at)
);
```

### Tabla: locations
```sql
CREATE TABLE locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: salvitas (Animals)
```sql
CREATE TABLE salvitas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_type VARCHAR(50) NOT NULL,
    animal_condition VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    report_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (report_id) REFERENCES reports(id)
);
```

---

## 🚀 Cómo Usar Desde el Frontend

### 1. Crear un Reporte
```javascript
const createReport = async (token, reportData) => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Perro herido",
      description: "Animal herido en la calle",
      latitude: -33.4489,
      longitude: -70.6693,
      address: "Calle Principal 123",
      animalType: "PERRO",
      animalCondition: "HERIDO",
      animalDescription: "Marrón, pata trasera inflamada"
    })
  });
  
  const report = await response.json();
  console.log('Reporte creado:', report);
};
```

### 2. Obtener Reportes Cercanos
```javascript
const getNearbyReports = async (latitude, longitude, radiusKm = 10) => {
  const response = await fetch(
    `/api/reports/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
  );
  
  const reports = await response.json();
  return reports;
};
```

### 3. Obtener Mis Reportes
```javascript
const getMyReports = async (userId, token) => {
  const response = await fetch(`/api/reports/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const reports = await response.json();
  return reports;
};
```

---

## ✅ Status de Implementación

| Feature | Status |
|---------|--------|
| Crear reportes | ✅ Completo |
| Listar reportes | ✅ Completo |
| Reportes cercanos (GPS) | ✅ Completo |
| Filtrar por estado | ✅ Completo |
| Actualizar estado | ✅ Completo |
| Autenticación requerida | ✅ Completo |
| Imágenes | ✅ Integrada |
| Datos del animal (Salvita) | ✅ Integrada |
| Ubicación precisa | ✅ Integrada |

---

## 🔧 Compilación y Build

```bash
# Compilar
.\mvnw.cmd clean compile -DskipTests

# Build completo
.\mvnw.cmd clean package

# Ejecutar
.\mvnw.cmd spring-boot:run
```

Compilación: ✅ **BUILD SUCCESS**
