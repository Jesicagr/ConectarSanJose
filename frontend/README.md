# Conectar San José — Frontend

Aplicación **Angular 21** (standalone) unificada que contiene el **sitio público** (agenda de actividades, áreas municipales, turismo) y el **panel administrativo** (gestión de actividades, sedes, áreas, contactos y usuarios).

## Stack

| Tecnología | Versión |
|---|---|
| Angular | 21.2 |
| TypeScript | ~5.9 |
| Tailwind CSS | 4.3 |
| Leaflet | 1.9 |
| RxJS | ~7.8 |
| Vitest | 4.0 |

## Servidor de Desarrollo

```bash
ng serve
```

Abrir en `http://localhost:4200/`. El proxy configurado en `proxy.conf.json` redirige las rutas `/auth/**` y `/api/**` a `http://localhost:8080` (backend).

## Build

```bash
ng build         # Producción → dist/conectar-angular/browser/
npm run preview  # Build + http-server con proxy
```

## Tests

```bash
ng test   # Vitest (unitarios)
ng e2e    # Playwright (E2E)
```

## Documentación Detallada

Ver [docFrontend.md](docFrontend.md) para estructura de rutas, servicios y endpoints consumidos.
