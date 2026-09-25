# OmniPlay Cloud Computing Ecosystem (Monorepo)

A high-performance cloud gaming launcher and node infrastructure management platform.

---

## Architecture Overview

```
omniplay-cloud-computing/
├── frontend/                     # React 19 + Vite + Pure CSS + Three.js Fiber
│   ├── src/
│   │   ├── components/           # UI Components (Hero, LoginPage 3D, Analytics, etc.)
│   │   ├── pure-styles.css       # Core Pure CSS Design System (Zero Tailwind/Bootstrap)
│   │   ├── App.tsx               # Root Component with 3D Auth Routing & RBAC
│   │   └── main.tsx
│   ├── public/                   # Static assets (game posters, Valorant, icons)
│   ├── vite.config.ts            # Vite config with /api reverse proxy to FastAPI
│   └── package.json
│
└── backend/                      # Python FastAPI Microservice
    ├── main.py                   # FastAPI application with Steam Proxy & Data Export
    ├── server.py                 # Direct execution entrypoint
    └── requirements.txt          # fastapi, uvicorn, pydantic
```

---

## Getting Started

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
# Or using uvicorn:
uvicorn main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Steam Details: `GET /api/steam/details?app_id=2182340`
- Export Endpoint: `GET /api/export?format=pdf` or `GET /api/export?format=json`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Local Dev URL: `http://localhost:5173`
- Automatic API Proxy: Requests to `/api/*` are routed to `http://localhost:8000`

---

## Design System & Architecture Constraints
- **Zero Tailwind / Zero Bootstrap**: The frontend strictly utilizes vanilla CSS with custom properties (`pure-styles.css`) and glassmorphic styling.
- **Analytics Export Rule**: `AnalyticsDashboard` maintains a single unified "Export" button revealing PDF & JSON options.
- **3D Auth Flow**: Three.js / React Three Fiber interactive scene on `LoginPage.tsx` with smooth transition into Customer & Admin dashboards.
