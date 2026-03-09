# College Portal - Deployment Guide

## Prerequisites

- Node.js (v18+) and npm
- MongoDB Atlas account (free tier available at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas))
- A [Render.com](https://render.com) account (free tier available)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port (default: 5000) | No |
| `MONGO_URI` | MongoDB connection string | **Yes** |
| `JWT_SECRET` | Secret key for JWT token signing (use a strong random value) | **Yes** |
| `NODE_ENV` | Set to `production` for deployment | **Yes** |
| `CLIENT_URL` | Your Render app URL for CORS (e.g., `https://college-portal-xxxx.onrender.com`) | **Yes** |
| `EMAIL_SERVICE` | Email service provider (e.g., gmail) | No |
| `EMAIL_USERNAME` | Email address for sending notifications | No |
| `EMAIL_PASSWORD` | App password for the email account | No |

## Local Development

1. Copy `backend/.env.example` to `backend/.env` and fill in your values
2. Start the backend: `cd backend && npm run dev`
3. Start the frontend: `cd frontend && npm start`

## Deploy to Render (Recommended)

### Option 1: One-Click Deploy with Blueprint

1. Push this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint**
4. Connect your GitHub repository — Render will detect the `render.yaml` file
5. Fill in the required environment variables (`MONGO_URI`, `CLIENT_URL`)
6. Click **Apply** — Render will build and deploy automatically
7. Once deployed, set `CLIENT_URL` to your Render app URL (e.g., `https://college-portal-xxxx.onrender.com`)

### Option 2: Manual Setup on Render

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `college-portal`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install && cd ../frontend && npm install && npm run build`
   - **Start Command**: `cd backend && node server.js`
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random secret
   - `CLIENT_URL` = your Render app URL (update after first deploy)
5. Click **Create Web Service**

### After Deployment

- Your app will be available at `https://your-service-name.onrender.com`
- Share this URL with anyone to give them access to the portal
- The backend serves both the API and the React frontend from the same URL
- **Note**: Free tier services on Render spin down after inactivity; the first request after idle may take ~30 seconds

## Setting Up MongoDB Atlas

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier is sufficient)
3. Go to **Database Access** → create a database user with a password
4. Go to **Network Access** → add your Render service's [outbound IP addresses](https://docs.render.com/static-outbound-ip-addresses), or use `0.0.0.0/0` for initial testing only (restrict to specific IPs for production)
5. Go to **Database** → click **Connect** → **Connect your application**
6. Copy the connection string and replace `<password>` with your database user password
7. Use this as your `MONGO_URI` environment variable
