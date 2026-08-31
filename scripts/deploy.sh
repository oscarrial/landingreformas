#!/usr/bin/env bash
# ====================================================================
# KOFLAT — deploy script (Ubuntu + PM2)
# Uso: bash scripts/deploy.sh
# Variable opcionales:
#   KOFLAT_APP_DIR  — ruta de la app (por defecto: raíz del repo)
#   PM2_NAME        — nombre del proceso PM2 (por defecto: koflat)
# ====================================================================
set -euo pipefail

APP_DIR="${KOFLAT_APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
PM2_NAME="${PM2_NAME:-koflat}"
CHECK_PORT="${CHECK_PORT:-3000}"

echo "→ Directorio: ${APP_DIR}"
echo "→ Proceso PM2: ${PM2_NAME}"

cd "${APP_DIR}"

# 1) Trae la última versión (aborta si hay cambios locales sin subir).
echo "→ git pull"
git pull --ff-only

# 2) Dependencias (rápido si no hubo cambios en package-lock.json).
echo "→ npm install"
npm install --no-audit --no-fund

# 3) Build de producción (los NEXT_PUBLIC_* se incrustan aquí).
echo "→ npm run build"
npm run build

# 4) Reinicia el proceso (con refresco de variables de entorno).
echo "→ pm2 restart ${PM2_NAME}"
pm2 restart "${PM2_NAME}" --update-env

# 5) Smoke test: la web debe responder después de reiniciar.
echo "→ Health check (localhost:${CHECK_PORT})"
for _ in $(seq 1 15); do
  sleep 1
  if curl -fsS -o /dev/null "http://localhost:${CHECK_PORT}/"; then
    echo "✓ Despliegue completado. La web responde."
    exit 0
  fi
done

echo "✗ La web NO responde tras 15 s. Revisa: pm2 logs ${PM2_NAME} --err" >&2
exit 1
