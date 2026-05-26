# CLAUDE.md — AnimalSafe Backend

## 📌 Descripción del Proyecto

AnimalSafe es una API REST diseñada para reportar, gestionar y resolver casos de animales en peligro o abandono.

El sistema permite a usuarios reportar animales, voluntarios gestionarlos y administradores supervisar el sistema.

El backend está desarrollado en:

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- MySQL
- JPA / Hibernate

La API está diseñada para ser consumida por una aplicación móvil React Native.

---

## 🎯 Objetivo del Proyecto

Permitir a usuarios:

- Reportar animales en peligro
- Ubicar reportes geográficos
- Gestionar rescates
- Documentar el estado de rescates
- Administrar usuarios
- Subir imagenes

---

## 🧠 Entidades Principales

### User

Representa un usuario del sistema.

Roles:

- USER
- VOLUNTEER
- ADMIN

Responsabilidades:

- Crear reportes
- Consultar reportes
- Gestionar rescates (según rol)

---

### Report

Representa un caso de rescate animal.

Estados:

- OPEN
- IN_PROGRESS
- RESOLVED

Relaciones:

- Pertenece a User
- Tiene Location
- Tiene Salvita
- Tiene múltiples Images

---

### Salvita

Representa el animal reportado.

Contiene:

- type
- condition
- description

---

### Location

Ubicación geográfica del reporte.

Campos:

- latitude
- longitude
- address

---

### Image

Imagen asociada a un reporte.

Campos:

- url
- fileName

---

## 🔐 Seguridad

El sistema usa:

- JWT Authentication
- Spring Security
- Role-Based Access Control (RBAC)

Roles:

USER:
- Crear reportes
- Ver reportes

VOLUNTEER:
- Actualizar estado de reportes

ADMIN:
- Gestionar usuarios
- Eliminar reportes

---

## 📦 Arquitectura

Se utiliza arquitectura por capas:

Controller → Service → Repository → Database

Principios:

- DTO Pattern
- Separation of Concerns
- Stateless Authentication
- Exception Handling Centralizado

---

## 📌 Reglas de Desarrollo

SIEMPRE:

- Usar DTOs para entrada y salida
- No exponer entidades directamente
- Validar datos con annotations
- Manejar errores con GlobalExceptionHandler
- Respetar roles y permisos

NUNCA:

- Acceder a la base de datos desde Controllers
- Saltarse la capa Service
- Hardcodear valores sensibles
- Romper la estructura de paquetes

---

## 📡 Endpoints Principales

Auth:

POST /api/auth/register  
POST /api/auth/login  

Users:

GET /api/users  
GET /api/users/{id}

Reports:

POST /api/reports  
GET /api/reports  
GET /api/reports/{id}

Images:

POST /api/images  
GET /api/images/report/{id}

---

## 🧠 Filosofía del Proyecto

El código debe ser:

- Limpio
- Modular
- Seguro
- Escalable
- Documentado

La prioridad es:

Seguridad > Claridad > Performance

---

## 🚀 Roadmap

Próximos objetivos:

- Integrar AWS S3 para imágenes
- Integrar Google Maps
- Crear notificaciones en tiempo real
- Conectar frontend React Native