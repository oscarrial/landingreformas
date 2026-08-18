# KOFLAT — captación de leads de reformas en Madrid

Activo independiente de captación de leads de reformas residenciales en
Madrid. Genera tráfico → lead → lead cualificado → presupuesto → venta →
comisión, con atribución first-party, formulario cualificador multi-paso y
panel admin.

> La marca, el dominio y la identidad visual son propios e independientes del
> proveedor operativo (actualmente NEXO GIR), que nunca aparece públicamente.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript estricto
- Tailwind CSS v4
- Zod (validación server-side)
- PostgreSQL vía `postgres.js` (serverless-friendly). Sin `DATABASE_URL` se
  usa un adaptador en memoria para desarrollo local (¡se pierden datos!).
- Sin librerías de animación ni componentes pesados: CSS + Server Components.

## Requisitos

- Node.js 20.9+ (recomendado 22+)
- (Producción) una base de datos PostgreSQL: Supabase, Neon, RDS, Vercel…

## Instalación y desarrollo

```bash
npm install
cp .env.example .env.local   # rellena los valores
npm run dev                  # http://localhost:3000
```

Scripts:

| Comando            | Acción                            |
| ------------------ | --------------------------------- |
| `npm run dev`      | Entorno de desarrollo             |
| `npm run build`    | Build de producción               |
| `npm start`        | Sirve el build                    |
| `npm run lint`     | ESLint (flat config)              |
| `npm run typecheck`| `tsc --noEmit`                    |
| `npm test`         | Tests (Vitest)                    |
| `npm run format`   | Prettier                          |

## Variables de entorno (ver `.env.example`)

| Variable                 | Necesaria | Uso                                           |
| ------------------------ | --------- | --------------------------------------------- |
| `DATABASE_URL`           | Producción | Conexión PostgreSQL (leads persistentes)      |
| `AUTH_SECRET`            | Sí (admin)| Firma de sesiones admin (>=16 chars)          |
| `ADMIN_PASSWORD_HASH`    | Admin     | Hash sha256 de la contraseña admin (recomendado) |
| `ADMIN_PASSWORD`         | Admin/dev | Contraseña admin en claro (solo desarrollo)   |
| `LEAD_WEBHOOK_URL`       | No        | Webhook que recibe el lead cualificado        |
| `LEAD_EMAIL_TO`          | No        | Email destino de los leads (server-only)      |
| `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` | No | SMTP para enviar el lead por email (Gmail: App Password) |
| `LEAD_EMAIL_WEBHOOK_URL` | No        | Alternativa a SMTP: webhook que envía el email |
| `NEXT_PUBLIC_GTM_ID`     | No        | Contenedor GTM (se carga solo con consentimiento) |
| `NEXT_PUBLIC_GA4_ID`     | No        | GA4 directo (alternativa a GTM)               |
| `NEXT_PUBLIC_ADS_ID`     | No        | Google Ads                                    |
| `NEXT_PUBLIC_SITE_URL`   | No        | URL pública (canonical, sitemap, schema)      |

Para generar el hash de la contraseña admin:

```bash
node -e "console.log(require('node:crypto').createHash('sha256').update('TU-CONTRASEÑA').digest('hex'))"
```

> Si no defines `ADMIN_PASSWORD_HASH` ni `ADMIN_PASSWORD`, `/admin` no permite
> entrar. El admin **nunca** depende de ocultar la URL: está protegido por
> `src/proxy.ts` y por comprobación dentro de cada ruta `/api/admin/*`.

## Base de datos

El esquema se crea automáticamente al arrancar cuando hay `DATABASE_URL`
(`src/lib/db/index.ts` → `migrate()`). El SQL también está versionado en
`src/lib/db/schema.sql` para referencia/creación manual.

- Aislamiento por capas: UI → rutas → `LeadRepository` (interfaz en
  `src/lib/db/adapter.ts`) → adaptador concreto (PostgreSQL o memoria).
- Las credenciales solo viven en el servidor. Nada de secrets al navegador.

## Formulario de captación

Formulario cualificador multi-paso (`src/components/lead-form.tsx`):

1. Qué reformar → 2. Tipo de inmueble → 3. Código postal → 4. Tamaño →
5. Cuándo empezar → 6. Contacto.

- Progreso visible, estado conservado al volver atrás, errores accesibles.
- Protección contra spam: honeypot + rate limiting por IP + validación
  server-side (Zod) + idempotencia.
- El doble click está bloqueado durante el envío.
- `generate_lead` solo se lanza cuando el servidor confirmó el guardado.

## Atribución del lead (first-party)

Cómo funciona (`src/lib/attribution/`):

1. En cada página (client-side), se captura la URL, el referrer y la landing.
2. Se extraen solo parámetros de atribución (UTM, `gclid`, `gbraid`, `wbraid`,
   `fbclid`, `msclkid`) y se deduce una `source` legible (utm > plataforma >
   dominio del referrer > `direct`).
3. `first_touch` se escribe **una sola vez** (nunca se sobreescribe);
   `last_touch` se actualiza en cada visita. Se guarda en `localStorage`
   versionado (`oc.attribution.v1`).
4. Al enviar el formulario, first+last touch viajan al servidor y se guardan
   con el lead. Funciona aunque el usuario navegue varias páginas.

El lead recibe un ID único generado **server-side**: `OC-YYYYMMDD-XXXXX`
(legible, sin datos personales). Ver `src/lib/lead-id.ts`.

## Notificación del proveedor

`notifyLead()` (`src/lib/notify.ts`):

1. El lead se guarda primero en la BD y se confirma.
2. Solo entonces se lanza la notificación (no bloquea la respuesta; usa
   `after()`).
3. Notifica por webhook (`LEAD_WEBHOOK_URL`, POST server-side) y/o por email
   (`src/lib/email.ts`). Si algo falla, se registra `notify_status = failed`
   (reintentable) y **nunca** rompe la creación del lead.

El email del lead (`LEAD_EMAIL_TO`, por defecto `inteliagroup1@gmail.com`) y
las credenciales SMTP viven **solo en variables de entorno del servidor**: no
aparecen en el HTML ni en el JS servido al navegador, por lo que no se pueden
ver inspeccionando la web. Para Gmail usa una **contraseña de aplicación**
(SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_SECURE=true).

Abstracción preparada para email / CRM / n8n / Make sin acoplar el proyecto.

## Analytics y consentimiento

- Las cookies no esenciales **no se cargan hasta que** el usuario consiente
  (banner con Aceptar / Rechazar / Configurar, visualmente equivalentes).
- Panel de preferencias: Necesarias (siempre), Analítica, Marketing.
- GTM / GA4 / Ads solo se inyectan si el ID está configurado **y** hay
  consentimiento analítico.
- Eventos: `form_start`, `form_step_complete`, `generate_lead`,
  `click_phone`, `click_whatsapp`, `view_service`, `view_budget_page`.
- **Nunca se envía PII a analítica** (ni nombre, ni teléfono, ni email).

## SEO técnico

- `metadata` API por página (title/description/canonical/OG/robots), `robots.ts`,
  `sitemap.ts`, `manifest.ts`, `icon.svg`.
- JSON-LD honesto: `Organization`, `WebSite`, `FAQPage`, `BreadcrumbList`.
  No se declaran `LocalBusiness`, direcciones, reseñas ni ratings inventados.
- HTML semántico, un único H1 por página, breadcrumbs, internal linking entre
  servicios. Sin keyword stuffing.

## Estructura

```
src/
  app/
    (site)/            # páginas públicas (Header/Footer/Analytics/consent)
      page.tsx         # home
      reformas-*/      # 4 páginas de servicio
      proyectos/       presupuesto/  aviso-legal/  privacidad/  cookies/
    admin/             # panel (protegido, no indexado)
    api/               # /api/leads, /api/admin/*
  components/          # UI pública + admin
  config/              # site.ts (marca) + services.ts + content.ts
  lib/
    db/                # schema, adaptadores (postgres/memory), tipos
    attribution/       # first/last touch
    validation/lead.ts # Zod
    auth.ts  notify.ts  commission.ts  rate-limit.ts  consent.ts
    analytics/  seo/    format.ts  cn.ts
proxy.ts               # protección de /admin (Next 16)
tests/                 # Vitest
```

## Cómo cambiar la marca

Toda la marca vive en `src/config/site.ts`. Cambiar el nombre, descriptor,
teléfono, WhatsApp, email, URL, datos legales, comisión o IDs de analytics se
hace en un único archivo; el resto de la web lo hereda. Los textos largos que
mencionan el nombre están bajo `src/config/`.

## Cómo cambiar de proveedor

1. No hay ninguna referencia pública al proveedor (NEXO GIR aparece solo como
   `providerName` en `site.ts`, usado internamente).
2. Actualiza `LEAD_WEBHOOK_URL` para apuntar al nuevo destino del lead.
3. Revisa los `TODO` de contenido de cada servicio (`src/config/services.ts`).

## Admin

- `/admin/login`: contraseña (env). Sesión con cookie firmada HttpOnly.
- Panel: métricas (leads, cualificados, presupuestos, ganados, valor
  contratado, comisión atribuida).
- `/admin/leads`: búsqueda por nombre/teléfono/ID, filtros por estado y fuente.
- Ficha de lead: estado, importes (presupuesto/contratado/cobrado), notas,
  motivo de pérdida, comisión configurable (tasa + base: contrato o cobrado).
- Exportación CSV: `/api/admin/leads/export`.
- Todo `/admin` y `/api/admin` están no-indexados y protegidos por proxy + ruta.

## Pruebas

```bash
npm test
```

Cubren: generación de lead ID, parsing de atribución, first/last touch,
cálculo de comisión, validación Zod, endpoint de creación de lead (rate
limit, honeypot, persistencia) y sesión admin (firma, caducidad, manipulación).

## Lo que falta antes de producción (TODO)

- Contenido: fotografía real de obra (hoy placeholders de Unsplash marcados
  como TODO), teléfono/WhatsApp/email reales, dominio real, datos legales
  revisados, y validar con el proveedor los TODOs de `services.ts`.
- Proyectos: incorporar obras reales antes de mostrarlas.
- Rate limiting multi-instancia (Redis/KV) si se escala a varias funciones.
- `npx next typegen` / lint / tests en el pipeline de despliegue.
