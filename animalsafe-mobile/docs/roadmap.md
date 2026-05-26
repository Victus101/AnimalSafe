# ROADMAP.md

# AnimalSafe Mobile - Product Roadmap

Versión actual: MVP Development Phase  
Estado: Backend listo + UI base diseñada + Mobile iniciando

---

# 🎯 Visión General

AnimalSafe se desarrollará por fases claras.

Objetivo principal:

```text id="rm1"
lanzar rápido un MVP funcional
validar uso real
mejorar con feedback
escalar después

🐾 Meta del Producto

Permitir que cualquier persona pueda:

ver animales en peligro cerca
reportar casos rápidamente
seguir rescates
participar como comunidad
📌 Estrategia General

No sobreconstruir desde el inicio.

Primero:

producto usable

Después:

producto avanzado
🚀 FASE 1 — MVP MOBILE CORE
Estado actual: Inmediato

Duración estimada:

2 a 6 semanas
Objetivos

Construir primera app funcional conectada al backend.

Features MVP
Auth
Login
Register
Logout
Persistencia JWT
Home
Mapa principal
Pins de casos activos
Ubicación usuario
Botón Reportar Salvita
Reports
Crear reporte
Ver detalle caso
Estado del caso
Subir imágenes (fase posterior cercana)
Profile
Datos usuario
Mis reportes
Cerrar sesión
Notifications (simple)
pantalla placeholder inicial
KPI MVP

Usuario debe poder:

registrarse
loguearse
ver mapa
crear reporte
ver caso creado
🧱 FASE 2 — UX + FUNCIONALIDAD REAL
Después de MVP usable

Duración estimada:

2 a 4 semanas
Mejoras
UX
loaders
errores bonitos
empty states
animaciones suaves
mejor navegación
Reports
editar reporte
adjuntar imágenes reales
filtros por tipo animal
búsqueda
Mapa
clusters
distancia usuario
zoom inteligente
pins personalizados
Notifications
actualización de reportes
nuevo caso cercano
caso resuelto
🌎 FASE 3 — INFRA REAL / CLOUD

Duración estimada:

según presupuesto
Backend Infra
Deploy backend cloud
Dominio real
HTTPS
Logs reales
Monitoring
AWS Recomendado
EC2 o ECS
RDS MySQL
S3 imágenes
CloudWatch
Route53
Mobile Infra
build Android APK
build iOS futuro
analytics
crash reporting
🧠 FASE 4 — DIFERENCIACIÓN

Cuando MVP funcione bien.

Comunidad
ranking voluntarios
badges
niveles
perfil reputación
Gamificación
rescates completados
logros
racha ayuda semanal
Social
compartir rescates
feed comunidad
historias de salvitas
Marca
SalvitaDex
colección rescates
💰 FASE 5 — MONETIZACIÓN SANA

Nunca cobrar por rescatar.

Ideas válidas
suscripción premium soporte
donaciones
alianzas veterinarias
tiendas mascotas
seguros mascotas
sponsors éticos
🚫 Lo que NO hacer temprano
blockchain ahora
100 features
chat complejo inicial
10 roles raros
dashboard enterprise temprano
📱 Stack Mobile Objetivo
React Native
Expo
TypeScript
Axios
Secure Store
React Navigation
React Native Maps
🔌 Stack Backend Actual
Spring Boot
JWT
MySQL
Swagger
📆 Sprint Actual Recomendado
Sprint 1
crear proyecto Expo
navegación tabs
pantallas base
UI según Figma
Sprint 2
login real backend
guardar token
logout
Sprint 3
GET reports
mostrar pins
detalle caso
Sprint 4
POST report
subir caso desde app
📈 Métricas Importantes Futuras
usuarios registrados
reportes creados
casos resueltos
usuarios activos diarios
tiempo creación reporte
🎯 Definición de Éxito MVP

El MVP gana si una persona puede:

abrir app
iniciar sesión
ver mapa
reportar perro herido
guardar caso
verlo en pantalla
🤖 Instrucciones para IA / Agentes

Cuando ayudes en AnimalSafe:

priorizar MVP
no sobreingeniería
hacer features reales primero
pensar mobile-first
pensar velocidad de ejecución
🔥 Filosofía del Proyecto

Primero utilidad real.

Luego belleza.

Luego escala.

Luego negocio.