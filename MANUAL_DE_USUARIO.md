# Manual de Usuario

## Conectar San José

**Plataforma Municipal de Gestión y Difusión**

| Campo | Dato |
|---|---|
| **Versión del sistema** | 1.0.0 |
| **Versión del documento** | 1.0 |
| **Fecha** | Junio 2026 |
| **Autores** | Equipo de Desarrollo — Conectar San José |
| **Institución** | Municipalidad de San José, Entre Ríos |

---

## Índice

1. [Portada](#1-portada)
2. [Introducción](#2-introducción)
3. [Requisitos para utilizar el sistema](#3-requisitos-para-utilizar-el-sistema)
4. [Acceso al sistema](#4-acceso-al-sistema)
5. [Descripción de la interfaz](#5-descripción-de-la-interfaz)
6. [Funcionalidades del sistema](#6-funcionalidades-del-sistema)
   - 6.1. Sitio Público — Ciudadanos
     - 6.1.1. Visualizar áreas municipales
     - 6.1.2. Consultar la agenda de actividades
     - 6.1.3. Ver contacto de emergencia
     - 6.1.4. Sección de turismo
   - 6.2. Panel Administrativo
     - 6.2.1. Iniciar sesión
     - 6.2.2. Recuperar contraseña
     - 6.2.3. Panel de control (Dashboard)
     - 6.2.4. Gestionar actividades
     - 6.2.5. Gestionar sedes
     - 6.2.6. Gestionar áreas municipales
     - 6.2.7. Gestionar contactos de emergencia
     - 6.2.8. Gestionar usuarios (SÚPER ADMIN)
7. [Mensajes y errores frecuentes](#7-mensajes-y-errores-frecuentes)
8. [Preguntas frecuentes (FAQ)](#8-preguntas-frecuentes-faq)
9. [Cierre de sesión](#9-cierre-de-sesión)
10. [Contacto y soporte](#10-contacto-y-soporte)

---

## 1. Portada

### Conectar San José

**Versión:** 1.0.0  
**Fecha:** Junio 2026  
**Institución:** Municipalidad de San José, Entre Ríos  
**Sitio público:** [http://localhost:4200](http://localhost:4200)  
**Panel administrativo:** [http://localhost:4200/admin](http://localhost:4200/admin)

> Documento dirigido a ciudadanos y personal municipal que utilicen la plataforma Conectar San José.

---

## 2. Introducción

### 2.1 Objetivo del sistema

Conectar San José es una plataforma digital municipal que tiene como objetivo centralizar la difusión de actividades, servicios, áreas de coordinación y contactos de emergencia de la ciudad de San José, Entre Ríos. Permite a los ciudadanos acceder a información actualizada y al personal municipal gestionar los contenidos de forma sencilla desde un panel administrativo.

### 2.2 Alcance

El sistema abarca:

- **Sitio público:** Portal informativo para el ciudadano donde puede consultar áreas municipales, agenda de actividades, contactos de emergencia y atractivos turísticos.
- **Panel administrativo:** Sistema de gestión donde el personal autorizado puede crear, editar y eliminar actividades, sedes, áreas, contactos de emergencia y usuarios administrativos.

### 2.3 Público destinatario

Este manual está dirigido a dos perfiles:

1. **Ciudadanos:** Usuarios del sitio público que desean informarse sobre las actividades y servicios municipales.
2. **Administradores:** Personal municipal encargado de mantener actualizada la información en la plataforma.

### 2.4 Descripción general de la aplicación

La aplicación se compone de dos interfaces web integradas en una misma aplicación Angular:

- **Sitio público:** Página de inicio con secciones navegables mediante anclas. Incluye áreas municipales, agenda semanal de actividades, contactos de emergencia, sección de ayuda y promoción turística. No requiere autenticación.
- **Panel administrativo:** Accesible en `/admin` con inicio de sesión seguro mediante JWT. Incluye dashboard con métricas y módulos de gestión para actividades, sedes, áreas, contactos de emergencia y usuarios administrativos.

Ambos frentes se conectan a un backend central (puerto 8080) que provee una API RESTful y almacena los datos en una base de datos PostgreSQL.

---

## 3. Requisitos para utilizar el sistema

### 3.1 Navegadores compatibles

| Navegador | Versión mínima |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari (macOS/iOS) | 15+ |
| Opera | 76+ |

### 3.2 Requisitos de hardware

No se requieren requisitos de hardware especiales. Cualquier computadora de escritorio, notebook, tablet o smartphone con acceso a internet puede utilizar el sistema.

### 3.3 Conexión a internet

Se requiere conexión a internet para acceder tanto al sitio público como al panel administrativo.

### 3.4 Resolución mínima de pantalla

- **Escritorio:** 1024 × 768 px (recomendado 1366 × 768 px o superior)
- **Tablet:** 768 × 1024 px
- **Móvil:** 360 × 640 px

El sistema es completamente responsivo y se adapta a cualquier tamaño de pantalla.

---

## 4. Acceso al sistema

### 4.1 URL de acceso

| Interfaz | URL |
|---|---|
| Sitio público (ciudadanos) | [http://localhost:4200](http://localhost:4200) |
| Panel administrativo | [http://localhost:4200/admin](http://localhost:4200/admin) |

### 4.2 Proceso de inicio de sesión (Panel Administrativo)

1. Abrir el navegador e ingresar a [http://localhost:4200/admin](http://localhost:4200/admin) o presionar **Iniciar Sesión** en la página principal.
2. Se mostrará la pantalla de inicio de sesión.

   *[IMAGEN: Pantalla de inicio de sesión — formulario con campos de email y contraseña, logo de Conectar San José]*

3. Ingresar el correo electrónico y la contraseña proporcionados por el administrador del sistema.
4. Opcionalmente, marcar "Recordar sesión" para que el email se guarde en el navegador.
5. Hacer clic en el botón **Iniciar sesión**.

   *[IMAGEN: Formulario completado con botón Iniciar sesión]*

6. Si las credenciales son correctas, el sistema redirigirá al panel de control (Dashboard).
7. Si las credenciales son incorrectas, se mostrará un mensaje de error: "Email o contraseña incorrectos".

### 4.3 Recuperación de contraseña

1. En la pantalla de inicio de sesión, hacer clic en el enlace **"¿Olvidaste tu contraseña?"**.

   *[IMAGEN: Enlace "¿Olvidaste tu contraseña?" debajo del formulario de login]*

2. Ingresar el correo electrónico asociado a la cuenta.

   *[IMAGEN: Pantalla de recuperación con campo de email]*

3. Hacer clic en **Enviar enlace de recuperación**.
4. El sistema mostrará un mensaje de confirmación: "Revisa tu correo electrónico para continuar con el proceso."
5. Abrir el correo electrónico y hacer clic en el enlace de recuperación recibido.
6. El enlace lo redirigirá a la pantalla de restablecimiento de contraseña.
7. Ingresar la nueva contraseña (mínimo 6 caracteres) y confirmarla.

   *[IMAGEN: Pantalla de restablecimiento con campos Nueva contraseña y Confirmar contraseña]*

8. Hacer clic en **Restablecer contraseña**.
9. El sistema mostrará un mensaje de éxito y redirigirá al inicio de sesión.

> **Nota:** El enlace de recuperación expira después de 15 minutos. Si no se utiliza a tiempo, deberá solicitar uno nuevo.

### 4.4 Roles de usuario

El sistema cuenta con dos roles administrativos:

| Rol | Descripción |
|---|---|
| **ADMIN** | Puede gestionar actividades, sedes, áreas y contactos de emergencia. |
| **SUPER_ADMIN** | Posee todos los permisos de ADMIN y además puede gestionar otros usuarios administrativos (crear, listar, eliminar). |

**Cuentas predefinidas (entorno de desarrollo):**

| Email | Contraseña | Rol |
|---|---|---|
| `admin@sanjose.com` | `admin123` | SUPER_ADMIN |
| `jesiagr@gmail.com` | `admin1919` | SUPER_ADMIN |

---

## 5. Descripción de la interfaz

### 5.1 Sitio Público

El sitio público es una página de una sola vista con las siguientes secciones:

| Sección | Descripción |
|---|---|
| **Encabezado (Header)** | Logo de la municipalidad y menú de navegación con anclas: INICIO, ÁREAS, AGENDA. Incluye menú tipo hamburguesa en dispositivos móviles. |
| **Hero / Inicio** | Imagen destacada del monumento a San José con el lema "DESCUBRÍ lo que SAN JOSÉ tiene para vos". |
| **Ayuda** | Sección "No estás solo" con acceso rápido a líneas de emergencia y contención emocional. |
| **Áreas** | Grilla de botones para cada área municipal. Al hacer clic se abre un modal con información detallada. |
| **Agenda** | Calendario semanal de actividades. Incluye selector de día y tarjetas de actividad. |
| **Turismo** | Promoción de atractivos turísticos con enlace al portal oficial de turismo. |
| **Contacto** | Información de contacto de la municipalidad y redes sociales. |

*[IMAGEN: Vista completa del sitio público, mostrando las secciones principales]*

### 5.2 Panel Administrativo

El panel administrativo cuenta con un diseño de barra lateral (sidebar) y área de contenido principal.

| Elemento | Descripción |
|---|---|
| **Barra lateral** | Menú de navegación con iconos y etiquetas. En móviles se oculta y se muestra mediante un botón de hamburguesa. |
| **Encabezado de página** | Título de la sección actual y descripción. |
| **Área de contenido** | Espacio donde se renderiza la página activa (Dashboard, Actividades, Sedes, etc.). |
| **Notificaciones (Toast)** | Mensajes emergentes en la esquina inferior derecha que informan sobre el resultado de las operaciones. |

*[IMAGEN: Panel administrativo con barra lateral y dashboard]*

**Elementos de navegación:**

| Icono | Opción | Visibilidad |
|---|---|---|
| `dashboard` | Dashboard | ADMIN y SUPER_ADMIN |
| `calendar_today` | Actividades | ADMIN y SUPER_ADMIN |
| `location_on` | Sedes | ADMIN y SUPER_ADMIN |
| `apartment` | Áreas | ADMIN y SUPER_ADMIN |
| `contacts` | Contactos | ADMIN y SUPER_ADMIN |
| `manage_accounts` | Usuarios | Solo SUPER_ADMIN |

---

## 6. Funcionalidades del sistema

### 6.1 Sitio Público — Ciudadanos

#### 6.1.1 Visualizar áreas municipales

**Objetivo:** Consultar la información de las áreas de coordinación municipal.

**Pasos:**

1. Ingresar a [http://localhost:4200](http://localhost:4200).
2. Hacer clic en **ÁREAS** en el menú de navegación.
3. Seleccionar un área de la grilla (ej: Deportes, Cultura, Salud).

   *[IMAGEN: Grilla de botones de áreas municipales]*

4. Se abrirá una ventana modal con la siguiente información:
   - Nombre del área
   - Descripción
   - Persona referente
   - Dirección
   - Teléfono(s)
   - Correo electrónico
   - Redes sociales
   - Sitio web
   - Horario de atención
   - Actividades asociadas

   > Los teléfonos, direcciones, correos electrónicos y sitios web son enlaces interactivos. Un clic en un teléfono inicia una llamada o abre WhatsApp (según corresponda); la dirección abre Google Maps; el email abre el cliente de correo.

   *[IMAGEN: Modal con detalle de un área municipal]*

**Resultado esperado:** El ciudadano obtiene información completa del área seleccionada, incluyendo datos de contacto y actividades relacionadas.

#### 6.1.2 Consultar la agenda de actividades

**Objetivo:** Visualizar las actividades programadas para un día específico.

**Pasos:**

1. Ingresar a [http://localhost:4200](http://localhost:4200).
2. Hacer clic en **AGENDA** en el menú de navegación.
3. Seleccionar un día de la semana en el selector horizontal.

   *[IMAGEN: Selector de día con actividades visibles debajo]*

4. Las tarjetas de actividad mostrarán:
   - Título de la actividad
    - Lugar (sede) con enlace a Google Maps
   - Descripción breve
   - Persona encargada
   - Teléfono de contacto (llamada o WhatsApp según el ícono 💬 o 📞)
   - Horario

   *[IMAGEN: Tarjetas de actividad en la agenda]*

5. Para ver más detalles, hacer clic en una tarjeta de actividad.
6. Se abrirá un modal con la información completa de la actividad.

   *[IMAGEN: Modal de detalle de actividad]*

**Resultado esperado:** El ciudadano visualiza las actividades del día seleccionado con toda la información necesaria.

#### 6.1.3 Ver contactos de emergencia

**Objetivo:** Acceder rápidamente a números de emergencia y líneas de ayuda.

**Pasos:**

1. En la sección "No estás solo" del inicio, hacer clic en **"Necesito ayuda"**.

   *[IMAGEN: Sección "No estás solo" con botón "Necesito ayuda"]*

2. Se abrirá un panel inferior con los siguientes contactos:
   - Salud Mental: 0800-777-2100 (24 hs)
   - Niñez y Familia: 3447-146499 (24 hs)
   - Mujeres San José: 3447-438343 (Género/Diversidad)

   > Los números de emergencia son enlaces directos: un clic inicia la llamada telefónica desde el dispositivo.

   *[IMAGEN: Panel de contactos de emergencia]*

**Resultado esperado:** El ciudadano accede de forma rápida a líneas de ayuda críticas.

#### 6.1.4 Sección de turismo

**Objetivo:** Conocer los atractivos turísticos de San José.

**Pasos:**

1. Desplazarse hacia la sección de turismo en la página principal.
2. Visualizar las tarjetas promocionales de cada atractivo.
3. Hacer clic en el enlace para visitar el portal oficial de turismo.

**Resultado esperado:** El ciudadano se informa sobre opciones turísticas y puede acceder a más información.

---

### 6.2 Panel Administrativo

#### 6.2.1 Iniciar sesión

Véase sección [4.2 Proceso de inicio de sesión](#42-proceso-de-inicio-de-sesión-panel-administrativo).

#### 6.2.2 Recuperar contraseña

Véase sección [4.3 Recuperación de contraseña](#43-recuperación-de-contraseña).

#### 6.2.3 Panel de control (Dashboard)

**Objetivo:** Visualizar métricas clave y acceder rápidamente a las actividades.

**Pasos:**

1. Al iniciar sesión, el sistema redirige automáticamente al Dashboard.
2. Observar las tarjetas de métricas en la parte superior:
   - **Actividades Totales:** Muestra la cantidad total de actividades registradas.
   - **En Revisión:** Cantidad de actividades pendientes de revisión.
   - **Visitas Hoy:** Estadísticas de visitas del día, la semana y totales.

   *[IMAGEN: Tarjetas de métricas del dashboard]*

3. Debajo de las métricas, se encuentra la sección **"Más Visitadas"** con un ranking visual de las actividades más populares.

   *[IMAGEN: Ranking de actividades más visitadas con barras de progreso]*

4. Utilizar los filtros por categoría para visualizar actividades de un área específica.

   *[IMAGEN: Filtros por categoría en el dashboard]*

5. Utilizar el campo de búsqueda para encontrar actividades por título, lugar o categoría.
6. En el listado de actividades, usar el menú de tres puntos para:
   - **Ver detalle:** Abre el modal en modo visualización.
   - **Editar:** Abre el modal para modificar la actividad.
   - **Eliminar:** Elimina la actividad luego de confirmar.

   *[IMAGEN: Menú de acciones en una tarjeta de actividad]*

**Resultado esperado:** El administrador obtiene una visión general del estado del sistema y puede acceder rápidamente a cualquier actividad.

#### 6.2.4 Gestionar actividades

**Objetivo:** Crear, editar, visualizar y eliminar actividades municipales.

**Crear una actividad:**

1. En la barra lateral, hacer clic en **Actividades**.
2. Hacer clic en el botón **"Nueva Actividad"**.

   *[IMAGEN: Página de actividades con botón "Nueva Actividad"]*

3. Completar el formulario con los siguientes datos:
   - **Título** (obligatorio)
   - **Descripción corta**
   - **Descripción completa**
   - **Sede** (lugar donde se realiza)
   - **Áreas** (una o más áreas municipales relacionadas)
   - **Fecha de inicio** (obligatorio)
   - **Fecha de fin** (opcional)
   - **Horarios** (día de semana, hora inicio, hora fin)
   - **Encargado**
   - **Teléfono de contacto**
   - **Estado:** Confirmado / En Revisión / Cancelado
   - **Repetir todo el año** (para actividades permanentes)

   *[IMAGEN: Formulario de creación de actividad]*

4. Hacer clic en **Guardar**.
5. El sistema mostrará un mensaje de confirmación y la actividad aparecerá en el listado.

**Editar una actividad:**

1. En el listado de actividades, hacer clic en el ícono de tres puntos y seleccionar **Editar**.
2. Modificar los campos necesarios en el formulario.
3. Hacer clic en **Guardar**.
4. El sistema mostrará un mensaje de confirmación.

**Eliminar una actividad:**

1. En el listado, hacer clic en el ícono de tres puntos y seleccionar **Eliminar**.
2. Confirmar la eliminación en el diálogo de confirmación.
3. La actividad se eliminará y desaparecerá del listado.

**Resultado esperado:** El administrador puede mantener actualizada la agenda de actividades municipales.

#### 6.2.5 Gestionar sedes

**Objetivo:** Administrar los lugares o espacios donde se realizan las actividades.

**Crear una sede:**

1. En la barra lateral, hacer clic en **Sedes**.
2. Hacer clic en el botón **"Nueva Sede"**.

   *[IMAGEN: Página de sedes con botón "Nueva Sede"]*

3. Completar el formulario:
   - **Nombre** (obligatorio)
   - **Descripción**
   - **Dirección**
   - **Teléfono**
   - **WhatsApp** (marcar si el teléfono tiene WhatsApp)
   - **Icono** (seleccionar entre las opciones disponibles)
   - **Horarios:** Agregar rangos de día y hora (ej: Lunes a Viernes de 08:00 a 16:00)
   - **Ubicación:** Hacer clic en el mapa para colocar un marcador o ingresar coordenadas manualmente.

   *[IMAGEN: Formulario de creación de sede con mapa]*

4. Hacer clic en **Guardar**.
5. El sistema mostrará un mensaje de confirmación.

> En las tarjetas del listado, el número de teléfono de cada sede es un enlace interactivo: si está marcado como WhatsApp se abrirá `wa.me/…`; de lo contrario iniciará una llamada `tel:…`.

**Ver en el mapa:**

1. En la vista de grilla, hacer clic en el botón **"Ver en mapa"**.
2. El mapa se centrará en la ubicación de la sede seleccionada.
3. Alternar entre **Vista Grilla** y **Vista Mapa** usando los botones de alternancia.

   *[IMAGEN: Mapa con marcadores de sedes]*

**Geocodificar direcciones:**

1. Hacer clic en el botón **"Geocodificar Pendientes"** para buscar automáticamente las coordenadas de aquellas sedes que no tengan ubicación asignada.

**Resultado esperado:** El administrador gestiona los espacios físicos donde se desarrollan las actividades municipales.

#### 6.2.6 Gestionar áreas municipales

**Objetivo:** Administrar las áreas de coordinación municipal.

**Crear un área:**

1. En la barra lateral, hacer clic en **Áreas**.
2. Hacer clic en el botón **"Nueva Área"**.

   *[IMAGEN: Página de áreas con botón "Nueva Área"]*

3. Completar el formulario:
   - **Nombre** (obligatorio)
   - **Descripción**
   - **Referente** (persona a cargo)
   - **Dirección**
   - **Teléfono**
   - **Etiqueta del teléfono** (ej: "Atención al público")
   - **WhatsApp** (marcar si corresponde)
   - **Correo electrónico**
   - **Redes sociales**
   - **Sitio web**
   - **Horario de atención**
   - **Icono** (seleccionar entre las opciones disponibles)

   *[IMAGEN: Formulario de creación de área municipal]*

4. Hacer clic en **Guardar**.
5. El sistema mostrará un mensaje de confirmación.

**Resultado esperado:** El administrador mantiene actualizada la información de las áreas municipales que se muestran en el sitio público.

#### 6.2.7 Gestionar contactos de emergencia

**Objetivo:** Administrar los números y datos de contacto de emergencia.

**Crear un contacto:**

1. En la barra lateral, hacer clic en **Contactos**.
2. Hacer clic en el botón **"Nuevo Contacto"**.

   *[IMAGEN: Página de contactos con botón "Nuevo Contacto"]*

3. Completar el formulario:
   - **Nombre de la institución** (obligatorio)
   - **Teléfono(s):** Agregar uno o más números, indicando si tienen WhatsApp.
   - **Descripción**
   - **Categoría:** Seguridad / Salud / Servicios / Emergencia
   - **Icono** (seleccionar entre las opciones disponibles)
   - **Orden de prioridad** (determina el orden de visualización)

   *[IMAGEN: Formulario de creación de contacto de emergencia]*

4. Hacer clic en **Guardar**.
5. El sistema mostrará un mensaje de confirmación.

**Filtrar por categoría:**

1. Utilizar los chips de filtro: **Todos**, **Seguridad**, **Salud**, **Servicios**, **Emergencia**.

   *[IMAGEN: Chips de filtro de categoría en la página de contactos]*

**Resultado esperado:** El administrador gestiona los contactos de emergencia visibles para los ciudadanos.

#### 6.2.8 Gestionar usuarios (SÚPER ADMIN)

**Objetivo:** Administrar las cuentas de usuario del panel administrativo.

> **Nota:** Esta funcionalidad solo está disponible para usuarios con rol **SUPER_ADMIN**.

**Crear un usuario:**

1. En la barra lateral, hacer clic en **Usuarios**.

   *[IMAGEN: Página de usuarios con formulario de creación y tabla de usuarios existentes]*

2. Completar el formulario:
   - **Email** (obligatorio)
   - **Contraseña** (mínimo 6 caracteres)
   - **Rol:** ADMIN o SUPER_ADMIN

3. Hacer clic en **Crear Usuario**.
4. El sistema mostrará un mensaje de confirmación y el nuevo usuario aparecerá en la tabla.

**Eliminar un usuario:**

1. En la tabla de usuarios, hacer clic en el botón **Eliminar** junto al usuario correspondiente.
2. Confirmar la eliminación.

> **Importante:** No es posible eliminar la propia cuenta.

**Resultado esperado:** El SUPER_ADMIN puede gestionar quiénes tienen acceso al panel administrativo y con qué nivel de permisos.

---

## 7. Mensajes y errores frecuentes

| Mensaje | Causa | Solución |
|---|---|---|
| "Email o contraseña incorrectos" | Credenciales inválidas | Verificar que el email y la contraseña sean correctos. Usar la opción "¿Olvidaste tu contraseña?" si es necesario. |
| "Error de conexión" | Sin conexión a internet o el servidor no está disponible | Verificar la conexión a internet. Contactar al administrador si el problema persiste. |
| "Campo obligatorio" | No se completó un campo requerido | Revisar el formulario y completar todos los campos marcados como obligatorios. |
| "La contraseña debe tener al menos 6 caracteres" | Contraseña demasiado corta | Ingresar una contraseña de 6 o más caracteres. |
| "Las contraseñas no coinciden" | Los campos de nueva contraseña y confirmación no son iguales | Verificar que ambas contraseñas sean idénticas. |
| "El enlace de recuperación ha expirado" | Pasaron más de 15 minutos desde que se solicitó | Solicitar un nuevo enlace de recuperación. |
| "Error al eliminar la actividad" | La actividad no se pudo eliminar | Intentar nuevamente. Si el error persiste, contactar al administrador. |
| "No se encontraron actividades" | No hay actividades que coincidan con los filtros aplicados | Limpiar los filtros o modificar los criterios de búsqueda. |
| "Error al guardar" | Problema de conexión o datos inválidos | Verificar los datos ingresados e intentar nuevamente. |
| "Token inválido" | El enlace de recuperación es incorrecto o ya fue usado | Solicitar un nuevo enlace de recuperación. |

---

## 8. Preguntas frecuentes (FAQ)

### 8.1 ¿Cómo recupero mi contraseña?

Ir a la pantalla de inicio de sesión, hacer clic en "¿Olvidaste tu contraseña?", ingresar el email y seguir las instrucciones enviadas al correo electrónico. El enlace expira en 15 minutos.

### 8.2 ¿Cómo modifico mis datos?

Actualmente, los datos del perfil de administrador no pueden modificarse desde la interfaz. Contactar al SUPER_ADMIN del sistema para realizar cambios.

### 8.3 ¿Cómo agrego una actividad que se repite todas las semanas?

Al crear o editar una actividad, marcar la opción **"Repetir todo el año"** y definir los horarios con los días de la semana correspondientes.

### 8.4 ¿Cómo agrego varios teléfonos a un contacto de emergencia?

En el formulario de creación/edición de contactos, utilizar el botón **"Agregar teléfono"** para añadir múltiples números. Cada número puede indicar si tiene WhatsApp.

### 8.5 ¿Por qué no veo la opción "Usuarios" en el menú?

La opción "Usuarios" solo es visible para administradores con rol SUPER_ADMIN. Si necesitas este permiso, contacta al administrador del sistema.

### 8.6 ¿Cómo sé qué actividades están pendientes de revisión?

En el Dashboard, la tarjeta **"En Revisión"** muestra la cantidad de actividades en ese estado. También puedes filtrar por estado en el listado de actividades.

### 8.7 ¿Las visitas a las actividades se cuentan más de una vez por persona?

No. El sistema utiliza `sessionStorage` del navegador para registrar una sola visita por actividad por sesión. Si el usuario cierra y vuelve a abrir el navegador, se contará una nueva visita.

### 8.8 ¿Puedo eliminar una cuenta de administrador?

Solo un SUPER_ADMIN puede eliminar cuentas de administrador desde la sección **Usuarios**. No es posible eliminar la propia cuenta.

---

## 9. Cierre de sesión

**Objetivo:** Salir del panel administrativo de forma segura.

**Pasos:**

1. En la barra lateral del panel administrativo, ubicar el perfil de usuario en la parte inferior.

   *[IMAGEN: Perfil de usuario con botón de cerrar sesión]*

2. Hacer clic en el botón **"Cerrar sesión"** (ícono de salida).
3. El sistema eliminará el token de autenticación del navegador y redirigirá a la pantalla de inicio de sesión.

> **Importante:** Siempre cerrar sesión al finalizar el trabajo, especialmente en computadoras compartidas.

---

## 10. Contacto y soporte

Para consultas, reporte de errores o solicitudes de soporte técnico:

| Canal | Información |
|---|---|
| **Correo electrónico** | contacto@sanjose.gob.ar |
| **Teléfono** | (03447) 438354 |
| **Dirección** | Centenario 2180, San José, Entre Ríos |
| **Facebook** | Municipalidad de San José |
| **Instagram** | @municipiosanjose |
| **Horarios de atención** | Lunes a viernes de 07:00 a 13:00 |

---

*Fin del documento — Manual de Usuario v1.0 — Conectar San José*

---

### Control de versiones del documento

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Junio 2026 | Versión inicial del manual. |
| 1.1 | Junio 2026 | Se actualizan URLs de acceso (unified app). Se agrega documentación de enlaces interactivos (teléfonos, WhatsApp, direcciones, emails, sitios web). Se unifican las secciones de interfaz pública y administrativa. |
