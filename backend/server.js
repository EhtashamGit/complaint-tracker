const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// 1. We imported your new routes here
const complaintRoutes = require('./routes/complaintRoutes'); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Complaint Tracker API is running...');
});

// 2. We told Express to use those routes here
app.use('/api/complaints', complaintRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});