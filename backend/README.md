# Deployment Instructions

The GoodMatter platform has been successfully architected with a decoupled `frontend/` (Next.js) and `backend/` (Node.js/Express) structure.

## Database (PostgreSQL)
1. Provision a PostgreSQL instance (recommend Neon.tech or Supabase).
2. Insert your connection string into `backend/.env` under `DATABASE_URL`.
3. Run the init script to build your tables:
```bash
cd backend
node scripts/init_db.js
```

## Backend Services (Node.js)
1. Ensure your `.env` contains a `JWT_SECRET`.
2. Install dependencies and start the local environment:
```bash
cd backend
npm install
npm run dev
```
3. To deploy: Connect your repository to **Render** or **Railway**. The start command is `node server.js`.

## Frontend Web (Next.js)
1. Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
2. The UI will be available at `http://localhost:3000`.
3. To deploy: Connect your repository to **Vercel**. Vercel will auto-detect Next.js and build it automatically.
