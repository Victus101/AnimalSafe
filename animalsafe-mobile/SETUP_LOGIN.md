# 🔐 AnimalSafe Login Screen - Implementation Guide

**Versión**: 1.0  
**Fecha**: 26 de Abril 2026  
**Estado**: Ready to test in development

---

## 📱 Lo que se implementó

Una pantalla de login hermosa, moderna y lista para producción con diseño premium.

### ✅ Features

- **Diseño Premium**
  - Fondo soft pastel (#F7F2F5)
  - Logo circular con icono corazón
  - Tarjeta blanca centrada con shadow suave
  - Botones con transiciones suaves

- **Validación Local**
  - Email format validation
  - Password length (mín 6 caracteres)
  - Error messages inline
  - Estados disabled durante loading

- **Componentes Reutilizables**
  - `StyledTextInput` - Input personalizado con icons
  - `Loading` - Indicador de carga
  - Auth Store (Zustand) - Estado global
  - Custom hooks (`useAuth`, `useLoginHandler`)

- **Preparado para Backend**
  - Estructura lista para JWT
  - Comentarios indicando dónde conectar API
  - `setAuthResponse()` captura respuesta de backend
  - Navegación automática a home tras login exitoso

---

## 🚀 Cómo Probar

### 1. Iniciar la app

```bash
npm start
# o
expo start
```

### 2. Ejecutar en emulator/dispositivo

```bash
# Android Emulator
npm run android

# iOS Simulator
npm run ios

# Web (para pruebas rápidas)
npm run web
```

### 3. Probar Login Screen

- La app abrirá en la pantalla de login
- Intenta hacer click en "Sign In" sin datos
- Verás validación de errores
- Intenta con:
  - Email: `test@example.com`
  - Password: `123456`
  
**Resultado**: Actualmente muestra "Backend not connected - Demo mode"

---

## 🔌 Conectar Backend (JWT)

### Paso 1: Descomenta la llamada API en `app/login.tsx`

En la función `handleLogin()`, busca el comentario:

```typescript
// TODO: Uncomment when connecting backend
/*
const apiService = new ApiService();
...
*/
```

### Paso 2: Descomenta el código

```typescript
const apiService = new ApiService();
const response = await apiService.post('/api/auth/login', {
  email,
  password,
});

if (response.data) {
  await setAuthResponse(response.data);
  // Navigate to home
  router.replace('/(tabs)');
}
```

### Paso 3: Configura tu backend URL

En `src/constants/config.ts`:

```typescript
export const API_CONFIG = {
  LOCAL_HOST: 'http://localhost:8080',          // Tu backend local
  LOCAL_HOST_ANDROID: 'http://10.0.2.2:8080',  // Android emulator
  PROD_HOST: 'https://api.animalsafe.com',      // Production
  // ...
};
```

### Paso 4: Asegura que tu backend esté corriendo

```bash
# En tu proyecto backend Spring Boot
./mvnw spring-boot:run
# o en Windows
mvnw.cmd spring-boot:run
```

### Paso 5: Prueba el login real

- Email y password deben ser válidos en tu backend
- Si es exitoso, verás automáticamente el home (mapa)
- El token se guardará en secure storage
- La próxima vez que abras la app, irá directo al home

---

## 📁 Archivos Creados/Modificados

### Creados
- `app/login.tsx` - Pantalla de login (350 líneas)
- `src/components/TextInput.tsx` - Input personalizado
- `src/store/authStore.ts` - Zustand auth state
- `SETUP_LOGIN.md` - Este archivo

### Modificados
- `app/_layout.tsx` - Agregada ruta login + hydrate auth
- `src/hooks/useAuth.ts` - Hooks mejorados
- `src/components/Loading.tsx` - Loading mejorado
- `package.json` - expo-linear-gradient agregado

### No modificados (aún)
- Home screen (tabs/index) - Aún con mock data, sin mapa real

---

## 🎨 Colores y Estilos

**Paleta de colores del login** (según Figma):

```typescript
// Soft pastel background
#F7F2F5

// Pink gradient button
#F48FB1 → #EC407A

// Text
Primary: #333333
Secondary: #666666
Tertiary: #999999
Inverse (white): #FFFFFF

// Status
Error: #FF8A80
Success: #B9F6CA

// Borders
#EDEDED

// Card background
#FFFFFF
```

---

## 🔑 Cómo Funciona el Flujo

```
App Inicia
    ↓
RootLayout (_layout.tsx) 
    ↓
Hydrate auth store desde storage
    ↓
¿Hay token en storage?
    ├─ SÍ → Mostrar home (tabs)
    └─ NO → Mostrar login screen
            ↓
            Usuario entra email + password
            ↓
            Validación local
            ↓
            POST /api/auth/login (backend)
            ↓
            ¿Respuesta válida?
                ├─ SÍ → setAuthResponse()
                │       ├─ Guarda token en storage
                │       ├─ Guarda user data
                │       ├─ Actualiza auth store
                │       └─ Navega a home
                └─ NO → Muestra error
```

---

## 🛠️ Troubleshooting

### ❌ "Cannot find module '@/src/...'"

**Solución**: Verifica que el proyecto tenga configurado los path aliases en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### ❌ "expo-linear-gradient not found"

**Solución**: Asegúrate de tener instalado:

```bash
npm install expo-linear-gradient
```

### ❌ "Cannot read property 'hydrate' of undefined"

**Solución**: Verifica que `authStore.ts` está correctamente implementado con Zustand.

### ❌ Backend devuelve 401

**Solución**: 
- Verifica credenciales
- Asegúrate que el backend está corriendo en la URL correcta
- Revisa que el endpoint `/api/auth/login` existe

### ❌ Token no se guarda

**Solución**: Verifica `StorageService` en `src/services/storage.ts`:

```typescript
// Debe tener estos métodos:
await StorageService.setToken(token);
await StorageService.getToken();
await StorageService.clearAuth();
```

---

## 📝 Próximos Pasos

1. **Implementar Register Screen** (`app/register.tsx`)
   - Mismo diseño que login
   - POST /api/auth/register

2. **Implementar Forgot Password** 
   - Flujo: email → código → nueva password

3. **Agregar React Native Maps**
   - Mostrar pins de reportes
   - Ubicación del usuario
   - Botón flotante "Reportar Salvita"

4. **Conectar GET /api/reports**
   - Cargar reportes en mapa
   - Mostrar pins con estado

5. **Implementar POST /api/reports**
   - Crear nuevo reporte desde app
   - Subir imágenes

---

## 💡 Tips de Desarrollo

- **Hot reload**: Guarda cambios y la app se actualiza automáticamente
- **DevTools**: Abre con `? → d` en terminal Expo
- **Storage debugging**: Usa `StorageService.getToken()` en console
- **Network debugging**: Activa Network tab en DevTools para ver requests

---

## 🎯 Checklist MVP Login

- [x] Pantalla de login hermosa
- [x] Validación de inputs
- [x] Loading state durante login
- [x] Error handling
- [x] Componentes reutilizables
- [x] Auth store con Zustand
- [x] Preparado para backend JWT
- [x] Navegación a home tras login exitoso
- [ ] Register screen
- [ ] Forgot password flow
- [ ] Login persistencia (recordar usuario)

---

## 📚 Referencias

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://github.com/pmndrs/zustand
- **Figma Design**: [Tu Figma AnimalSafe]

---

**¡Listo para probar!** 🚀

Si tienes problemas, revisa la sección de Troubleshooting arriba.
