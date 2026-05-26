# 📑 ÍNDICE COMPLETO DEL PROYECTO - AnimalSafe Backend

## 📂 Estructura de Archivos

### 📊 Entidades JPA (src/main/java/com/animalsafe20/animalsafe/model/)

1. **User.java** (85 líneas)
   - Modelo de usuario con roles (USER, VOLUNTEER, ADMIN)
   - Relación 1-N con reportes
   - Validaciones de email único y contraseña

2. **Report.java** (105 líneas)
   - Modelo de reporte de animal
   - Estados: OPEN, IN_PROGRESS, RESOLVED
   - Relaciones: ManyToOne con User, OneToOne con Location y Salvita, OneToMany con Images

3. **Salvita.java** (80 líneas)
   - Información del animal reportado
   - Tipos: dog, cat, bird, rabbit, etc.
   - Condiciones: injured, hungry, lost, abandoned, etc.

4. **Location.java** (65 líneas)
   - Coordenadas geográficas (latitud, longitud)
   - Dirección del reporte
   - Índices para búsqueda espacial

5. **Image.java** (55 líneas)
   - Metadatos de imágenes
   - URL de imagen (almacenada en servidor externo)
   - Relación ManyToOne con Report

---

### 🔄 Repositorios (src/main/java/com/animalsafe20/animalsafe/repository/)

1. **UserRepository.java** (25 líneas)
   - Métodos: findByEmail(), existsByEmail()
   - Operaciones CRUD automáticas

2. **ReportRepository.java** (50 líneas)
   - findByUserId(), findByStatus()
   - findNearbyOpenReports() - búsqueda geográfica

3. **SalvitaRepository.java** (20 líneas)
   - findByReportId()

4. **LocationRepository.java** (15 líneas)
   - Operaciones CRUD básicas

5. **ImageRepository.java** (20 líneas)
   - findByReportId()

---

### 🛠️ Servicios (src/main/java/com/animalsafe20/animalsafe/service/)

1. **AuthService.java** (100 líneas)
   - register() - Registro de usuarios
   - login() - Autenticación y generación de JWT
   - validateToken(), getUserIdFromToken()
   - Validaciones de contraseña y email único

2. **UserService.java** (110 líneas)
   - getAllUsers(), getUserById()
   - getUserByEmail(), existsByEmail()
   - updateUser(), deleteUser()
   - Conversión a DTOs

3. **ReportService.java** (180 líneas)
   - getAllReports(), getReportById()
   - getReportsByUserId(), getReportsByStatus()
   - getNearbyOpenReports() - búsqueda geográfica
   - createReport(), updateReportStatus(), deleteReport()

4. **ImageService.java** (85 líneas)
   - getImagesByReportId(), getImageById()
   - addImageToReport()
   - deleteImage()

---

### 🌐 Controladores (src/main/java/com/animalsafe20/animalsafe/controller/)

1. **AuthController.java** (35 líneas)
   - POST /api/auth/register
   - POST /api/auth/login

2. **UserController.java** (45 líneas)
   - GET /api/users (Admin only)
   - GET /api/users/{id}

3. **ReportController.java** (120 líneas)
   - POST /api/reports (crear)
   - GET /api/reports (todos)
   - GET /api/reports/{id} (específico)
   - GET /api/reports/user/{userId}
   - GET /api/reports/status/{status}
   - GET /api/reports/nearby (búsqueda geográfica)
   - PATCH /api/reports/{id}/status (actualizar estado)
   - DELETE /api/reports/{id}

4. **ImageController.java** (70 líneas)
   - GET /api/images/report/{reportId}
   - GET /api/images/{imageId}
   - POST /api/images (crear)
   - DELETE /api/images/{imageId}

---

### 📨 DTOs (src/main/java/com/animalsafe20/animalsafe/dto/)

1. **RegisterRequest.java** (25 líneas)
   - Fields: name, email, password, passwordConfirm

2. **LoginRequest.java** (18 líneas)
   - Fields: email, password

3. **AuthResponse.java** (35 líneas)
   - Response: token, type, userId, email, role, message

4. **UserResponse.java** (25 líneas)
   - Response con datos públicos del usuario

5. **CreateReportRequest.java** (40 líneas)
   - Solicitud para crear reporte con datos del animal

6. **ReportResponse.java** (85 líneas)
   - Respuesta completa de reporte con LocationDTO, SalvitaDTO, ImageDTO

7. **UpdateReportStatusRequest.java** (15 líneas)
   - Para actualizar estado del reporte

---

### 🔒 Seguridad (src/main/java/com/animalsafe20/animalsafe/security/)

1. **JwtAuthenticationFilter.java** (70 líneas)
   - Filtro que valida JWT en cada solicitud
   - Extrae token de header Authorization
   - Crea autenticación en contexto de seguridad

---

### ⚙️ Configuración (src/main/java/com/animalsafe20/animalsafe/config/)

1. **SecurityConfig.java** (90 líneas)
   - Configuración de Spring Security
   - BCryptPasswordEncoder bean
   - AuthenticationManager bean
   - SecurityFilterChain bean
   - Políticas de autorización por endpoint

---

### ⚠️ Excepciones (src/main/java/com/animalsafe20/animalsafe/exception/)

1. **ResourceNotFoundException.java** (12 líneas)
   - Excepción 404

2. **ConflictException.java** (12 líneas)
   - Excepción 409 (recurso duplicado)

3. **AuthenticationException.java** (12 líneas)
   - Excepción 401

4. **GlobalExceptionHandler.java** (90 líneas)
   - @RestControllerAdvice para manejo centralizado

5. **ErrorResponse.java** (22 líneas)
   - DTO para respuestas de error

---

### 🔧 Utilidades (src/main/java/com/animalsafe20/animalsafe/util/)

1. **JwtTokenProvider.java** (110 líneas)
   - generateToken() - Crear JWT
   - validateToken() - Validar JWT
   - getEmailFromToken(), getUserIdFromToken(), getRoleFromToken()
   - Usa JJWT 0.12.3 con algoritmo HS512

---

### 📄 Archivos de Configuración

1. **application.properties** (50 líneas)
   - Configuración de MySQL
   - Propiedades de JWT
   - Nivel de logging
   - Puerto de servidor

2. **schema.sql** (150 líneas)
   - CREATE TABLE statements
   - Índices para optimización
   - Vistas (open_reports_count, volunteer_stats)
   - Procedimiento almacenado

3. **pom.xml** (120 líneas)
   - Spring Boot BOM 4.0.6
   - Dependencias de Spring Web, Security, Data JPA
   - JJWT 0.12.3
   - MySQL Connector
   - Lombok

---

### 📚 Documentación

1. **RESUMEN_PROYECTO.md**
   - Resumen completo del proyecto
   - Estadísticas y características
   - Flujos de autenticación

2. **GUIA_INSTALACION.md**
   - Documentación completa
   - Instrucciones paso a paso
   - Ejemplos de uso
   - Troubleshooting

3. **INICIO_RAPIDO.md**
   - Guía rápida de 5 minutos
   - Comandos principales
   - Tests rápidos

4. **INDICE_ARCHIVOS.md** (este archivo)
   - Referencia completa de todos los archivos

---

## 📊 Estadísticas

| Métrica | Cantidad |
|---------|----------|
| Archivos Java | 34 |
| Líneas de código | ~2,500 |
| Paquetes | 8 |
| Métodos públicos | 100+ |
| Entidades JPA | 5 |
| Repositorios | 5 |
| Servicios | 4 |
| Controladores | 4 |
| DTOs | 7 |
| Excepciones | 4 |
| Tests | - (Próximamente) |

---

## 🗺️ Mapa de Navegación

```
AnimalsafeApplication (inicio)
    ↓
SecurityConfig (configurar seguridad)
    ↓
JwtAuthenticationFilter (validar token)
    ↓
Controller (recibir solicitud)
    ↓
Service (lógica de negocio)
    ↓
Repository (acceder a BD)
    ↓
Model/Entity (datos)
    ↓
DTO (respuesta)
```

---

## 🔄 Flujo de Solicitud

```
1. Cliente envía solicitud HTTP
   ├─ URL: /api/reports
   ├─ Header: Authorization: Bearer <TOKEN>
   └─ Body: JSON (DTO)

2. Spring recibe solicitud
   ├─ JwtAuthenticationFilter valida token
   ├─ SecurityConfig verifica permisos
   └─ Pasa a Controller si es válido

3. Controller (ReportController)
   ├─ Valida DTO (@Valid)
   ├─ Llama a Service
   └─ Retorna respuesta

4. Service (ReportService)
   ├─ Lógica de negocio
   ├─ Llama a Repository
   ├─ Conversión a DTO
   └─ Retorna resultado

5. Repository (ReportRepository)
   ├─ Ejecuta query en BD
   ├─ Retorna Entity
   └─ Vuelve a Service

6. Respuesta HTTP
   ├─ Status Code (200, 201, 400, etc.)
   ├─ Headers
   └─ Body (JSON)
```

---

## 🔍 Búsqueda por Funcionalidad

### Autenticación
- `AuthService.java` - Lógica
- `JwtTokenProvider.java` - Token
- `JwtAuthenticationFilter.java` - Filtro
- `AuthController.java` - Endpoints

### Usuarios
- `UserService.java` - Lógica
- `UserRepository.java` - Acceso
- `UserController.java` - Endpoints
- `UserResponse.java` - DTO

### Reportes
- `ReportService.java` - Lógica
- `ReportRepository.java` - Acceso
- `ReportController.java` - Endpoints
- `CreateReportRequest.java` - DTO entrada
- `ReportResponse.java` - DTO salida

### Imágenes
- `ImageService.java` - Lógica
- `ImageRepository.java` - Acceso
- `ImageController.java` - Endpoints

### Seguridad
- `SecurityConfig.java` - Configuración
- `JwtAuthenticationFilter.java` - Filtro

### Excepciones
- `GlobalExceptionHandler.java` - Manejador
- `*Exception.java` - Excepciones personalizadas

---

## 🚀 Cómo Usar Este Índice

1. **Buscar por funcionalidad** - Usa la tabla "Búsqueda por Funcionalidad"
2. **Entender el flujo** - Usa el "Mapa de Navegación"
3. **Implementar nueva feature** - Sigue el "Flujo de Solicitud"
4. **Debug** - Revisa "Estadísticas" y "Estructura de Archivos"

---

## 📝 Convenciones de Nombres

- **Clases**: PascalCase (UserService, ReportController)
- **Métodos**: camelCase (getUserById, createReport)
- **Variables**: camelCase (userId, reportStatus)
- **Constantes**: UPPER_SNAKE_CASE (JWT_SECRET)
- **Packages**: com.animalsafe20.animalsafe.{layer}

---

## ✅ Checklist de Características

- ✅ Autenticación JWT
- ✅ Spring Security con RBAC
- ✅ Validación de entrada
- ✅ Manejo centralizado de excepciones
- ✅ Relaciones JPA complejas
- ✅ Búsqueda geográfica
- ✅ Encriptación de contraseñas
- ✅ DTOs para desacoplamiento
- ✅ Logging y debugging
- ✅ Configuración por propiedades
- ✅ Índices en BD para optimización
- ✅ Vistas SQL para reportes

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Estado**: ✅ Production Ready
