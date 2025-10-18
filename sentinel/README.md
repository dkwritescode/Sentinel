## Sentinel (MERN)

Quick start

1. Backend
   - cd `sentinel/server`
   - npm i
   - Create `.env` with `PORT=5000` and optional `MONGO_URI`
   - npm run dev

2. Frontend
   - cd `sentinel/client`
   - npm i
   - Create `.env` with `VITE_API_URL=http://localhost:5000`
   - npm run dev

Open the app at the URL Vite prints (usually `http://localhost:5173`).

APIs
 - `POST /api/scan/url` { url }
 - `POST /api/scan/email` { subject, body }
 - `POST /api/chat` { message }
 - `GET /api/health`

This repository ships with mocked security logic to demonstrate the UX quickly. Replace the mocks with your ML models or external security services as needed.


