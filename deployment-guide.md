# College Portal - Deployment Instructions

## Step-by-Step Deployment

### 1. Set Up MongoDB Atlas

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with a strong password
4. Whitelist your server IP address (or allow access from anywhere for development)
5. Get the connection string and update `MONGO_URI` in your environment variables

### 2. Deploy Backend

1. Choose a hosting platform (Render, Railway, Heroku, etc.)
2. Set all required environment variables from `backend/.env.example`
3. Set `NODE_ENV=production`
4. Set the start command to `node server.js`

### 3. Deploy Frontend

1. Update `REACT_APP_API_URL` to point to your deployed backend URL
2. Build the frontend: `npm run build`
3. Serve the `build` directory via your hosting platform or the backend server

### 4. Verify

1. Test user registration and login
2. Verify all API endpoints are working
3. Check CORS is configured for your production domain
