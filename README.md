# Conectar San José

Plataforma municipal de gestión y difusión de actividades, servicios y recursos de la ciudad de San José, Entre Ríos.

## Arquitectura

```
ConectarSanJose/
├── backend/                          # Spring Boot 3.5.14 + Java 21 + PostgreSQL (Supabase)
│   ├── src/main/java/.../backend/
│   │   ├── config/                   # Seguridad JWT, CORS, OpenAPI, DataSeeder
│   │   ├── controller/               # REST controllers (7)
│   │   ├── dto/                      # DTOs
│   │   ├── model/                    # JPA entities (8 + 2 enums)
│   │   ├── repository/               # Spring Data JPA
│   │   └── service/                  # Business logic (7 servicios)
│   └── src/main/resources/
│       └── application.properties
├── frontend/                         # Angular 21 unificado (sitio público + panel admin)
│   ├── src/app/
│   │   ├── components/               # home, agenda, area
│   │   ├── login/                    # Inicio de sesión
│   │   ├── admin/                    # Panel administrativo (layout + 6 páginas)
│   │   ├── services/                 # 7 servicios HTTP + interceptor JWT
│   │   └── models/                   # Interfaces TypeScript
│   └── proxy.conf.json               # Proxy a backend localhost:8080
├── MANUAL_DE_USUARIO.md              # Manual de usuario completo
└── start-all.bat                     # Inicia backend + frontend
```

## Inicio rápido

```bash
start-all.bat
# o manualmente:
# backend:    cd backend && mvn spring-boot:run  → http://localhost:8080
# frontend:   cd frontend && ng serve            → http://localhost:4200
```

## Documentación

- [Backend](backend/docBackend.md)
- [Frontend](frontend/docFrontend.md)
- [Manual de Usuario](MANUAL_DE_USUARIO.md)
