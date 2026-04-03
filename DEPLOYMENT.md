# AI Resume Screening Portal - Deployment Guide

This project consists of a React (Vite) frontend and a Spring Boot (Java 17) backend. The database is hosted externally on NeonDB. The services can be run locally via Docker Compose or deployed to production PaaS providers.

## Local Development (Docker)

1. Navigate to the root folder.
2. Ensure Docker Desktop is running.
3. Run the stack:
   ```bash
   GEMINI_API_KEY=your_google_ai_key docker-compose up --build
   ```
4. Frontend is available at `http://localhost:5173`.
5. Backend API is available at `http://localhost:4040`.

## Production Deployment - Frontend (Vercel)

Vercel is the recommended hosting provider for the React frontend:

1. Create a GitHub repo and push the `frontend/` folder.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Do not forget to configure the absolute Backend URL if pushing to production:
   - In Vercel Environment Variables, you'd usually set `VITE_API_URL=https://your-backend.onrender.com`. 
   - Note: update `axiosConfig.js` to use `import.meta.env.VITE_API_URL || 'http://localhost:4040/api'`.
6. Click **Deploy**.

## Production Deployment - Backend (Render)

Render makes containerized Spring Boot deployments very easy.

1. Create a GitHub repo and push the `backend/` folder (which includes the `Dockerfile`).
2. Sign in to [Render](https://render.com/) and create a **Web Service**.
3. Connect your repository.
4. Render will automatically detect the Dockerfile.
5. In the **Environment Variables** section on Render, add:
   - `GEMINI_API_KEY`: <your-api-key>
   - `JWT_SECRET`: <generate-a-long-secure-random-string>
   - Note: The NeonDB connection credentials are hardcoded in `application.properties`, but for security, you should also override `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` as Render environment variables.
6. Click **Deploy Web Service**.
