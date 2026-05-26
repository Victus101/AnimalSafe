/**
 * AnimalSafe Mobile - Guía de Desarrollo
 * 
 * Este archivo contiene instrucciones de desarrollo, debugging, y próximos pasos.
 */

// ============================================================
// 📌 ESTRUCTURA DEL PROYECTO
// ============================================================

/*
src/
  ├── theme/
  │   ├── colors.ts          - Paleta de colores centralizada
  │   ├── spacing.ts         - Sistema de espaciado
  │   ├── typography.ts      - Sistema tipográfico
  │   └── index.ts           - Export centralizado
  │
  ├── services/
  │   ├── api.ts             - Cliente HTTP con Axios + JWT
  │   └── storage.ts         - Secure storage para tokens
  │
  ├── constants/
  │   ├── config.ts          - Configuración de app
  │   └── endpoints.ts       - Endpoints de API
  │
  ├── types/
  │   ├── auth.ts            - Interfaces de autenticación
  │   ├── report.ts          - Interfaces de reportes
  │   └── common.ts          - Tipos comunes
  │
  ├── utils/
  │   ├── logger.ts          - Logger utility
  │   └── errors.ts          - Error handling helpers
  │
  ├── hooks/
  │   └── useAuth.ts         - Custom hooks
  │
  ├── components/
  │   ├── Button.tsx         - Componente botón reutilizable
  │   ├── Card.tsx           - Componente card
  │   └── Loading.tsx        - Loading indicator
  │
  ├── store/
  │   └── authStore.ts       - (Placeholder) Zustand store
  │
  └── features/
      └── (Próximo) Feature-specific screens
*/

// ============================================================
// 🚀 CÓMO CORRER EL PROYECTO
// ============================================================

/*
1. Instalar dependencias:
   npm install

2. Iniciar desarrollo:
   npm start

3. Emulador/Dispositivo:
   - iOS:     npm run ios
   - Android: npm run android
   - Web:     npm run web

4. Lint:
   npm run lint
*/

// ============================================================
// 🔌 PRÓXIMOS PASOS - BACKEND CONNECTION
// ============================================================

/*
1. CREAR SERVICIO DE AUTENTICACIÓN

   Archivo: src/services/auth.ts
   
   import { apiService } from './api';
   import { StorageService } from './storage';
   import { RegisterCredentials, AuthResponse } from '@/types/auth';
   
   export class AuthService {
     async login(email: string, password: string) {
       const response = await apiService.post<AuthResponse>(
         '/api/auth/login',
         { email, password }
       );
       if (response.data) {
         await StorageService.setToken(response.data.token);
         await StorageService.setUser({
           id: response.data.userId,
           name: response.data.email,
           email: response.data.email,
           role: response.data.role,
         });
       }
       return response;
     }

     async register(data: RegisterCredentials) {
       const response = await apiService.post<AuthResponse>(
         '/api/auth/register',
         data
       );
       if (response.data) {
         await StorageService.setToken(response.data.token);
         await StorageService.setUser({...});
       }
       return response;
     }

     async logout() {
       await StorageService.clearAuth();
     }
   }

2. CREAR SERVICIO DE REPORTES

   Archivo: src/services/reports.ts
   
   - getReports()
   - getReportById(id)
   - getNearbyReports(lat, lon, radius)
   - createReport(data)
   - updateReportStatus(id, status)

3. CREAR PANTALLAS DE AUTH

   Archivos:
   - app/login.tsx
   - app/register.tsx
   - app/splash.tsx (check token on launch)

4. INTEGRAR CON LAYOUT PRINCIPAL

   Actualizar: app/_layout.tsx
   - Mostrar splash mientras se carga auth
   - Condicional: auth ? <Tabs/> : <Auth/>

*/

// ============================================================
// 🗺️ PRÓXIMOS PASOS - MAPA
// ============================================================

/*
1. INSTALAR REACT NATIVE MAPS

   npm install react-native-maps
   expo install react-native-maps

2. CREAR COMPONENTE DE MAPA

   Archivo: src/components/Map.tsx
   
   - Mostrar mapa centrado en ubicación del usuario
   - Pins para cada reporte
   - Clusters cuando hay muchos
   - Press pin → mostrar mini card
   - Styling con colores AnimalSafe

3. AGREGAR GEOLOCALIZACIÓN

   npm install expo-location
   
   - Pedir permiso en app/_layout.tsx
   - Usar en HomeScreen para center map
   - Calcular distancias

4. INTEGRAR EN HOME

   Reemplazar mapPlaceholder con componente real Map
*/

// ============================================================
// 🖼️ PRÓXIMOS PASOS - IMÁGENES
// ============================================================

/*
1. AGREGAR IMAGE PICKER

   npm install expo-image-picker

2. CREAR SERVICIO DE IMÁGENES

   Archivo: src/services/images.ts
   
   - pickImage()
   - compressImage()
   - uploadImage(file, reportId)

3. INTEGRAR EN REPORTE

   En app/report.tsx:
   - Agregar botón "Agregar foto"
   - Mostrar preview de imagen seleccionada
   - Upload cuando se crea el reporte

*/

// ============================================================
// 🔔 PRÓXIMOS PASOS - NOTIFICACIONES
// ============================================================

/*
1. PUSH NOTIFICATIONS

   npm install expo-notifications
   
   - Registrar device token en backend
   - Recibir notificaciones del server
   - Mostrar en pantalla Notificaciones

2. IN-APP NOTIFICATIONS

   - Implementar toast/snackbar
   - Errores, éxitos, info
*/

// ============================================================
// 🎮 DEBUGGING
// ============================================================

/*
1. LOGS EN CONSOLA

   Usar logger util:
   
   import { logger } from '@/src/utils/logger';
   
   logger.debug('mensaje', data);
   logger.info('mensaje');
   logger.warn('mensaje');
   logger.error('mensaje', error);

2. RED FLIPPER

   - Instalar Flipper
   - Debug network requests
   - Inspeccionar redux/state

3. REACT NATIVE DEBUGGER

   - npm install -g react-native-debugger
   - react-native-debugger

*/

// ============================================================
// 🧪 TESTING (PRÓXIMO)
// ============================================================

/*
1. SETUP JEST + TESTING LIBRARY

   npm install --save-dev jest @testing-library/react-native

2. ESCRIBIR TESTS

   Ejemplos:
   - services/api.test.ts
   - services/storage.test.ts
   - components/Button.test.tsx

3. COMANDO

   npm test
*/

// ============================================================
// 📦 BUILD PARA PRODUCCIÓN
// ============================================================

/*
1. ANDROID APK

   eas build --platform android

2. iOS IPA

   eas build --platform ios

3. APP STORE SETUP

   - Update app.json
   - iOS provisioning profiles
   - Android keystore
   - Versioning (app.json + build.gradle)

*/

// ============================================================
// 🎨 CUSTOMIZACIONES FUTURAS
// ============================================================

/*
1. AGREGAR GOOGLE FONTS

   npm install expo-font
   
   En app/_layout.tsx:
   const [fontsLoaded] = useFonts({
     'Inter': require('@/assets/fonts/Inter-Regular.ttf'),
     'Poppins': require('@/assets/fonts/Poppins-Bold.ttf'),
   });

2. DARK MODE

   Agregar en constants/config.ts
   Implementar en theme/colors.ts
   UI automáticamente adaptable

3. LOCALIZACIONES I18N

   npm install i18next
   
   Crear locales/es.json, locales/en.json
   Provider en app/_layout.tsx

4. ANALYTICS

   npm install firebase
   
   Setup en services/analytics.ts
   Track events importantes

*/

// ============================================================
// 💾 GIT WORKFLOW
// ============================================================

/*
1. COMMITS INICIALES

   git add .
   git commit -m "chore: initial base structure setup"

2. BRANCHES

   - main: production
   - dev: development
   - feature/* : features individuales

3. COMMITS PARA BACKEND

   git commit -m "feat: auth service integration"
   git commit -m "feat: reports API integration"
   git commit -m "feat: map implementation"

*/

// ============================================================
// ⚠️ COSAS A TENER EN CUENTA
// ============================================================

/*
1. ANDROID LOCALHOST

   Para conectar a localhost en Android emulator:
   Cambiar en src/constants/config.ts:
   LOCAL_HOST_ANDROID: 'http://10.0.2.2:8080'

2. HTTPS EN PRODUCCIÓN

   Cambiar en app/_layout.tsx:
   baseURL: __DEV__ ? LOCAL_HOST : 'https://api.animalsafe.com'

3. TOKEN REFRESH

   Implementar en api.ts interceptors
   Cuando token expira, request new con refresh token

4. SEGURIDAD

   - Nunca guardar token en AsyncStorage
   - Siempre usar Secure Store ✅ (ya implementado)
   - Validar inputs en formularios
   - Sanitizar respuestas de API

*/

// ============================================================
// 📚 RECURSOS
// ============================================================

/*
React Native:
- https://reactnative.dev/docs/getting-started
- https://reactnative.dev/docs/navigation/navigating-between-screens

Expo:
- https://docs.expo.dev/
- https://docs.expo.dev/get-started/create-a-project/

TypeScript:
- https://www.typescriptlang.org/docs/
- https://www.typescriptlang.org/docs/handbook/react.html

Axios:
- https://axios-http.com/docs/intro
- https://axios-http.com/docs/interceptors

Expo Router:
- https://docs.expo.dev/routing/introduction/

Secure Store:
- https://docs.expo.dev/versions/latest/sdk/securestore/

React Navigation:
- https://reactnavigation.org/docs/getting-started
*/

export const DEVELOPMENT_GUIDE = 'Para referencia durante desarrollo';
