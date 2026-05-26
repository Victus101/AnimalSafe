# 🐾 AnimalSafe - Backend API

**Plataforma REST para reportar y coordinar rescates de animales en peligro o abandono**

---

## 📋 Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Inicio Rápido](#-inicio-rápido)
- [Configuración](#-configuración)
- [Endpoints](#-endpoints-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Autenticación](#-autenticación)
- [Base de Datos](#-base-de-datos)
- [Documentación API](#-documentación-api)
- [Troubleshooting](#-troubleshooting)

---

## 🛠️ Tech Stack

| Componente | Versión | Descripción |
|-----------|---------|------------|
| **Java** | 17 | Runtime LTS |
| **Spring Boot** | 3.2.5 | Framework web |
| **Spring Security** | 3.2.5 | Autenticación y autorización |
| **MySQL** | 8.0+ | Base de datos relacional |
| **JPA/Hibernate** | 6.4 | ORM |
| **JWT** | 0.12.3 | Token-based authentication |
| **Swagger/OpenAPI** | 2.3.0 | Documentación interactiva de API |
| **Lombok** | 1.18.32 | Reducción de boilerplate |

---

## 🚀 Inicio Rápido

### Requisitos Previos

```
✓ Java 17 or higher
✓ MySQL 8.0 or higher
✓ Maven 3.8+
✓ Git
```

### 1️⃣ Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/animalsafe-backend.git
cd animalsafe-backend
```

### 2️⃣ Configurar Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE IF NOT EXISTS animal_safe;
USE animal_safe;

# Ejecutar schema (Hibernate creará automáticamente)
```

### 3️⃣ Configurar Variables de Entorno

**Crear archivo `.env` en raíz del proyecto:**

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/animal_safe?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USER=root
DB_PASSWORD=tu_contraseña

# JWT (REQUERIDO - mínimo 32 caracteres)
JWT_SECRET=tu-secreto-super-seguro-de-mas-de-32-caracteres-aleatorios
JWT_EXPIRATION=86400000

# Server
PORT=8080
```

**Para Windows PowerShell:**

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/animal_safe?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
$env:DB_USER="root"
$env:DB_PASSWORD="tu_contraseña"
$env:JWT_SECRET="tu-secreto-super-seguro-de-mas-de-32-caracteres"
$env:JWT_EXPIRATION="86400000"
$env:PORT="8080"
```

### 4️⃣ Compilar Proyecto

```bash
# Windows
.\mvnw.cmd clean compile

# Linux/macOS
./mvnw clean compile
```

### 5️⃣ Ejecutar Aplicación

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

✅ **Aplicación corriendo en:** `http://localhost:8080`

### 6️⃣ Acceder a Swagger UI

```
http://localhost:8080/swagger-ui.html
```

---

## ⚙️ Configuración

### application.properties

La configuración está centralizada en `src/main/resources/application.properties`:

```properties
# Variables de entorno soportadas:
${PORT}              # Puerto del servidor (default: 8080)
${DB_URL}            # URL de MySQL
${DB_USER}           # Usuario MySQL
${DB_PASSWORD}       # Contraseña MySQL
${JWT_SECRET}        # Secreto JWT (REQUERIDO en producción)
${JWT_EXPIRATION}    # Expiración token en ms (default: 86400000 = 24h)
```

### Niveles de Logging

En `application.properties`:

```properties
logging.level.root=INFO                           # Global
logging.level.com.animalsafe20.animalsafe=DEBUG   # Aplicación
logging.level.org.springframework.security=DEBUG  # Security
logging.level.org.hibernate.SQL=DEBUG             # SQL
```

---

## 📡 Endpoints Principales

### 🔐 Autenticación (Públicos)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Login y obtener JWT |

#### Ejemplo Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "MiContraseña123",
    "passwordConfirm": "MiContraseña123"
  }'
```

**Respuesta (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "juan@example.com",
  "role": "USER",
  "message": "Autenticación exitosa"
}
```

#### Ejemplo Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "MiContraseña123"
  }'
```

### 👥 Usuarios (Autenticados)

| Método | Endpoint | Requiere Rol |
|--------|----------|------------|
| GET | `/api/users` | ADMIN |
| GET | `/api/users/{id}` | ADMIN o propietario |
| DELETE | `/api/users/{id}` | ADMIN o propietario |

### 📋 Reportes (Autenticados)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/reports` | Obtener todos los reportes |
| GET | `/api/reports/{id}` | Obtener reporte específico |
| GET | `/api/reports/user/{userId}` | Reportes de un usuario |
| GET | `/api/reports/status/{status}` | Reportes por estado |
| GET | `/api/reports/nearby` | Reportes cercanos (radio) |
| POST | `/api/reports` | Crear nuevo reporte |
| PATCH | `/api/reports/{id}/status` | Actualizar estado (VOLUNTEER) |

#### Ejemplo Crear Reporte

```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Perro en peligro en Parque Central",
    "description": "Se vio un perro herido bajo la lluvia en Parque Central",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "address": "Parque Central, Bogotá",
    "animalType": "Perro",
    "animalCondition": "Herido",
    "animalDescription": "Perro cafe, aproximadamente 30kg"
  }'
```

### 🖼️ Imágenes (Autenticadas)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/images/report/{reportId}` | Obtener imágenes de reporte |
| GET | `/api/images/{imageId}` | Obtener imagen específica |
| POST | `/api/images` | Agregar imagen a reporte |
| DELETE | `/api/images/{imageId}` | Eliminar imagen (ADMIN) |

#### Ejemplo Agregar Imagen

```bash
curl -X POST "http://localhost:8080/api/images?reportId=1&imageUrl=https://example.com/image.jpg&fileName=dog.jpg" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Estructura del Proyecto

```
src/main/java/com/animalsafe20/animalsafe/
├── AnimalsafeApplication.java          # Punto de entrada
├── config/
│   ├── OpenApiConfig.java              # Configuración Swagger
│   └── SecurityConfig.java             # Configuración Spring Security
├── controller/                          # REST Controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ReportController.java
│   └── ImageController.java
├── dto/                                 # Data Transfer Objects
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── CreateReportRequest.java
│   ├── UpdateReportStatusRequest.java
│   ├── UserResponse.java
│   ├── ReportResponse.java
│   └── ImageResponse.java
├── exception/                           # Custom Exceptions
│   ├── GlobalExceptionHandler.java
│   ├── AuthenticationException.java
│   ├── BadRequestException.java
│   ├── ConflictException.java
│   ├── ResourceNotFoundException.java
│   └── ErrorResponse.java
├── model/                               # JPA Entities
│   ├── User.java
│   ├── Report.java
│   ├── Image.java
│   ├── Location.java
│   └── Salvita.java
├── repository/                          # JPA Repositories
│   ├── UserRepository.java
│   ├── ReportRepository.java
│   ├── ImageRepository.java
│   ├── LocationRepository.java
│   └── SalvitaRepository.java
├── security/                            # Security Components
│   └── JwtAuthenticationFilter.java
├── service/                             # Business Logic
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ReportService.java
│   ├── ImageService.java
│   └── ReportAuthorizationService.java
└── util/                                # Utilities
    └── JwtTokenProvider.java

src/main/resources/
├── application.properties               # Configuración principal
└── schema.sql                           # Script de BD (opcional)

docs/                                    # Documentación
├── architecture.md
├── business-rules.md
├── database.md
├── security.md
└── roadmap.md
```

---

## 🔐 Autenticación

### JWT (JSON Web Tokens)

- **Tipo:** Bearer Token
- **Algoritmo:** HS512
- **Expiración:** 24 horas (configurable)

### Flujo de Autenticación

```
1. Usuario se registra o hace login
2. API devuelve JWT token
3. Cliente incluye token en header: Authorization: Bearer <token>
4. Server valida token en cada request
5. Si token es válido, continúa; si no, rechaza con 401
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **USER** | Crear reportes, Ver reportes, Obtener info personal |
| **VOLUNTEER** | Todo de USER + Actualizar estado de reportes |
| **ADMIN** | Todo + Gestionar usuarios, Eliminar reportes, Eliminar imágenes |

### Ejemplo con JWT

```bash
# 1. Login y obtener token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' | jq -r '.token')

# 2. Usar token en requests
curl -X GET http://localhost:8080/api/reports \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💾 Base de Datos

### Schema

**Tablas principales:**

- `users` - Usuarios del sistema
- `reports` - Reportes de animales
- `locations` - Ubicaciones geográficas
- `salvitas` - Información del animal
- `images` - Imágenes adjuntas a reportes

### Diagrama ER

```
User (1) ──── (N) Report
Report (1) ──── (1) Location
Report (1) ──── (1) Salvita
Report (1) ──── (N) Image
```

### Inicializar BD

```bash
# Opción 1: Hibernate crea automáticamente (spring.jpa.hibernate.ddl-auto=update)
# Opción 2: Script manual
mysql -u root -p animal_safe < src/main/resources/schema.sql
```

---

## 📚 Documentación API

### Swagger UI

Accede a la documentación interactiva:

```
http://localhost:8080/swagger-ui.html
```

### OpenAPI JSON

```
http://localhost:8080/v3/api-docs
```

### OpenAPI YAML

```
http://localhost:8080/v3/api-docs.yaml
```

---

## 🧪 Testing

### Ejecutar tests

```bash
# Windows
.\mvnw.cmd test

# Linux/macOS
./mvnw test
```

### Test REST API (usando archivo test-api.rest)

```bash
# Instalar Rest Client extension en VS Code
# Abrir test-api.rest y ejecutar requests
```

---

## 📦 Construir para Producción

### Crear JAR ejecutable

```bash
# Windows
.\mvnw.cmd clean package

# Linux/macOS
./mvnw clean package

# Resultado: target/animalsafe-0.0.1-SNAPSHOT.jar
```

### Ejecutar JAR

```bash
java -Dspring.profiles.active=prod \
  -DJWT_SECRET="tu-secreto-seguro" \
  -DDB_URL="tu-url-mysql" \
  -DDB_USER="usuario" \
  -DDB_PASSWORD="contraseña" \
  -jar target/animalsafe-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Troubleshooting

### Error: "Database connection refused"

```bash
# Verificar que MySQL esté corriendo
mysql -u root -p
# Si falla, reinicia MySQL:
# Windows: net start MySQL80
# Linux: sudo systemctl start mysql
```

### Error: "JWT_SECRET not configured"

```bash
# Confirmar variable de entorno está configurada
# Windows PowerShell
$env:JWT_SECRET

# Linux/macOS
echo $JWT_SECRET

# Si falta, asignar:
$env:JWT_SECRET="tu-secreto-de-32-caracteres-minimo"
```

### Error: "No authorized provider found for password encoding"

```
→ Reiniciar la aplicación después de cambiar JWT_SECRET
```

### Error: Port 8080 already in use

```bash
# Cambiar puerto en application.properties o:
$env:PORT="8081"
.\mvnw.cmd spring-boot:run
```

### Error: "Cannot find entity class"

```bash
# Limpiar y recompilar
.\mvnw.cmd clean compile
```

---

## 🚀 Próximos Pasos

- [ ] Integración AWS S3 para imágenes
- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Integración Google Maps API
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Docker containerization

---

## 📄 Licencia

Este proyecto es parte del programa AnimalSafe. Derechos reservados.

---

## 👥 Contribuir

1. Fork el repositorio
2. Crear una rama: `git checkout -b feature/nueva-feature`
3. Commit cambios: `git commit -am 'Agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abrir Pull Request

---

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en GitHub o contactar al equipo de desarrollo.

**Última actualización:** Abril 2026
