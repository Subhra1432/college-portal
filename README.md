# College Portal

A comprehensive college portal for students and teachers with responsive design, featuring a variety of tools for academic management.

## Features

### Student Features
- Student login with college email ID or registration number
- Profile management
- Messaging system to communicate with teachers and other students
- Notice section for college announcements
- Holiday calendar
- Class attendance tracking by subject
- Payment and receipt management
- Academic results view
- Assignment submission system

### Teacher Features
- Teacher login with college email ID or employee ID
- Profile management
- Messaging system to communicate with students and colleagues
- Publish notices to all students or specific departments
- Holiday calendar management
- Attendance upload for students
- Mark upload system (Internal marks, Assignment marks, Test/Quiz marks)
- Class schedule management

## Tech Stack

### Backend
- Node.js with Express
- MongoDB for database
- JSON Web Tokens (JWT) for authentication
- BCrypt for password hashing
- Multer for file uploads

### Frontend
- React.js
- Redux for state management
- Material-UI for responsive design
- Formik and Yup for form validation
- Axios for API requests
- React Router for navigation

## Installation and Setup

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Setup Steps

1. Clone the repository
```
git clone https://github.com/Subhra1432/college-portal.git
cd college-portal
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Configure environment variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-portal
JWT_SECRET=your_jwt_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_password
CLIENT_URL=http://localhost:3000
```

4. Install frontend dependencies
```
cd ../frontend
npm install
```

5. Start the development servers

Backend:
```
cd ../backend
npm run dev
```

Frontend:
```
cd ../frontend
npm start
```

The application should now be running at `http://localhost:3000`.

## License
ISC

## Author
Subhrakanta Behera
