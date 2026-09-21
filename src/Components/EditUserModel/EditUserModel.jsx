import React, { useState, useEffect } from 'react';

const EditUserModal = ({ user, onClose, onUpdateSuccess }) => {
  console.log("EditUserModal rendered with user:", user); 

  // 1. ALL HOOKS MUST BE AT THE VERY TOP (Always run in the exact same order)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  // 2. EARLY RETURN IS SAFE HERE (After all hooks have already been called)
  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      onUpdateSuccess(data.user); 
      onClose(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        padding: '24px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #334155',
        color: '#f8fafc'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Edit User Details</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: '#cbd5e1' }}>Name</label>
            <input
              type="text"
              name="name"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', boxSizing: 'border-box' }}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: '#cbd5e1' }}>Email</label>
            <input
              type="email"
              name="email"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', boxSizing: 'border-box' }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

      

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;