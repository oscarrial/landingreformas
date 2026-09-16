# SEO & Analytics

Documentación técnica de SEO y medición del sitio KOFLAT (Next.js 16 · App Router).

## Configuración

### Variables de entorno

```env
# URL pública. Se usa para canonical, sitemap, robots, Open Graph y JSON-LD.
# Para clientes (Next la inlinea en el build) usa el prefijo NEXT_PUBLIC_.
NEXT_PUBLIC_SITE_URL=https://koflat.es
# Alternativa server-side (canonical/sitemap/robots/schema). Si defines solo
# esta, el canonical sale correcto porque esas piezas se generan en el server.
SITE_URL=https://koflat.es

# Google Tag Manager (hub central de medición).
# Es NEXT_PUBLIC_ porque el cliente decide si cargar el contenedor según consentimiento.
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# Alias equivalente si prefieres el nombre GTM_CONTAINER_ID para clientes.
NEXT_PUBLIC_GTM_CONTAINER_ID=

# Fallback de GA4 SOLO si no usas GTM. Si configuras GTM, no pongas este ID
# (evita cargar GA4 dos veces).
NEXT_PUBLIC_GA4_ID=

# Google Ads (se configura desde GTM; variable opcional de referencia).
NEXT_PUBLIC_ADS_ID=

# Staging / previews: pon NEXT_PUBLIC_NOINDEX=1 para noindex + robots disallow.
NEXT_PUBLIC_NOINDEX=
```

> Los IDs de Google no son secretos, pero se mantienen configurables por entorno
> para poder usar contenedores/propiedades distintas entre dev y producción.

## Google Tag Manager

- **Dónde se carga:** `src/components/providers/analytics-provider.tsx`, montado en
  los layouts público (`(site)` y `(landing)`). Solo **un** provider por ruta, así
  que nunca hay doble carga.
- **Cuándo se carga:** el contenedor GTM se inyecta siempre que
  `NEXT_PUBLIC_GTM_ID` esté configurado, pero con **Consent Mode en `denied` por
  defecto**: hasta que el visitante decide en el banner, las etiquetas de Google
  funcionan en modo sin cookies (sin `analytics_storage`/`ad_storage`). Al aceptar,
  se envía el `update` con las señales concedidas. Esto permite que Google Ads
  detecte la etiqueta (informe de cobertura) sin escribir cookies antes del
  consentimiento.
- **Cómo cambiar el container:** `NEXT_PUBLIC_GTM_ID` (o `NEXT_PUBLIC_GTM_CONTAINER_ID`).
- **Verificación:** Google Tag Manager → Preview + Debug (el contenedor recibe
  `gtm.js`, `gtm.start`). GA4 → DebugView.
- **dataLayer:** se inicializa con `window.dataLayer = window.dataLayer || []` y un
  stub de `gtag()` ANTES de que GTM cargue (`AnalyticsProvider`, orden de scripts).

### Page views (App Router / SPA)

Next.js navega en cliente. La estrategia elegida:

1. El tag GA4 en GTM dispara con el trigger **"All Pages"** en la primera carga
   (`page_view` automático de GTM).
2. En cada cambio de ruta por cliente, la aplicación empuja
   `next_route_change` con `page_location`. Para medir esas navegaciones, crea en
   GTM un tag GA4 disparado por **Custom Event: `next_route_change`**.

La aplicación **nunca** empuja un `page_view` manual, para no contar dos veces.

## Consentimiento (Consent Mode v2)

- Módulo: `src/lib/analytics/consent-mode.ts`.
- **Por defecto todo `denied`** (`analytics_storage`, `ad_storage`, `ad_user_data`,
  `ad_personalization`), inyectado antes de que GTM cargue.
- El banner (`src/components/widgets/cookie-banner.tsx`) guarda la cookie
  `intelia_consent_v1` y dispara el evento `koflat:consent`. El provider escucha
  y aplica el **update** de Consent Mode con el estado del visitante.
- Mapeo de categorías:
  | Categoría del CMP | Señales Consent Mode v2 |
  |---|---|
  | Analítica | `analytics_storage` |
  | Marketing | `ad_storage`, `ad_user_data`, `ad_personalization` |
  | Necesarias | siempre activas (no se mapean) |

> El CMP/banner ya existe y está conectado; no hace falta otro. Verifica que el
> contenedor GTM use **Consent Mode (Set default + Update)** y que cada tag tenga
> su señal de consentimiento correcta.

## Eventos

Abstracción: `pushToDataLayer(event, params)` en `src/lib/analytics/client.ts`.
Todos los eventos se disparan **solo con consentimiento de analítica** y **nunca
incluyen PII** (teléfono, email, nombre, dirección o texto de usuario).

| Evento | Cuándo se dispara | Parámetros | Ejemplo | Utilidad |
|---|---|---|---|---|
| `next_route_change` | Cambio de ruta (navegación cliente) | `page_location` | `{page_location: "/presupuesto"}` | Page view SPA (GA4) |
| `form_start` | El usuario empieza el wizard | `first_touch_source`, `last_touch_source` | — | Embudo de conversión |
| `form_step_complete` | Completa cada paso | `step` | `{step: 2}` | Abandono por paso |
| `generate_lead` | El servidor ACEPTA el lead | `lead_id` (sin PII) | `{lead_id: "KOF-…"}` | Conversión principal (Google Ads) |
| `formulario_presupuesto_enviado` | Igual que `generate_lead` (se muestra el "gracias") | — | — | Alias para las conversiones del equipo de Ads |
| `form_error` | Fallo al enviar el formulario | `error_key` | `{error_key: "server"}` | Detección de fricción |
| `click_phone` | Clic en teléfono | — | — | Conversión de contacto |
| `click_whatsapp` | Clic en WhatsApp | — | — | Conversión de contacto |
| `click_cta` | Clic en un CTA (header, landing) | `cta_name`, `destination` | `{cta_name: "Pedir presupuesto", destination: "/presupuesto"}` | Rendimiento de CTAs |
| `view_service` | Vista de una página de servicio | `service` (slug) | `{service: "reformas-cocinas-madrid"}` | Interés por servicio |
| `view_budget_page` | Vista de /presupuesto | — | — | Embudo |

> En GTM: `generate_lead` debe configurarse como conversión de Google Ads, y los
> eventos recomendados de GA4 (`generate_lead`, `form_start`, etc.) pueden
> marcarse como clave. Nunca añadas a los tags variables que contengan PII.

## SEO

- **Metadata:** `src/lib/seo/metadata.ts`. Cada página define `title`, `description`,
  `canonical`, Open Graph, Twitter cards y `robots` vía `buildMetadata(...)`. El
  `title` global se compone con la marca desde `src/app/layout.tsx`.
- **Canonical:** absoluto, construido desde `SITE_URL`/`NEXT_PUBLIC_SITE_URL`.
- **Sitemap:** `src/app/sitemap.ts` (solo URLs públicas e indexables; excluye admin).
  Referenciado en `robots.txt`.
- **robots.txt:** `src/app/robots.ts`. Permite `/`, bloquea `/admin` y `/api/admin`.
  Con `NEXT_PUBLIC_NOINDEX=1` (o sin `NEXT_PUBLIC_SITE_URL`) bloquea todo (staging).
- **JSON-LD:** `src/lib/seo/schema.ts` → `Organization`, `WebSite`, `Service`,
  `FAQPage`, `BreadcrumbList`. Solo schemas honestos; sin reviews/ratings/precios
  inventados.
- **Páginas noindex:** `/admin/*` (layout admin + proxy) y cualquier página con
  `noindex` en su metadata.
- **Breadcrumbs:** visibles + `BreadcrumbList` en las páginas de servicio.
- **Semántica:** `lang="es"`, un único `H1` por página, jerarquía de encabezados,
  `main`/`nav`/`header`/`footer`, imágenes con `alt` descriptivo y `next/image`.
- **Sin spam SEO:** no hay keyword stuffing, doorway pages, reviews falsas ni meta
  keywords.

## Producción — checklist de lanzamiento

- [ ] Configurar `NEXT_PUBLIC_SITE_URL` (y `SITE_URL`) a `https://koflat.es`.
- [ ] Configurar `NEXT_PUBLIC_GTM_ID` con el contenedor real.
- [ ] Crear/publicar el contenedor GTM.
- [ ] Configurar GA4 desde GTM (tag "All Pages" + tag en `next_route_change`).
- [ ] Configurar Consent Mode en GTM (default + update).
- [ ] Verificar eventos con GTM Preview.
- [ ] Verificar GA4 DebugView.
- [ ] Conectar Google Ads: conversión `generate_lead`.
- [ ] Conectar Search Console y enviar `sitemap.xml`.
- [ ] Comprobar `robots.txt` y `sitemap.xml` públicos.
- [ ] Validar canonical, JSON-LD y Open Graph (Rich Results Test).
- [ ] Revisar páginas noindex (`/admin`).
- [ ] Comprobar que no hay doble `page_view` ni trackers duplicados.
- [ ] Comprobar que no se envía PII a Analytics.
- [ ] Ejecutar Lighthouse / PageSpeed y revisar Core Web Vitals.
- [ ] Probar navegación desktop/mobile.
