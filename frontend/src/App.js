import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Live Vercel Backend URL
const API_BASE_URL = 'https://complaint-tracker-u2ve.vercel.app';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium Priority',
    status: 'Open'
  });

  // Fetch initial complaints from backend database
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/complaints`);
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new complaint (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/complaints`, formData);
      setComplaints([response.data, ...complaints]);
      setFormData({ title: '', description: '', priority: 'Medium Priority', status: 'Open' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit. Did you fill out all fields?');
    }
  };

  // Toggle status (PUT)
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
    try {
      const response = await axios.put(`${API_BASE_URL}/api/complaints/${id}`, { status: newStatus });
      setComplaints(
        complaints.map((complaint) =>
          complaint._id === id ? response.data : complaint
        )
      );
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  // Delete complaint (DELETE)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/complaints/${id}`);
      setComplaints(complaints.filter((complaint) => complaint._id !== id));
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className="App">
      <h1>Complaint Tracker</h1>

      <div className="card">
        <h2>Submit a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <div className="select-group">
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low Priority">Low Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="High Priority">High Priority</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button type="submit">Submit Complaint</button>
        </form>
      </div>

      <h2>All Complaints ({complaints.length})</h2>
      {complaints.length === 0 ? (
        <p>No complaints found. Add one above!</p>
      ) : (
        <div className="complaint-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <h3>{complaint.title}</h3>
              <p>{complaint.description}</p>
              <div className="tags">
                <span className="badge">{complaint.priority}</span>
                <span className="badge status">{complaint.status}</span>
              </div>
              <div className="actions">
                <button onClick={() => handleUpdateStatus(complaint._id, complaint.status)}>
                  Toggle Status
                </button>
                <button onClick={() => handleDelete(complaint._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;