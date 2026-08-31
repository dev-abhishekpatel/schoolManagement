const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Environment-aware CORS configuration:
// - In development allow any origin (useful for local testing)
// - In production restrict to the frontend deployed on Render and enable credentials
const corsOptions = process.env.NODE_ENV === 'production'
  ? {
      origin: process.env.FRONTEND_URL || 'https://school-frontend.onrender.com',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  : {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

app.use(cors(corsOptions));
app.use(express.json());

// Root & API status endpoints (eliminates "Cannot GET /" when visiting backend URL directly)
app.get('/', (req, res) => {
  const isMongo = require('mongoose').connection.readyState === 1;
  res.json({
    status: 'online',
    message: 'School Management System Backend API is running smoothly 🚀',
    database: isMongo ? 'MongoDB Atlas (Connected)' : 'Local Persistent JSON Store (Active Fallback)'
  });
});

app.get('/api', (req, res) => {
  const isMongo = require('mongoose').connection.readyState === 1;
  res.json({
    status: 'online',
    message: 'School Management System API Root',
    database: isMongo ? 'MongoDB Atlas' : 'Local Persistent JSON Store'
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/library', require('./routes/library'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/leave', require('./routes/leaveRequests'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('❌ SERVER LISTEN ERROR:', err.message);
  });
};

startServer();

// Client-side usage note (example):
// When calling the API from the frontend and you need to send cookies/auth credentials,
// ensure the client uses `withCredentials: true`, for example:
// axios.get(url, { withCredentials: true });

// Serve frontend static build in production if available
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
    console.log('Serving frontend from', frontendDist);
  } else {
    console.warn('Frontend build not found at', frontendDist, '\nMake sure you build the frontend before starting the server.');
  }
}


