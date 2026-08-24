const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint'); // Import the Mongoose model we just made

// ==========================================
// 1. CREATE (POST) - Add a new complaint
// ==========================================
router.post('/', async (req, res) => {
  try {
    // req.body contains the data sent from the frontend (title, description, etc.)
    const newComplaint = new Complaint(req.body); 
    
    // Save it to MongoDB
    const savedComplaint = await newComplaint.save(); 
    
    // Respond with a 201 Created status and the new data
    res.status(201).json(savedComplaint); 
  } catch (error) {
    // If validation fails (e.g., missing title), Mongoose throws an error here
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 2. READ ALL (GET) - Fetch all complaints
// ==========================================
router.get('/', async (req, res) => {
  try {
    // .find() fetches all documents in the complaints collection
    // .sort({ createdAt: -1 }) sorts them newest first
    const complaints = await Complaint.find().sort({ createdAt: -1 }); 
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. READ ONE (GET) - Fetch a single complaint by ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. UPDATE (PUT) - Update an existing complaint
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    // findByIdAndUpdate takes 3 arguments: ID, new data, and options
    // { new: true } ensures it returns the updated document, not the old one
    // { runValidators: true } ensures Mongoose checks the schema rules again
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!updatedComplaint) return res.status(404).json({ message: 'Complaint not found' });
    
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 5. DELETE (DELETE) - Remove a complaint
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) return res.status(404).json({ message: 'Complaint not found' });
    
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;