# AnimalSafe Backend - MVP

Backend production-ready para la aplicación móvil **AnimalSafe**, construido con Spring Boot, Java 17, Spring Security, JWT Authentication y MySQL.

## 📋 Descripción del Proyecto

AnimalSafe es una plataforma que permite:
- 📱 Reportar animales en peligro
- 📍 Compartir ubicación de animales
- 📸 Cargar fotos de animales
- 🔄 Rastrear estado del rescate
- 👥 Permitir que voluntarios vean reportes cercanos
- 🤝 Coordinar acciones de rescate

## 🏗️ Arquitectura

```
animalsafe/
├── controller/      → REST API Endpoints
├── service/         → Lógica de negocio
├── repository/      → Acceso a datos (JPA)
├── model/           → Entidades JPA
├── dto/             → Data Transfer Objects
├── security/        → JWT & Spring Security
├── config/          → Configuraciones
├── exception/       → Manejo de excepciones
└── util/            → Utilidades
```

## 🛠️ Tecnologías

- **Java 17** - Lenguaje de programación
- **Spring Boot 4.0.6** - Framework
- **Spring Data JPA** - ORM
- **Spring Security + JWT** - Autenticación
- **MySQL 8.0** - Base de datos
- **Lombok** - Reducción de boilerplate
- **Maven** - Build tool
- **JJWT 0.12.3** - JWT Token generation/validation

## 📋 Requisitos Previos

1. **Java 17 o superior**
   ```bash
   java -version
   ```

2. **Maven** (incluido en el proyecto como Maven Wrapper)
   ```bash
   ./mvnw --version
   ```

3. **MySQL 8.0 o superior**
   ```bash
   mysql --version
   ```

4. **Git**
   ```bash
   git --version
   ```

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd animalsafe2.0
```

### 2. Configurar Base de Datos MySQL

#### Opción A: Ejecutar el Script SQL

```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de schema
mysql -u root -p < src/main/resources/schema.sql
```

#### Opción B: Crear manualmente

```sql
CREATE DATABASE IF NOT EXISTS animal_safe;
USE animal_safe;

-- Las tablas se crearán automáticamente por Hibernate en la primera ejecución
```

### 3. Configurar Credenciales de Base de Datos

Editar `src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/animal_safe?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=tu_contraseña
```

### 4. Configurar JWT Secret (Opcional)

Editar `src/main/resources/application.properties`:

```properties
# JWT
app.jwt.secret=tu_secreto_muy_largo_y_seguro_con_32_caracteres_minimo
app.jwt.expiration=86400000  # 24 horas en milisegundos
```

## 🏃 Ejecutar la Aplicación

### Opción 1: Con Maven Wrapper (Windows)

```bash
.\mvnw.cmd spring-boot:run
```

### Opción 2: Con Maven Wrapper (Linux/macOS)

```bash
./mvnw spring-boot:run
```

### Opción 3: Construir y ejecutar JAR

```bash
# Compilar
.\mvnw.cmd clean package

# Ejecutar
java -jar target/animalsafe-0.0.1-SNAPSHOT.jar
```

La aplicación estará disponible en: **http://localhost:8080**

## 📚 Endpoints API

### 🔐 Autenticación

```
POST   /api/auth/register     - Registrar nuevo usuario
POST   /api/auth/login        - Iniciar sesión
```

**Ejemplo: Registro**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

**Respuesta:**
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

**Ejemplo: Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### 👥 Usuarios

```
GET    /api/users             - Obtener todos (Admin)
GET    /api/users/{id}        - Obtener usuario específico
```

**Ejemplo: Obtener usuario**
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <token>"
```

### 📋 Reportes

```
GET    /api/reports           - Obtener todos los reportes
POST   /api/reports           - Crear nuevo reporte (Autenticado)
GET    /api/reports/{id}      - Obtener reporte específico
GET    /api/reports/user/{userId}     - Reportes de un usuario
GET    /api/reports/status/{status}   - Reportes por estado
GET    /api/reports/nearby?latitude=X&longitude=Y&radiusKm=Z  - Reportes cercanos
PATCH  /api/reports/{id}/status       - Actualizar estado (Volunteer/Admin)
DELETE /api/reports/{id}      - Eliminar reporte (Admin)
```

**Ejemplo: Crear reporte**
```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Perro herido en el parque",
    "description": "Perro negro con herida en la pata trasera",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "Central Park, New York",
    "animalType": "dog",
    "animalCondition": "injured",
    "animalDescription": "Perro de tamaño mediano"
  }'
```

**Ejemplo: Obtener reportes cercanos**
```bash
curl -X GET "http://localhost:8080/api/reports/nearby?latitude=40.7128&longitude=-74.0060&radiusKm=5" \
  -H "Authorization: Bearer <token>"
```

### 🖼️ Imágenes

```
GET    /api/images/report/{reportId}  - Imágenes de un reporte
GET    /api/images/{imageId}          - Obtener imagen específica
POST   /api/images?reportId=X&imageUrl=URL&fileName=name  - Agregar imagen
DELETE /api/images/{imageId}          - Eliminar imagen (Admin)
```

**Ejemplo: Agregar imagen**
```bash
curl -X POST "http://localhost:8080/api/images?reportId=1&imageUrl=https://example.com/image.jpg&fileName=perro.jpg" \
  -H "Authorization: Bearer <token>"
```

## 📊 Modelo de Datos

### User
- `id` - Identificador único
- `name` - Nombre completo
- `email` - Email único
- `password` - Contraseña encriptada
- `role` - USER, VOLUNTEER, ADMIN
- `createdAt` - Fecha de creación

### Report
- `id` - Identificador único
- `title` - Título del reporte
- `description` - Descripción detallada
- `status` - OPEN, IN_PROGRESS, RESOLVED
- `userId` - Referencia a usuario
- `locationId` - Referencia a ubicación
- `createdAt`, `updatedAt`, `resolvedAt`

### Salvita (Animal)
- `id` - Identificador único
- `type` - Tipo de animal (dog, cat, bird, etc)
- `condition` - Condición (injured, hungry, lost, etc)
- `description` - Descripción del animal
- `reportId` - Referencia a reporte

### Location
- `id` - Identificador único
- `latitude` - Latitud
- `longitude` - Longitud
- `address` - Dirección

### Image
- `id` - Identificador único
- `url` - URL de la imagen
- `fileName` - Nombre del archivo
- `reportId` - Referencia a reporte
- `uploadedAt` - Fecha de carga

## 🔐 Autenticación

### JWT Token Flow

1. **Registro/Login**: Usuario proporciona credenciales
2. **Token Generation**: Servidor genera JWT token
3. **Token Storage**: Cliente almacena token (localStorage, etc)
4. **Authorized Requests**: Cliente envía token en header `Authorization: Bearer <token>`
5. **Token Validation**: Servidor valida token en cada solicitud

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **USER** | Ver reportes, crear reportes, subir imágenes |
| **VOLUNTEER** | USER + actualizar estado de reportes |
| **ADMIN** | Todo acceso |

## 🧪 Testing

### Ejecutar tests

```bash
.\mvnw.cmd test
```

### Test con Postman

1. Importar colección Postman: `docs/postman-collection.json`
2. Configurar variable de entorno `token` con JWT token válido
3. Ejecutar requests

## 📝 Logs

Los logs se encuentran en la consola y se pueden configurar en:
`src/main/resources/application.properties`

```properties
logging.level.com.animalsafe20.animalsafe=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que MySQL está corriendo
# Windows
mysql -u root -p

# Verificar credenciales en application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/animal_safe
spring.datasource.username=root
spring.datasource.password=lana3045
```

### Error: "Port 8080 already in use"

```bash
# Cambiar puerto en application.properties
server.port=8081
```

### Error: "Table doesn't exist"

```bash
# Ejecutar el script SQL manualmente
mysql -u root -p animal_safe < src/main/resources/schema.sql

# O esperar a que Hibernate lo cree (ddl-auto=update)
```

## 📦 Estructura de Carpetas

```
src/
├── main/
│   ├── java/com/animalsafe20/animalsafe/
│   │   ├── AnimalsafeApplication.java
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   ├── security/
│   │   ├── config/
│   │   ├── exception/
│   │   └── util/
│   └── resources/
│       ├── application.properties
│       └── schema.sql
└── test/
    └── java/com/animalsafe20/animalsafe/
```

## 🚀 Deployment

### Docker (Próximamente)

```bash
docker build -t animalsafe:latest .
docker run -p 8080:8080 animalsafe:latest
```

### Cloud Deployment

- AWS EC2 / ECS
- Google Cloud Run
- Azure App Service
- Heroku

## 📖 Documentación Adicional

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JJWT Documentation](https://github.com/jwtk/jjwt)

## 👥 Contribuir

1. Fork el proyecto
2. Crear rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## ✉️ Contacto

Para preguntas o sugerencias, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Estado**: Production Ready ✅
