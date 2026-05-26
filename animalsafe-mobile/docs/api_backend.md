# API_BACKEND.md

# AnimalSafe Backend API Documentation
Versión actual: MVP v1  
Backend: Spring Boot 3 + Java 17 + MySQL + JWT  
Estado: Operativo y listo para integración mobile

---

# 📌 Propósito

Este documento entrega contexto técnico del backend de AnimalSafe para el desarrollo de la aplicación móvil en React Native + Expo.

AnimalSafe permite a los usuarios reportar animales heridos, abandonados o en peligro, visualizar casos cercanos y coordinar rescates.

La app mobile consumirá esta API REST.

---

# 🏗️ Stack Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- MySQL
- JPA / Hibernate
- Swagger OpenAPI

---

# 🌐 Base URL Local

```text
http://localhost:8080

# Swagger:
http://localhost:8080/swagger-ui.html

🔐 Autenticación

La API usa JWT Bearer Token.

Después del login o register, el backend entrega un token que debe enviarse en requests protegidas.

Header requerido:
Authorization: Bearer TU_TOKEN

👥 Roles del Sistema
USER
VOLUNTEER
ADMIN

USER
- Crear reportes
- Ver reportes
- Ver perfil propio
VOLUNTEER
- Todo USER
- Cambiar estado de reportes
ADMIN
- Todo acceso
- Gestionar usuarios
- Eliminar recursos


📦 Respuesta estándar esperada

Success
{
  "message": "Operación exitosa"
}

Error
{
  "timestamp": "2026-04-24T22:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Token inválido"
}


🔐 AUTH ENDPOINTS
POST /api/auth/register

Crear nuevo usuario.

Request

{
  "name": "Alejandro",
  "email": "alejandro@email.com",
  "password": "123456",
  "passwordConfirm": "123456"
}

Response
{
  "token": "jwt_token",
  "type": "Bearer",
  "userId": 1,
  "email": "alejandro@email.com",
  "role": "USER",
  "message": "Autenticación exitosa"
}

POST /api/auth/login

Login usuario existente.

Request
{
  "email": "alejandro@email.com",
  "password": "123456"
}

Response

{
  "token": "jwt_token",
  "type": "Bearer",
  "userId": 1,
  "email": "alejandro@email.com",
  "role": "USER"
}


👤 USERS ENDPOINTS
GET /api/users

Requiere ADMIN.

Obtiene lista usuarios.


GET /api/users/{id}

Requiere:
ADMIN o dueño de cuenta
Obtiene perfil usuario.

Response ejemplo

{
  "id": 1,
  "name": "Alejandro",
  "email": "alejandro@email.com",
  "role": "USER",
  "reportCount": 5
}

DELETE /api/users/{id}

Requiere:
ADMIN o dueño de cuenta
Eliminar cuenta.

🐾 REPORTS ENDPOINTS
GET /api/reports

Obtiene todos los reportes activos o existentes.

Uso mobile

Pantalla Home Map.

GET /api/reports/{id}

Obtiene detalle de un caso.

GET /api/reports/user/{userId}

Obtiene reportes creados por usuario.

Uso:

Pantalla Perfil / Mis reportes
GET /api/reports/status/{status}

Estados disponibles:

OPEN
IN_PROGRESS
RESOLVED
GET /api/reports/nearby
Query params
latitude
longitude
radiusKm
Ejemplo
/api/reports/nearby?latitude=-33.45&longitude=-70.66&radiusKm=5

Uso principal:

Mapa geolocalizado
POST /api/reports

Crear nuevo reporte.

Requiere JWT.

Request ejemplo
{
  "title": "Perro herido",
  "description": "Perro en avenida principal",
  "latitude": -33.4489,
  "longitude": -70.6693,
  "address": "Santiago Centro",
  "animalType": "Perro",
  "animalCondition": "Herido",
  "animalDescription": "Color café pequeño"
}
Flujo mobile

Pantalla:

Reportar Salvita
PATCH /api/reports/{id}/status

Cambiar estado del caso.

Requiere:

VOLUNTEER o ADMIN
Request
{
  "newStatus": "RESOLVED"
}
🖼️ IMAGES ENDPOINTS
GET /api/images/report/{reportId}

Obtiene imágenes asociadas a reporte.

GET /api/images/{imageId}

Obtiene imagen específica.

POST /api/images

Agregar imagen a reporte.

Query Params
reportId
imageUrl
fileName
Ejemplo
/api/images?reportId=1&imageUrl=https://...jpg&fileName=dog.jpg
DELETE /api/images/{imageId}

Requiere ADMIN.

📱 Integración Mobile Recomendada
Auth Storage

Guardar JWT en:

expo-secure-store

No AsyncStorage idealmente.

Cliente HTTP sugerido

Axios.

Ejemplo:

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;



🗺️ Uso por Pantallas Mobile
Login Screen
POST /api/auth/login
Register Screen
POST /api/auth/register
Home Map
GET /api/reports
o
GET /api/reports/nearby
Reportar Salvita
POST /api/reports
POST /api/images
Perfil
GET /api/users/{id}
GET /api/reports/user/{id}
Notificaciones (futuro)

Actualmente backend no posee módulo notifications.

⚠️ Consideraciones Localhost

Android emulator:

http://10.0.2.2:8080

Dispositivo físico:

usar IP local del PC.

Ejemplo:

http://192.168.1.50:8080
🚀 Próximas Mejoras Backend Futuras
Upload real imágenes a AWS S3
Push notifications
Chat rescate
Auditoría eventos
Moderación contenido
WebSockets tiempo real
📌 Estado Actual
Backend listo para consumir desde React Native MVP
👨‍💻 Nota para IA / Agentes

Cuando trabajes sobre mobile:

mantener compatibilidad con esta API
usar JWT auth
diseñar mobile-first
priorizar Home Map
principal CTA = Reportar Salvita