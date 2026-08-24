import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchComplaints();
  }, []); 

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:5000/api/complaints', formData);
      setComplaints([response.data, ...complaints]);
      setFormData({ title: '', description: '', status: 'Open', priority: 'Medium' });
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit. Did you fill out all fields?");
    }
  };

  // ==========================================
  // NEW: UPDATE FUNCTION (PUT)
  // ==========================================
  const handleUpdateStatus = async (id, currentStatus) => {
    // If it's already resolved, maybe we want to reopen it. Otherwise, mark it Resolved.
    const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
    
    try {
      const response = await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: newStatus });
      
      // Map through our state and replace the old complaint with the updated one from the database
      setComplaints(complaints.map(complaint => 
        complaint._id === id ? response.data : complaint
      ));
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  // ==========================================
  // NEW: DELETE FUNCTION (DELETE)
  // ==========================================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`);
      
      // Filter out the deleted complaint from our React state so it disappears from the screen
      setComplaints(complaints.filter(complaint => complaint._id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Complaint Tracker</h1>

      <form 
        onSubmit={handleSubmit} 
        style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}
      >
        <h2 style={{ marginTop: 0 }}>Submit a Complaint</h2>
        
        <input 
          type="text" 
          name="title" 
          placeholder="Complaint Title (Required)" 
          value={formData.title} 
          onChange={handleInputChange} 
          style={{ width: '96%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        
        <textarea 
          name="description" 
          placeholder="Complaint Description (Required)" 
          value={formData.description} 
          onChange={handleInputChange}
          style={{ width: '96%', marginBottom: '10px', padding: '10px', minHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <select name="priority" value={formData.priority} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Complaint
        </button>
      </form>

      <div>
        <h2>All Complaints ({complaints.length})</h2>
        
        {complaints.length === 0 ? (
          <p>No complaints found. Add one above!</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
              <h3 style={{ marginTop: '0', color: '#333' }}>{complaint.title}</h3>
              <p style={{ color: '#555', lineHeight: '1.5' }}>{complaint.description}</p>
              
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.9em', marginBottom: '15px' }}>
                <span style={{ padding: '4px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                  <strong>Priority:</strong> {complaint.priority}
                </span>
                <span style={{ padding: '4px 8px', backgroundColor: complaint.status === 'Resolved' ? '#d4edda' : '#fff3cd', borderRadius: '4px' }}>
                  <strong>Status:</strong> {complaint.status}
                </span>
              </div>

              {/* NEW: ACTION BUTTONS FOR UPDATE AND DELETE */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleUpdateStatus(complaint._id, complaint.status)}
                  style={{ padding: '6px 12px', backgroundColor: complaint.status === 'Resolved' ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {complaint.status === 'Resolved' ? 'Reopen' : 'Mark Resolved'}
                </button>
                
                <button 
                  onClick={() => handleDelete(complaint._id)}
                  style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;