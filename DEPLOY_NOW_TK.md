# Secondo Zerlig deploy tertibi

Bu proýekt iki bölekden durýar:

- frontend/ — React + Vite. Muny Vercel-e goý.
- backend/ — Django API. Muny Render-e goý.

## 1) GitHub
Şu arassa papkany GitHub repository içine ýükle. `node_modules`, `venv`, `.env`, `__pycache__` goýma.

## 2) Backend Render
Render → New → Blueprint ýa-da Web Service.
Repo saýla. Eger manual goýsaň:

Root Directory: backend
Build Command: ./build.sh
Start Command: gunicorn config.wsgi:application

PostgreSQL database döret we DATABASE_URL env goş.

## 3) Frontend Vercel
Vercel → Add New → Project → repo saýla.
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Environment Variable: VITE_API_URL = Render backend linki

## 4) Backend CORS täzelenmeli
Vercel linkiň taýýar bolanda Render backend env içinde:
CORS_ALLOWED_ORIGINS=https://seniň-vercel-linkiň.vercel.app
CSRF_TRUSTED_ORIGINS=https://seniň-vercel-linkiň.vercel.app
soň backend redeploy et.
