# Documentación del Frontend — Conectar San José

## Vista General

El frontend es una **aplicación Angular 21** unificada que contiene:
- **Sitio público** — Página principal con áreas municipales, agenda de actividades, turismo y contacto
- **Panel administrativo** — Gestión de actividades, sedes, áreas, contactos y usuarios (requiere autenticación JWT)

Todo el código fuente está en `frontend/`. Anteriormente existían tres proyectos separados (sitio estático HTML, panel admin Angular y sitio público Angular) que se consolidaron en uno solo.

## Stack Tecnológico

| Tecnología | Versión |
|---|---|
| Angular | 21.2 |
| TypeScript | 5.9 |
| Tailwind CSS | 4.3 |
| Leaflet | 1.9 |
| RxJS | 7.8 |

## Estructura del Proyecto

```
frontend/
├── angular.json              # Configuración del build/serve
├── package.json               # Dependencias y scripts
├── proxy.conf.json            # Proxy para /auth/** y /api/** → localhost:8080
├── playwright.config.ts       # Config de tests E2E
├── postcss.config.js          # Config PostCSS para Tailwind v4
├── tsconfig.json              # TypeScript config
├── tsconfig.app.json
├── tsconfig.spec.json
├── public/                    # Assets estáticos (imágenes, íconos)
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css             # Variables globales + Tailwind
│   └── app/
│       ├── app.ts / app.html / app.config.ts / app.routes.ts
│       ├── components/
│       │   ├── home/          # Página principal pública
│       │   ├── agenda/        # Agenda de actividades con filtro por día
│       │   └── area/          # Detalle de área con actividades
│       ├── login/             # Inicio de sesión
│       ├── forgot-password/   # Solicitud de restablecimiento
│       ├── recuperar-password/# Restablecimiento de contraseña
│       ├── admin/
│       │   ├── layout/        # AdminLayout (sidebar + router-outlet)
│       │   ├── pages/
│       │   │   ├── dashboard/ # Panel principal con métricas y filtros
│       │   │   ├── activities/# CRUD de actividades
│       │   │   ├── sedes/     # CRUD de sedes con mapa Leaflet
│       │   │   ├── areas/     # CRUD de áreas temáticas
│       │   │   ├── contacts/  # CRUD de contactos útiles
│       │   │   └── usuarios/  # Gestión de usuarios
│       │   └── shared/
│       │       └── actividad-modal/  # Modal reutilizable para actividades
│       ├── services/
│       │   ├── actividad.service.ts
│       │   ├── area.service.ts
│       │   ├── sede.service.ts
│       │   ├── contacto.service.ts
│       │   ├── visita.service.ts
│       │   ├── auth.service.ts
│       │   └── auth.interceptor.ts
│       ├── models/
│       │   └── actividad.model.ts
│       └── shared/
│           ├── area-tones.ts
│           ├── date-format.pipe.ts
│           ├── toast.service.ts
│           └── logger.service.ts
└── e2e/                      # Tests end-to-end
```

## Configuración Angular

**`proxy.conf.json`**: Redirige `/auth/**` y `/api/**` a `http://localhost:8080` para desarrollo local.

```json
{
  "/auth/**": { "target": "http://localhost:8080", "secure": false, "logLevel": "debug" },
  "/api/**":  { "target": "http://localhost:8080", "secure": false, "logLevel": "debug" }
}
```

## Rutas

| Ruta | Componente | Propósito |
|---|---|---|
| `/` | `HomePage` | Página principal pública (hero, áreas, agenda, turismo, contacto) |
| `/login` | `LoginPage` | Inicio de sesión |
| `/forgot-password` | `ForgotPasswordPage` | Solicitar restablecimiento |
| `/recuperar-password` | `RecuperarPasswordPage` | Restablecer contraseña |
| `/admin` | `AdminLayout` | Layout con sidebar |
| `/admin/dashboard` | `DashboardPage` | Panel principal |
| `/admin/activities` | `ActivitiesPage` | Gestión de actividades |
| `/admin/sedes` | `SedesPage` | Gestión de sedes |
| `/admin/areas` | `AreasPage` | Gestión de áreas |
| `/admin/contactos` | `ContactsPage` | Gestión de contactos |
| `/admin/usuarios` | `UsuariosPage` | Gestión de usuarios |

Todas las rutas usan lazy loading.

## Endpoints consumidos

| Endpoint | Método | Servicio |
|---|---|---|
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
| `/auth/login` | POST | `AuthService` |
| `/auth/forgot-password` | POST | `AuthService` |
| `/auth/reset-password` | POST | `AuthService` |

## Scripts disponibles

| Script | Comando |
|---|---|
| `npm start` | `ng serve` (puerto 4200, proxy a backend 8080) |
| `npm run build` | `ng build` (producción) |
| `npm run watch` | `ng build --watch --configuration development` |
| `npm test` | `ng test` (Vitest) |
| `npm run preview` | Build + http-server con proxy |

## Flujo de Desarrollo

```bash
# 1. Iniciar backend (Spring Boot) en puerto 8080
# 2. Instalar dependencias
cd frontend
npm install
# 3. Iniciar frontend
ng serve  # http://localhost:4200
# 4. Login: admin@sanjose.gob.ar
```

Para producción:
```bash
cd frontend
npm run build  # Genera dist/conectar-angular/browser/
```

## Notas

- No hay archivos `environment.ts`. Los endpoints se definen directamente en los servicios con URLs relativas proxyadas.
- Leaflet se usa en el mapa de sedes (admin). El warning de ESM es esperado y no afecta la funcionalidad.
