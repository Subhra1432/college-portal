# College Portal - Deployment Guide

## Deploy to Render.com (Free — Get a Shareable Link)

### Step 1: Create a Free MongoDB Database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Try Free**
2. Create an account and a **free M0 cluster**
3. In the left sidebar, click **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Set a username and password (remember these!)
   - Click **Add User**
4. In the left sidebar, click **Network Access** → **Add IP Address** → **Allow Access from Anywhere** → **Confirm**
5. Go back to **Database** → click **Connect** on your cluster → **Drivers**
6. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `yourpassword` with the password you set in step 3

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) → sign up with your **GitHub** account
2. Click **New** → **Web Service**
3. Connect your `college-portal` GitHub repository
4. Fill in these settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `college-portal` (or any name you like) |
   | **Runtime** | `Node` |
   | **Build Command** | `npm run render-build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

5. Scroll down to **Environment Variables** and add:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | *(paste your MongoDB connection string from Step 1)* |
   | `JWT_SECRET` | *(any random string, e.g. `my-super-secret-key-12345`)* |

6. Click **Create Web Service**

### Step 3: Get Your Link

- Render will build and deploy your app (takes 2–5 minutes)
- Once done, you'll see a green **Live** badge and a URL like:
  ```
  https://college-portal-xxxx.onrender.com
  ```
- **Share this URL** with anyone — they can open it in their browser!

> **Note:** Free Render services sleep after 15 minutes of inactivity. The first visit after sleep takes ~30 seconds to load.

---

## Alternative: Deploy via Render Blueprint (One-Click)

1. Push this repo to your GitHub account
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
3. Select your repository — Render auto-detects the `render.yaml` file
4. Fill in `MONGO_URI` when prompted (from Step 1 above)
5. Click **Apply** — done!

---

## Local Development

```bash
# Clone and install
git clone https://github.com/Subhra1432/college-portal.git
cd college-portal
npm run install-all

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and a JWT secret

# Start development servers
# Terminal 1 - Backend (port 5000)
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend && npm start
```

Open http://localhost:3000 in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes (deploy) | Set to `production` for deployment |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Any random secret string for auth tokens |
| `PORT` | No | Server port (Render sets this automatically) |
| `CLIENT_URL` | No | Auto-set by Render; for CORS if frontend is on a different domain |
| `EMAIL_SERVICE` | No | Email provider for notifications (e.g., `gmail`) |
| `EMAIL_USERNAME` | No | Email address for sending notifications |
| `EMAIL_PASSWORD` | No | App password for the email account |

