import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function UserAnalyticsSection() {
  const [chartData, setChartData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const users = response.data;
        
        const getDateString = (createdAtField) => {
          if (!createdAtField) return null;
          if (typeof createdAtField === 'object' && createdAtField.$date) {
            return createdAtField.$date;
          }
          return createdAtField;
        };

        // Filter out Admin users securely (handles case variations like "admin" or "Admin")
        const regularUsers = users.filter(user => {
          const role = user.role ? user.role.toLowerCase() : '';
          return role !== 'admin';
        });

        // 1. Group for Recharts using 'createdAt'
        const dateMap = {};
        regularUsers.forEach(user => {
          const dateStr = getDateString(user.createdAt);
          if (dateStr) {
            const dateOnly = dateStr.split('T')[0];
            dateMap[dateOnly] = (dateMap[dateOnly] || 0) + 1;
          }
        });

        const formattedData = Object.keys(dateMap)
          .sort()
          .map(date => ({
            date: date,
            usersAdded: dateMap[date]
          }));

        setChartData(formattedData);
        
        // 2. Grab latest 4 non-admin users for the activity feed component
        const sortedByDate = [...regularUsers].sort((a, b) => {
          const dateA = new Date(getDateString(a.createdAt) || 0);
          const dateB = new Date(getDateString(b.createdAt) || 0);
          return dateB - dateA;
        });
        
        setRecentUsers(sortedByDate.slice(0, 4));
      })
      .catch(error => {
        console.error('Error loading analytics data:', error);
      });
  }, []);

  return (
    <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      
      {/* Chart Component */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>User Registrations Trend (By Date)</h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            {/* Added barCategoryGap="20%" to pull the bars closer to each other */}
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" allowDecimals={false} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              {/* Reduced barSize to 14 for a thinner profile */}
              <Bar dataKey="usersAdded" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent User Activity Feed Component */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h4 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Recent Signups</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentUsers.map((user) => (
            <div key={user._id} style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user.email}</div>
              <div style={{ fontSize: '0.65rem', color: '#38bdf8', marginTop: '2px' }}>
                Joined: {user.createdAt ? (user.createdAt.$date || user.createdAt).split('T')[0] : 'N/A'} ({user.role})
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}