const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for all origins and HTTP preflight requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes import
const complaintRoutes = require('./routes/complaintRoutes');

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root route for Vercel deployment check
app.get('/', (req, res) => {
  res.send('Complaint Tracker API is running...');
});

// API routes
app.use('/api/complaints', complaintRoutes);

// Server listener for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Required for Vercel serverless deployment
module.exports = app;