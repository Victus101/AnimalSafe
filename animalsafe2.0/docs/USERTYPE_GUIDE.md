# Guía de Uso - Sistema UserType

## Resumen de Cambios Implementados

Se extendió el sistema de autenticación para soportar `userType` (rol de aplicación):

### 1. Enum UserType (NUEVO)
**Ubicación:** `model/UserType.java`
```java
public enum UserType {
    VOLUNTARIO("Voluntario"),    // Usuario que se ofrece como voluntario
    RESCATISTA("Rescatista"),    // Usuario especializado en rescate
    ACOGIDA("Acogida");          // Usuario que proporciona acogida temporal
}
```

**Validación:** `UserType.fromString(value)` convierte string a enum con validación segura:
- Si es null o vacío → lanza `IllegalArgumentException`
- Si valor inválido → proporciona mensaje claro con valores válidos

---

### 2. Actualización User Entity
**Cambios:**
- ✅ Agregado campo `userType` (Enum)
- ✅ Marcado como `@NotNull`
- ✅ Persistido como STRING en BD
- ✅ El rol de seguridad (`role`) permanece IGUAL (USER, ADMIN, VOLUNTEER)

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
@NotNull(message = "El tipo de usuario es obligatorio")
private UserType userType;
```

---

### 3. Actualización RegisterRequest DTO
**Cambios:**
- ✅ Agregado campo `userType` (String)
- ✅ Validado con `@NotBlank`
- ✅ Será convertido a enum en el Service

```java
@NotBlank(message = "El tipo de usuario es obligatorio")
private String userType;
```

---

### 4. Actualización AuthService.register()
**Cambios:**
- ✅ Convierte `request.getUserType()` a enum con `UserType.fromString()`
- ✅ Si falla → lanza `BadRequestException` con mensaje claro
- ✅ Asigna `userType` al usuario creado
- ✅ El rol de seguridad se sigue asignando como `Role.USER`

```java
UserType userType;
try {
    userType = UserType.fromString(request.getUserType());
} catch (IllegalArgumentException e) {
    throw new BadRequestException(e.getMessage());
}

User newUser = User.builder()
    .name(request.getName())
    .email(request.getEmail())
    .password(passwordEncoder.encode(request.getPassword()))
    .role(User.UserRole.USER)          // ← Rol de seguridad
    .userType(userType)                 // ← Rol de aplicación
    .build();
```

---

### 5. Actualización AuthResponse DTO
**Cambios:**
- ✅ Agregado campo `userType` (String)
- ✅ Incluido en respuesta exitosa
- ✅ Método `success()` actualizado

```java
private String userType;

public static AuthResponse success(String token, Long userId, String email, 
                                   String role, String userType) {
    return AuthResponse.builder()
        .token(token)
        .type("Bearer")
        .userId(userId)
        .email(email)
        .role(role)
        .userType(userType)           // ← Incluido
        .message("Autenticación exitosa")
        .build();
}
```

---

### 6. Actualización Schema.sql
**Cambios:**
- ✅ Agregada columna `user_type` a tabla `users`
- ✅ Tipo ENUM con valores: VOLUNTARIO, RESCATISTA, ACOGIDA
- ✅ Valor default: VOLUNTARIO
- ✅ Índice creado para optimización

```sql
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
```

---

## Ejemplos de Uso

### Registro Exitoso
**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securePass123",
  "passwordConfirm": "securePass123",
  "userType": "VOLUNTARIO"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "juan@example.com",
  "role": "USER",
  "userType": "VOLUNTARIO",
  "message": "Autenticación exitosa"
}
```

---

### Registro con userType Inválido
**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "María García",
  "email": "maria@example.com",
  "password": "securePass456",
  "passwordConfirm": "securePass456",
  "userType": "INVALIDO"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Tipo de usuario inválido: INVALIDO. Valores válidos: VOLUNTARIO, RESCATISTA, ACOGIDA",
  "timestamp": "2026-04-27T16:45:00"
}
```

---

### Registro sin userType
**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Carlos López",
  "email": "carlos@example.com",
  "password": "securePass789",
  "passwordConfirm": "securePass789"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "El tipo de usuario es obligatorio",
  "timestamp": "2026-04-27T16:45:30"
}
```

---

## Diferencia: Role vs UserType

| Aspecto | Role (Seguridad) | UserType (Aplicación) |
|--------|------------------|----------------------|
| **Propósito** | Control de acceso y permisos de Spring Security | Clasificación de usuarios para lógica de negocio |
| **Valores** | USER, ADMIN, VOLUNTEER | VOLUNTARIO, RESCATISTA, ACOGIDA |
| **Ubicación** | Clase `User` → campo `role` | Clase `User` → campo `userType` |
| **Impacta** | JWT, autorización de endpoints | Comportamiento de la aplicación |
| **Ejemplo** | USER role puede registrarse y crear reportes | VOLUNTARIO user rescata animales |

---

## Notas Importantes

✅ **NO se modificó JWT logic** - Token sigue siendo igual
✅ **userType es DISTINTO de role** - No se mezclan conceptos
✅ **Validación segura** - `UserType.fromString()` proporciona errores claros
✅ **Índice en BD** - Optimizamos consultas por userType
✅ **Backward compatible** - Nuevos registros usan VOLUNTARIO por default

---

## Próximos Pasos (Opcionales)

1. Agregar filtros por `userType` en reportes
2. Crear endpoints para cambiar `userType` (requiere autenticación)
3. Agregar lógica de permisos basada en `userType`
4. Actualizar UserResponse para incluir `userType`
