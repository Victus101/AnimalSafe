# 🚀 GUÍA RÁPIDA - AnimalSafe Backend

## Inicio Rápido (5 minutos)

### 1️⃣ Asegurarse que MySQL esté corriendo

```bash
# Windows
mysql -u root -p

# Conectar con contraseña: lana3045
```

### 2️⃣ Crear la base de datos

```bash
# Opción A: Ejecutar el script
mysql -u root -p < src/main/resources/schema.sql

# Opción B: Crear manualmente
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS animal_safe;"
```

### 3️⃣ Compilar el proyecto

```bash
# Windows
.\mvnw.cmd clean compile

# Linux/macOS
./mvnw clean compile
```

### 4️⃣ Ejecutar la aplicación

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

✅ **Listo!** - La aplicación estará en **http://localhost:8080**

---

## 📝 Comandos Útiles

### Maven

```bash
# Compilar
.\mvnw.cmd clean compile

# Ejecutar tests
.\mvnw.cmd test

# Crear JAR
.\mvnw.cmd clean package

# Ejecutar JAR
java -jar target/animalsafe-0.0.1-SNAPSHOT.jar

# Ver dependencias
.\mvnw.cmd dependency:tree

# Actualizar dependencias
.\mvnw.cmd versions:display-dependency-updates
```

### Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Usar la base de datos
USE animal_safe;

# Ver tablas
SHOW TABLES;

# Ver estructura de tabla
DESCRIBE users;

# Ver usuarios
SELECT * FROM users;

# Ver reportes
SELECT * FROM reports;
```

---

## 🧪 Probar la API

### 1. Registrarse

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@test.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### 2. Copiar el token JWT de la respuesta

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  ...
}
```

### 3. Usar el token en solicitudes protegidas

```bash
# Reemplaza <TOKEN> con el token recibido
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Crear un reporte

```bash
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Perro perdido",
    "description": "Perro pequeño, color café",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "address": "Bogotá, Colombia",
    "animalType": "dog",
    "animalCondition": "lost",
    "animalDescription": "Raza Shih Tzu"
  }'
```

---

## 🐛 Solucionar Problemas

| Problema | Solución |
|----------|----------|
| **Puerto 8080 en uso** | Cambiar en `application.properties`: `server.port=8081` |
| **MySQL no conecta** | Verificar usuario/contraseña en `application.properties` |
| **"Table doesn't exist"** | Ejecutar el script SQL o esperar a que Hibernate lo cree |
| **Error al compilar** | Ejecutar `.\mvnw.cmd clean` y volver a intentar |
| **JWT inválido** | Asegurarse de enviar: `Authorization: Bearer <token>` |

---

## 📊 Estructura del Proyecto

```
animalsafe2.0/
├── src/main/java/com/animalsafe20/animalsafe/
│   ├── controller/          ← Endpoints REST
│   ├── service/             ← Lógica de negocio
│   ├── repository/          ← Acceso a BD
│   ├── model/               ← Entidades JPA
│   ├── dto/                 ← DTOs de solicitud/respuesta
│   ├── security/            ← JWT y filtros
│   ├── config/              ← Configuraciones
│   ├── exception/           ← Excepciones personalizadas
│   └── util/                ← Utilidades
├── src/main/resources/
│   ├── application.properties   ← Configuración
│   └── schema.sql               ← SQL inicial
├── pom.xml                      ← Dependencias Maven
└── GUIA_INSTALACION.md          ← Documentación completa
```

---

## 🔑 Credenciales por Defecto (Pruebas)

```
Email: admin@animalsafe.com
Password: password123
Role: ADMIN
```

*(Nota: Estos datos solo aparecerán si ejecutas el script SQL con datos iniciales)*

---

## 📚 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/users/{id}` | Obtener usuario |
| GET | `/api/reports` | Listar reportes |
| POST | `/api/reports` | Crear reporte |
| GET | `/api/reports/{id}` | Obtener reporte |
| PATCH | `/api/reports/{id}/status` | Cambiar estado |
| GET | `/api/reports/nearby` | Reportes cercanos |
| POST | `/api/images` | Subir imagen |

---

## ⚙️ Configuración Importante

### application.properties

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/animal_safe
spring.datasource.username=root
spring.datasource.password=lana3045

# JWT
app.jwt.secret=MiSecretoMuySuperSecretoAnimalSafeSystemProyecto2026Masde32caracteres
app.jwt.expiration=86400000

# Puerto
server.port=8080
```

---

## 🆘 Soporte

Si encuentras problemas:

1. ✅ Verifica que MySQL esté corriendo
2. ✅ Verifica las credenciales en `application.properties`
3. ✅ Ejecuta `.\mvnw.cmd clean` y vuelve a intentar
4. ✅ Revisa los logs en la consola

---

**¡Listo para empezar! 🎉**
