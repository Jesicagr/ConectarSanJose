# Documentación del Frontend — Conectar San José

## Vista General

Aplicación **Angular 21** (standalone) unificada que contiene:
- **Sitio público** — Página principal con áreas municipales, agenda de actividades, turismo y contacto
- **Panel administrativo** — Gestión de actividades, sedes, áreas, contactos de emergencia y usuarios (requiere JWT)

Anteriormente existían tres proyectos separados (HTML estático, panel admin Angular y sitio público Angular) que se consolidaron en un solo frontend.

## Stack Tecnológico

| Tecnología | Versión |
|---|---|
| Angular | 21.2 |
| TypeScript | ~5.9 |
| Tailwind CSS | 4.3 |
| Leaflet | 1.9 |
| RxJS | ~7.8 |
| Vitest | 4.0 |
| Playwright | — |

## Estructura del Proyecto

```
frontend/
├── angular.json                 # Configuración build/serve
├── package.json                 # Dependencias y scripts
├── proxy.conf.json              # Proxy /auth/** y /api/** → localhost:8080
├── playwright.config.ts         # Config tests E2E
├── postcss.config.js            # PostCSS para Tailwind v4
├── tsconfig*.json               # TypeScript config
├── public/                      # Assets estáticos
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css                # Variables globales + Tailwind
    └── app/
        ├── app.ts / app.html / app.config.ts / app.routes.ts
        ├── components/
        │   ├── home/             # Página principal pública
        │   ├── agenda/           # Agenda semanal con filtro por día
        │   └── area/             # Detalle de área con actividades
        ├── login/                # Inicio de sesión
        ├── forgot-password/      # Solicitud de restablecimiento
        ├── recuperar-password/   # Restablecimiento de contraseña
        ├── admin/
        │   ├── layout/           # AdminLayout (sidebar + router-outlet)
        │   ├── pages/
        │   │   ├── dashboard/    # Métricas y actividades más visitadas
        │   │   ├── activities/   # CRUD de actividades
        │   │   ├── sedes/        # CRUD de sedes con mapa Leaflet
        │   │   ├── areas/        # CRUD de áreas
        │   │   ├── contacts/     # CRUD de contactos de emergencia
        │   │   └── usuarios/     # Gestión de usuarios (SUPER_ADMIN)
        │   └── shared/
        │       └── actividad-modal/  # Modal reutilizable de actividad
        ├── services/
        │   ├── actividad.service.ts
        │   ├── area.service.ts
        │   ├── sede.service.ts
        │   ├── contacto.service.ts
        │   ├── visita.service.ts
        │   ├── auth.service.ts
        │   └── auth.interceptor.ts
        ├── models/
        │   └── actividad.model.ts     # Interfaces: Actividad, Sede, Area,
        │                              #   HorarioSede, HorarioActividad,
        │                              #   TelefonoContacto, enum DiaSemana
        └── shared/
            ├── area-tones.ts          # Colores por área
            ├── date-format.pipe.ts    # Pipe de formato de fechas
            ├── link-utils.ts          # Utilidades para enlaces
            ├── logger.service.ts      # Servicio de logging
            └── toast.service.ts       # Notificaciones toast
```

## Configuración Angular

**`proxy.conf.json`** — Redirige `/auth/**` y `/api/**` a `http://localhost:8080` en desarrollo:

```json
{
  "/auth/**": { "target": "http://localhost:8080", "secure": false, "logLevel": "debug" },
  "/api/**":  { "target": "http://localhost:8080", "secure": false, "logLevel": "debug" }
}
```

## Rutas

| Ruta | Componente | Propósito |
|---|---|---|
| `/` | `HomePage` | Página principal pública (hero, áreas, agenda, emergencias, turismo) |
| `/login` | `LoginPage` | Inicio de sesión |
| `/forgot-password` | `ForgotPasswordPage` | Solicitar restablecimiento de contraseña |
| `/recuperar-password` | `RecuperarPasswordPage` | Restablecer contraseña con token |
| `/admin` | `AdminLayout` | Layout con sidebar |
| `/admin/dashboard` | `DashboardPage` | Métricas y actividades más visitadas |
| `/admin/activities` | `ActivitiesPage` | CRUD de actividades |
| `/admin/sedes` | `SedesPage` | CRUD de sedes con mapa Leaflet |
| `/admin/areas` | `AreasPage` | CRUD de áreas |
| `/admin/contactos` | `ContactsPage` | CRUD de contactos de emergencia |
| `/admin/usuarios` | `UsuariosPage` | Gestión de usuarios (solo SUPER_ADMIN) |

Todas las rutas usan lazy loading.

## Endpoints consumidos

| Endpoint | Método | Servicio |
|---|---|---|
| `/auth/login` | POST | `AuthService` |
| `/auth/forgot-password` | POST | `AuthService` |
| `/auth/reset-password` | POST | `AuthService` |
| `/api/actividades` | GET/POST | `ActividadService` |
| `/api/actividades/{id}` | GET/PUT/DELETE | `ActividadService` |
| `/api/actividades/paginated` | GET | `ActividadService` |
| `/api/actividades/area/{areaId}` | GET | `ActividadService` |
| `/api/actividades/count` | GET | `ActividadService` |
| `/api/areas` | GET/POST | `AreaService` |
| `/api/areas/{id}` | GET/PUT/DELETE | `AreaService` |
| `/api/sedes` | GET/POST | `SedeService` |
| `/api/sedes/{id}` | PUT/DELETE | `SedeService` |
| `/api/contactos` | GET/POST | `ContactoService` |
| `/api/contactos/{id}` | PUT/DELETE | `ContactoService` |
| `/api/visitas` | POST | `VisitaService` |
| `/api/visitas/stats` | GET | `VisitaService` |
| `/api/visitas/stats/actividades` | GET | `VisitaService` |

## Scripts disponibles

| Script | Comando |
|---|---|
| `npm start` | `ng serve` (puerto 4200, proxy a backend 8080) |
| `npm run build` | `ng build` (producción) |
| `npm run watch` | `ng build --watch --configuration development` |
| `npm test` | `ng test` (Vitest) |
| `npm run e2e` | `ng e2e` (Playwright) |
| `npm run preview` | Build + http-server con proxy |

## Flujo de Desarrollo

```bash
# 1. Iniciar backend (Spring Boot)
cd backend && mvn spring-boot:run  # → http://localhost:8080

# 2. Iniciar frontend
cd frontend
npm install
ng serve                           # → http://localhost:4200

# Login: admin@sanjose.com / admin123
```

Producción:
```bash
cd frontend
npm run build   # → dist/conectar-angular/browser/
```

## Notas

- No hay archivos `environment.ts`. Los endpoints se definen con URLs relativas y se proxyan en desarrollo.
- Leaflet se usa en el mapa de sedes (admin). El warning de ESM es esperado y no afecta la funcionalidad.
- El interceptor `auth.interceptor.ts` agrega automáticamente el header `Authorization: Bearer <token>` a las requests autenticadas.
