# 🎯 TARJETA DE REFERENCIA RÁPIDA - AnimalSafe Backend

## 🚀 Inicio en 30 segundos

```bash
# 1. Compilar
.\mvnw.cmd clean compile

# 2. Ejecutar
.\mvnw.cmd spring-boot:run

# 3. Acceder
http://localhost:8080
```

---

## 📋 Endpoints Más Usados

### Autenticación
```bash
# Registrar
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan",
  "email": "juan@test.com",
  "password": "pass123",
  "passwordConfirm": "pass123"
}

# Login
POST /api/auth/login
{
  "email": "juan@test.com",
  "password": "pass123"
}
# Respuesta: { token: "...", userId: 1, ... }
```

### Reportes
```bash
# Crear reporte (Autenticado)
POST /api/reports
Authorization: Bearer <TOKEN>

{
  "title": "Perro perdido",
  "description": "Pequeño, marrón",
  "latitude": 4.7110,
  "longitude": -74.0721,
  "address": "Bogotá",
  "animalType": "dog",
  "animalCondition": "lost",
  "animalDescription": "Shih Tzu"
}

# Obtener todos
GET /api/reports

# Obtener uno
GET /api/reports/1

# Reportes cercanos
GET /api/reports/nearby?latitude=4.7110&longitude=-74.0721&radiusKm=10

# Cambiar estado
PATCH /api/reports/1/status
{ "newStatus": "IN_PROGRESS" }
```

### Imágenes
```bash
# Subir imagen
POST /api/images?reportId=1&imageUrl=https://...&fileName=perro.jpg

# Obtener
GET /api/images/report/1
```

---

## 🔑 Credenciales de Prueba (después de registrarse)

```
Email: cualquier_email@example.com
Password: Lo que registres
```

---

## 🛠️ Comandos Maven

```bash
# Compilar
.\mvnw.cmd clean compile

# Tests
.\mvnw.cmd test

# Build JAR
.\mvnw.cmd clean package

# Run
.\mvnw.cmd spring-boot:run

# Dependencias
.\mvnw.cmd dependency:tree
```

---

## 🗄️ Comandos MySQL

```bash
# Conectar
mysql -u root -p

# Crear BD
CREATE DATABASE animal_safe;

# Ver tablas
USE animal_safe;
SHOW TABLES;

# Ver estructura
DESCRIBE users;

# Ver datos
SELECT * FROM users;
SELECT * FROM reports;
```

---

## 📁 Estructura Clave

```
animalsafe/
├── model/           ← Entidades
├── service/         ← Lógica
├── repository/      ← BD
├── controller/      ← Endpoints
├── security/        ← JWT
├── dto/             ← Solicitudes/Respuestas
├── exception/       ← Errores
└── util/            ← Utilidades
```

---

## 🔒 Seguridad

### Roles
- **USER** - Crear reportes, ver
- **VOLUNTEER** - USER + actualizar estado
- **ADMIN** - Todo

### Token JWT
- Válido 24 horas (configurable)
- Enviar: `Authorization: Bearer <token>`

---

## 🐛 Solucionar Problemas

| Problema | Solución |
|----------|----------|
| Puerto ocupado | Cambiar en `application.properties`: `server.port=8081` |
| No conecta a BD | Verificar: usuario=root, contraseña=lana3045, host=localhost |
| "Table doesn't exist" | Ejecutar: `mysql -u root -p < src/main/resources/schema.sql` |
| JWT inválido | Asegurarse: `Authorization: Bearer <token>` (con espacio) |
| Error compilación | Ejecutar: `.\mvnw.cmd clean` |

---

## 📊 Estados de Reporte

```
OPEN → Usuario crea reporte
     ↓
IN_PROGRESS → Voluntario acepta rescate
     ↓
RESOLVED → Rescate completado
```

---

## 🧪 Test Rápido (curl)

```bash
# 1. Registrar
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","passwordConfirm":"123456"}'

# 2. Copiar el token recibido

# 3. Crear reporte
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{"title":"Test","description":"Test test test","latitude":4.7,"longitude":-74.0,"address":"Test","animalType":"dog","animalCondition":"lost","animalDescription":"Test"}'

# 4. Ver reportes
curl -X GET http://localhost:8080/api/reports
```

---

## 💾 Base de Datos

### Tablas Principales
- **users** - Usuarios
- **reports** - Reportes
- **salvitas** - Animales
- **locations** - Ubicaciones
- **images** - Imágenes

### Índices Importantes
- users.email (UNIQUE)
- reports.status
- salvitas.type
- locations (latitud, longitud)

---

## 📝 Propiedades de Aplicación

```properties
# Puerto
server.port=8080

# BD MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/animal_safe
spring.datasource.username=root
spring.datasource.password=lana3045

# JWT
app.jwt.secret=...tu_secreto...
app.jwt.expiration=86400000
```

---

## 🎯 Workflow Típico

1. **Registrarse** → POST /api/auth/register
2. **Iniciar sesión** → POST /api/auth/login → Recibir token
3. **Crear reporte** → POST /api/reports (con token)
4. **Ver reportes** → GET /api/reports
5. **Voluntario actualiza** → PATCH /api/reports/{id}/status

---

## 🔗 Relaciones de BD

```
users (1) ────────────── (N) reports
                         │
                         ├─── (1) locations
                         │
                         ├─── (1) salvitas
                         │
                         └─── (N) images
```

---

## ✅ Validaciones Automáticas

- Email válido y único
- Contraseña mínimo 6 caracteres
- Campos no vacíos (@NotBlank)
- Latitud: -90 a 90
- Longitud: -180 a 180

---

## 📚 Documentación

- `GUIA_INSTALACION.md` - Completa
- `INICIO_RAPIDO.md` - Rápida
- `INDICE_ARCHIVOS.md` - Referencia
- `RESUMEN_PROYECTO.md` - Visión general

---

## 🎓 Aprender

### Buscar por concepto
- JWT → JwtTokenProvider.java
- Spring Security → SecurityConfig.java
- JPA → model/*.java
- REST → controller/*.java
- Lógica → service/*.java

---

## 🚨 Errores Comunes

```
401 Unauthorized → Token inválido o expirado
403 Forbidden → Permisos insuficientes
404 Not Found → Recurso no existe
409 Conflict → Email duplicado
400 Bad Request → Validación fallida
500 Internal Error → Revisar logs
```

---

**Última actualización**: Abril 2026  
**Version**: 1.0.0  
**Estado**: ✅ Production Ready
