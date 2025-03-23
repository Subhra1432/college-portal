# Accessing Your College Portal From Other Devices

This guide will help you access your College Portal application from other devices on the same network.

## Method 1: Local Network Access (Development Mode)

1. **Find your computer's IP address:**
   - On Mac: Open Terminal and type `ipconfig getifaddr en0`
   - On Windows: Open Command Prompt and type `ipconfig` (look for IPv4 Address)
   - On Linux: Open Terminal and type `hostname -I`

2. **Start the application:**
   - Run the start script: `./start-app.sh`
   - This will start both frontend and backend servers with the correct configuration

3. **Access from other devices:**
   - On other devices on the same network, open a browser and go to:
     - `http://YOUR_IP_ADDRESS:3000`
     - For example: `http://192.168.1.5:3000`

## Method 2: Deploy to a Hosting Service

For a more permanent solution where you can access your application from anywhere:

1. **Set up MongoDB Atlas for your database:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Configure network access to allow connections from anywhere
   - Create a database user
   - Get your MongoDB connection string

2. **Deploy backend to Render.com:**
   - Create a free account on [Render](https://render.com/)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the build command to `npm install`
   - Set the start command to `npm start`
   - Add the environment variables (including MONGO_URI)

3. **Deploy frontend to Render.com:**
   - Create a new Web Service
   - Connect your GitHub repository (same as backend)
   - Set the build command to `cd frontend && npm install && npm run build`
   - Set the start command to `cd frontend && npm start`

4. **Access from anywhere:**
   - Use the URL provided by Render for your frontend service
   - Share this URL with anyone who needs access to your application

## Troubleshooting

- **Firewall Issues:** Make sure your firewall allows connections on ports 3000 and 5000
- **CORS Errors:** If you see CORS errors in the console, check that the backend CORS configuration is correctly set up
- **Connection Refused:** Make sure both frontend and backend servers are running
- **Authentication Issues:** Clear your browser cache and local storage, then try logging in again

For more detailed instructions, refer to the deployment guides in the `deployment` directory. 