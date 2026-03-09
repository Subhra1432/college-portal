# College Portal - Deployment Guide

## Prerequisites

- Node.js (v18+) and npm
- MongoDB Atlas account or local MongoDB instance
- A hosting platform (e.g., Render, Railway, Heroku)

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing (use a strong random value) |
| `EMAIL_SERVICE` | Email service provider (e.g., gmail) |
| `EMAIL_USERNAME` | Email address for sending notifications |
| `EMAIL_PASSWORD` | App password for the email account |
| `CLIENT_URL` | Frontend URL for CORS configuration |

## Local Development

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm start`

## Production Deployment

1. Set up MongoDB Atlas and get your connection string
2. Deploy the backend with all environment variables configured
3. Build the frontend: `cd frontend && npm run build`
4. The backend serves the frontend build in production mode
