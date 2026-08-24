const mongoose = require('mongoose');

// Define the blueprint (Schema) for a Complaint
const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A complaint title is required'],
    trim: true, // Removes extra spaces before/after the string
  },
  description: {
    type: String,
    required: [true, 'A complaint description is required'],
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved'], // Restricts the value to only these options
    default: 'Open', // Automatically sets to 'Open' when a new complaint is created
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
}, { 
    // This automatically adds 'createdAt' and 'updatedAt' timestamps to every document
    timestamps: true 
});

// Compile the schema into a model and export it
module.exports = mongoose.model('Complaint', complaintSchema);